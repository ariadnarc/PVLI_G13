/**
 * @file CrocoShoot.js
 * @class CrocoShoot
 * @extends Phaser.Scene
 * @description Minijuego de balista con movimiento de proyectiles manual (sin Phaser Physics).
 * Las flechas se mueven en línea recta y el juego incluye condiciones de Victoria/Derrota.
 */

import { DIFICULTADES } from '../config/MinigameData.js';

export default class CrocoShoot extends Phaser.Scene {
    constructor() {
        super('CrocoShoot');
    }

    /**
     * @property {number} maxEscapes - Máximo de cocodrilos que pueden pasar antes de Game Over.
     * @property {number} escapesCount - Cocodrilos que han pasado.
     * @property {number} totalCrocodilesToKill - Total de cocodrilos a generar y matar.
     * @property {number} killedCrocodilesCount - Cocodrilos eliminados.
     * @property {number} spawnedCrocodilesCount - Cocodrilos generados hasta ahora.
     */
    init(data = {}) {
        this.isMinigame = true;
        // Guardamos el minijuego
        this.minijuego = data.minijuego;
        // Dificultad elegida
        this.difficulty = data.dificultad;

        const config = DIFICULTADES[this.difficulty].minijuegos.CrocoShoot;
        // Var.
        this.escapesCount = 0;
        this.killedCrocodilesCount = 0;
        this.spawnedCrocodilesCount = 0;
        this.gameIsOver = false;

        // Constantes
        this.ROTATION_SPEED = 0.8;   // Velocidad de rotación balista
        this.SHOOT_SPEED = 600;      // Velocidad de la flecha (píxeles/segundo)
        this.CROCO_SPEED = -100;     // Velocidad X de los cocodrilos (píxeles/segundo)
        this.MIN_ANGLE = -45;
        this.MAX_ANGLE = 45;
        this.canShoot = true;

        // Vienen dados por dificultad
        this.maxEscapes = config.vidas;
        this.shootCooldown = config.cadencia;
        this.totalCrocodilesToKill = config.cantSacamuelas;
    }

    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        // FONDO
        this.fondo = this.add.image(0, 0, 'fondoCroco').setOrigin(0);
        this.fondo.setDisplaySize(this.game.config.width, this.game.config.height);

        // CONTROLES
        this.keys = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE
        });

        this.bgMusic = this.sound.add('minigame-music');
        this.bgMusic.play();

        // JUGADOR
        this.player = this.add.image(80, 450, 'balista');
        this.player.setOrigin(0.5, 0.5); // importante para que rote desde el centro
        this.player.setScale(0.05);
        this.player.angle = 0;

        // GRÁFICOS Y GRUPOS
        this.trajectory = this.add.graphics(); // Para la línea predictiva
        this.arrows = this.add.group();
        this.crocodiles = this.add.group();

        // GENERACIÓN DE COCODRILOS
        this.crocodileSpawnTimer = this.time.addEvent({
            delay: 2000,
            callback: this.spawnCrocodile,
            callbackScope: this,
            loop: true,
            paused: false
        });

        // HUD
        this.livesText = this.add.text(centerX - 50, 16, this.getLivesText(), {
            fontFamily: 'Filgaia',
            color: '#382f23ff',
            fontSize: '32px',
        }).setScrollFactor(0);
    }

    update(time, delta) {
        if (this.gameIsOver) return;

        // Convertir delta de ms a segundos
        const deltaSeconds = delta / 1000;

        // Rotación
        if (this.keys.left.isDown) {
            this.player.angle -= this.ROTATION_SPEED;
        }
        if (this.keys.right.isDown) {
            this.player.angle += this.ROTATION_SPEED;
        }
        this.player.angle = Phaser.Math.Clamp(this.player.angle, this.MIN_ANGLE, this.MAX_ANGLE);

        // Trayectoria
        if (this.canShoot) {
            this.drawTrajectory();
        } else {
            this.trajectory.clear();
        }

        // Pium
        if (Phaser.Input.Keyboard.JustDown(this.keys.space) && this.canShoot) {
            this.shootArrow();
        }

        // MOvimiento manual NO por físicas
        this.moveArrows(deltaSeconds);
        this.moveCrocodiles(deltaSeconds);
        this.checkCollisions();

        // Aquí somos limpios
        this.checkGameConditions();
        this.cleanupObjects();
    }

    // ---------------------------------------------------------
    //  MÉTODOS DE LÓGICA DE JUEGO
    // ---------------------------------------------------------

    /**
     * Dibuja una línea recta predictiva (preview lineal).
     */
    drawTrajectory() {
        this.trajectory.clear();
        this.trajectory.lineStyle(2, 0xffffff, 0.8);

        const angleRad = Phaser.Math.DegToRad(this.player.angle);
        const startX = this.player.x + 25;
        const startY = this.player.y;

        // Usamos una longitud grande para que la línea llegue al borde
        const LINE_LENGTH = 250;

        const endX = startX + Math.cos(angleRad) * LINE_LENGTH;
        const endY = startY + Math.sin(angleRad) * LINE_LENGTH * 1;

        this.trajectory.strokeLineShape(new Phaser.Geom.Line(startX, startY, endX, endY));
    }

    /**
     * Crea y dispara una flecha en línea recta.
     */
    shootArrow() {
        this.canShoot = false;

        const angleRad = Phaser.Math.DegToRad(this.player.angle);
        const startY = this.player.y;

        let arrow = this.add.image(this.player.x + 25, startY, 'flechaCroco');
        arrow.setScale(0.08);
        arrow.setRotation(angleRad);

        // Calcular los componentes X e Y de la velocidad
        arrow.speedX = Math.cos(angleRad) * this.SHOOT_SPEED;
        arrow.speedY = Math.sin(angleRad) * this.SHOOT_SPEED * 1; // Y negativa para que suba con ángulo negativo

        this.arrows.add(arrow);

        // Reactivar disparo
        this.time.delayedCall(this.shootCooldown, () => {
            this.canShoot = true;
        });
    }

    /**
     * Mueve las flechas manualmente según su velocidad (recta).
     * @param {number} deltaSeconds - Tiempo transcurrido desde el último frame en segundos.
     */
    moveArrows(deltaSeconds) {
        this.arrows.children.each(arrow => {
            arrow.x += arrow.speedX * deltaSeconds;
            arrow.y += arrow.speedY * deltaSeconds;
        });
    }

    /**
     * Genera un nuevo cocodrilo y establece su velocidad.
     */
    spawnCrocodile() {
        if (this.spawnedCrocodilesCount >= this.totalCrocodilesToKill) {
            this.crocodileSpawnTimer.paused = true;
            return;
        }

        const y = Phaser.Math.Between(100, this.game.config.height - 100);
        const croco = this.add.image(this.game.config.width + 50, y, 'sacamuelas');
        croco.setScale(0.7);

        croco.speedX = this.CROCO_SPEED;
        this.crocodiles.add(croco);
        this.spawnedCrocodilesCount++;
    }

    /**
     * Mueve los cocodrilos manualmente hacia la izquierda.
     * @param {number} deltaSeconds - Tiempo transcurrido desde el último frame en segundos.
     */
    moveCrocodiles(deltaSeconds) {
        this.crocodiles.children.each(croco => {
            croco.x += croco.speedX * deltaSeconds;
        });
    }

    /**
     * Verifica colisiones entre flechas y cocodrilos usando geometría (bounding boxes).
     */
    checkCollisions() {
        this.arrows.children.each(arrow => {
            this.crocodiles.children.each(crocodile => {
                if (arrow.active && crocodile.active) {
                    const arrowBounds = arrow.getBounds();
                    const crocoBounds = crocodile.getBounds();

                    if (Phaser.Geom.Intersects.RectangleToRectangle(arrowBounds, crocoBounds)) {
                        this.hitCrocodile(arrow, crocodile);
                    }
                }
            });
        });
    }

    /**
     * Maneja la colisión entre una flecha y un cocodrilo.
     * @param {Phaser.GameObjects.GameObject} arrow 
     * @param {Phaser.GameObjects.GameObject} crocodile 
     */
    hitCrocodile(arrow, crocodile) {
        if (this.gameIsOver) return;

        arrow.destroy();
        crocodile.destroy();

        this.killedCrocodilesCount++;

        this.checkGameConditions();
    }

    /**
     * Elimina objetos que salen de la pantalla y cuenta los escapes de cocodrilos.
     */
    cleanupObjects() {
        // Flechas fuera de la pantalla
        this.arrows.children.each(arrow => {
            if (arrow.x > this.game.config.width + 50 || arrow.x < -50 || arrow.y > this.game.config.height + 50 || arrow.y < -50) {
                arrow.destroy();
            }
        });

        // Cocodrilos que escapan por la izquierda
        this.crocodiles.children.each(croco => {
            if (croco.x < -100 && croco.active) {
                croco.destroy();
                this.escapesCount++;
                this.livesText.setText(this.getLivesText());

                this.checkGameConditions();
            }
        });
    }

    /**
     * Genera el texto del HUD de vidas/escapes.
     * @returns {string} Texto formateado.
     */
    getLivesText() {
        const remaining = this.maxEscapes - this.escapesCount;
        return `VIDAS: ${remaining}`;
    }

    /**
     * Verifica las condiciones de victoria y derrota.
     */
    checkGameConditions() {

        if (this.gameIsOver) return;

        // DERROTA inmediata por demasiados escapes
        if (this.escapesCount >= this.maxEscapes) {
            this.gameIsOver = true;
            this.endAsDefeat();
            return;
        }

        // Si ya generamos todos los cocodrilos y no queda ninguno activo en pantalla,
        // significa que la ronda ha terminado (todos muertos o escaparon).
        // Entonces decidimos victoria/derrota segun kills.
        if (this.spawnedCrocodilesCount >= this.totalCrocodilesToKill && this.crocodiles.countActive(true) === 0) {
            this.gameIsOver = true;

            // Si mataste al menos la cantidad objetivo => victoria, sino derrota.
            if (this.killedCrocodilesCount >= this.totalCrocodilesToKill) {
                this.endAsVictory();
            } else {
                this.endAsDefeat();
            }
            return;
        }

        // Nota: mantenemos la condicion anterior (si matas el 'total' antes de que se generen todos)
        // por compatibilidad: si por alguna razon killed >= total y spawned >= total (ya cubierto arriba),
        // no llega aquí.
    }


    // ========== VICTORIA ==========
    endAsVictory() {
        if (this.crocodileSpawnTimer) this.crocodileSpawnTimer.remove(false);
        this.bgMusic.stop();
        this.physics.pause();

        // Lanzar menu de resultado
        this.scene.launch('PostMinigameMenu', {
            result: 'victory',
            difficulty: this.difficulty,
            minijuego: 'CrocoShoot',
            options: {
                "Salir": () => {
                    this.scene.stop('PostMinigameMenu');
                    this.scene.start('MapScene');
                }
            }
        });

        this.scene.stop();
    }

    // ========== DERROTA ==========
    endAsDefeat() {
        if (this.crocodileSpawnTimer) this.crocodileSpawnTimer.remove(false);
        this.physics.pause();
        this.bgMusic.stop();

        this.scene.launch('PostMinigameMenu', {
            result: 'defeat',
            difficulty: this.difficulty,
            minijuego: 'CrocoShoot',
            options: {
                "Reintentar": () => {
                    this.scene.stop('PostMinigameMenu');
                    this.scene.start('CrocoShoot', { minijuego: this.minijuego, dificultad: this.difficulty });
                },
                "Salir": () => {
                    this.scene.stop('PostMinigameMenu');
                    this.scene.start('MapScene');
                }
            }
        });

        this.scene.stop();
    }
}