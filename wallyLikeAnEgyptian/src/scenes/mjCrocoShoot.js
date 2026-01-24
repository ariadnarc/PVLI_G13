/**
 * @file CrocoShoot.js
 * @class CrocoShoot
 * @extends Phaser.Scene
 * @description
 * Minijuego de balista con movimiento de proyectiles manual (sin Phaser Physics).
 * Las flechas se mueven en línea recta según su velocidad calculada
 * y los cocodrilos se desplazan horizontalmente. Incluye condiciones
 * de victoria y derrota en función de los cocodrilos eliminados y los que escapan.
 */
import { DIFICULTADES } from '../config/MinigameData.js';

/**
 * Escena del minijuego "CrocoShoot".
 * El jugador controla una balista que dispara flechas a cocodrilos
 * que avanzan horizontalmente por la pantalla.
 */
export default class CrocoShoot extends Phaser.Scene {
    /**
     * Crea la escena CrocoShoot.
     */
    constructor() {
        super('CrocoShoot');

        /**
         * Indica si esta escena se utiliza como minijuego.
         * @type {boolean}
         */
        this.isMinigame = true;

        /**
         * Identificador del minijuego (para menús y tracking).
         * @type {string|undefined}
         */
        this.minijuego = undefined;

        /**
         * Dificultad actual del minijuego.
         * @type {string|undefined}
         */
        this.difficulty = undefined;

        /**
         * ID del jeroglífico asociado a este minijuego.
         * @type {string|number|undefined}
         */
        this.jeroglificoId = undefined;

        /**
         * Indica si el minijuego se está jugando desde la sala secreta.
         * @type {boolean|undefined}
         */
        this.secreta = undefined;

        /**
         * Máximo de cocodrilos que pueden escapar antes de provocar derrota.
         * @type {number}
         */
        this.maxEscapes = 0;

        /**
         * Número de cocodrilos que han escapado por la izquierda.
         * @type {number}
         */
        this.escapesCount = 0;

        /**
         * Total de cocodrilos que deben ser eliminados según la dificultad.
         * @type {number}
         */
        this.totalCrocodilesToKill = 0;

        /**
         * Número de cocodrilos eliminados por el jugador.
         * @type {number}
         */
        this.killedCrocodilesCount = 0;

        /**
         * Número de cocodrilos generados hasta el momento.
         * @type {number}
         */
        this.spawnedCrocodilesCount = 0;

        /**
         * Indica si la partida ha terminado (victoria o derrota).
         * @type {boolean}
         */
        this.gameIsOver = false;

        /**
         * Velocidad de rotación de la balista (grados por frame).
         * @type {number}
         */
        this.ROTATION_SPEED = 0.8;

        /**
         * Velocidad de las flechas en píxeles por segundo.
         * @type {number}
         */
        this.SHOOT_SPEED = 600;

        /**
         * Velocidad horizontal de los cocodrilos en píxeles por segundo.
         * Negativa, ya que se mueven hacia la izquierda.
         * @type {number}
         */
        this.CROCO_SPEED = -100;

        /**
         * Ángulo mínimo de disparo (en grados).
         * @type {number}
         */
        this.MIN_ANGLE = -45;

        /**
         * Ángulo máximo de disparo (en grados).
         * @type {number}
         */
        this.MAX_ANGLE = 45;

        /**
         * Flag que indica si el jugador puede disparar (respeta cooldown).
         * @type {boolean}
         */
        this.canShoot = true;

        /**
         * Tiempo de recarga entre disparos en milisegundos.
         * @type {number}
         */
        this.shootCooldown = 0;

        /**
         * Gráfico auxiliar para dibujar la trayectoria de disparo.
         * @type {Phaser.GameObjects.Graphics|undefined}
         */
        this.trajectory = undefined;

        /**
         * Grupo de flechas disparadas por el jugador.
         * @type {Phaser.GameObjects.Group|undefined}
         */
        this.arrows = undefined;

        /**
         * Grupo de cocodrilos activos en pantalla.
         * @type {Phaser.GameObjects.Group|undefined}
         */
        this.crocodiles = undefined;

        /**
         * Evento temporizado para generar cocodrilos periódicamente.
         * @type {Phaser.Time.TimerEvent|undefined}
         */
        this.crocodileSpawnTimer = undefined;

        /**
         * Texto de HUD que muestra las vidas/escapes restantes.
         * @type {Phaser.GameObjects.Text|undefined}
         */
        this.livesText = undefined;

        /**
         * Gestor de sonido global.
         * @type {Object|undefined}
         */
        this.soundManager = undefined;

        /**
         * Sprite de la balista controlada por el jugador.
         * @type {Phaser.GameObjects.Image|undefined}
         */
        this.player = undefined;

        /**
         * Conjunto de teclas de control (izquierda, derecha, disparo).
         * @type {Object|undefined}
         */
        this.keys = undefined;
    }

    /**
     * Inicializa el minijuego CrocoShoot con la configuración correspondiente.
     *
     * @param {Object} [data={}] - Datos de entrada del minijuego.
     * @param {string} [data.minijuego] - Identificador del minijuego.
     * @param {string} [data.dificultad] - Dificultad seleccionada.
     * @param {string|number} [data.jeroglificoId] - ID del jeroglífico asociado.
     * @param {boolean} [data.secreta=false] - Indica si se juega desde sala secreta.
     */
    init(data = {}) {
        this.isMinigame = true;
        // Guardamos el minijuego
        this.minijuego = data.minijuego;
        // Dificultad elegida
        this.difficulty = data.dificultad;
        this.jeroglificoId = data.jeroglificoId;
        //Verifica si la sala es secreta 
        this.secreta=data.secreta;

        const config = DIFICULTADES[this.difficulty].minijuegos.CrocoShoot;

        // Variables de estado
        this.escapesCount = 0;
        this.killedCrocodilesCount = 0;
        this.spawnedCrocodilesCount = 0;
        this.gameIsOver = false;

        // Constantes de juego
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

    /**
     * Crea el entorno visual, controles, HUD,
     * grupos de flechas/cocodrilos y el sistema de spawn.
     * @override
     */
    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        //=== FONDO ===
        this.fondo = this.add.image(0, 0, 'fondoCroco').setOrigin(0);
        this.fondo.setDisplaySize(this.game.config.width, this.game.config.height);

        //=== CONTROLES ===
        this.keys = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE
        });

        //=== MÚSICA / SONIDOS ===
        this.soundManager = this.registry.get('soundManager');
        this.soundManager.playMusic('crocoshootTheme');

        //=== JUGADOR ===
        this.player = this.add.image(80, 450, 'balista');
        this.player.setOrigin(0.5, 0.5); // Importante para que rote desde el centro
        this.player.setScale(0.05);
        this.player.angle = 0;

        //=== GRÁFICOS Y GRUPOS ===
        this.trajectory = this.add.graphics(); // Para la línea predictiva
        this.arrows = this.add.group();
        this.crocodiles = this.add.group();

        //=== GENERACIÓN DE COCODRILOS ===
        this.crocodileSpawnTimer = this.time.addEvent({
            delay: 2000,
            callback: this.spawnCrocodile,
            callbackScope: this,
            loop: true,
            paused: false
        });

        //=== HUD ===
        this.livesText = this.add.text(centerX - 50, 16, this.getLivesText(), {
            fontFamily: 'Filgaia',
            color: '#382f23ff',
            fontSize: '32px',
        }).setScrollFactor(0);
    }

    /**
     * Actualiza el estado del minijuego en cada frame:
     * rotación, disparo, movimiento de flechas y cocodrilos,
     * colisiones y condiciones de victoria/derrota.
     *
     * @param {number} time - Tiempo total transcurrido.
     * @param {number} delta - Tiempo desde el último frame en ms.
     * @override
     */
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

        // Disparo
        if (Phaser.Input.Keyboard.JustDown(this.keys.space) && this.canShoot) {
            this.shootArrow();
        }

        // Movimiento manual NO por físicas
        this.moveArrows(deltaSeconds);
        this.moveCrocodiles(deltaSeconds);
        this.checkCollisions();

        // Limpieza y condiciones de fin de partida
        this.checkGameConditions();
        this.cleanupObjects();
    }

    // ---------------------------------------------------------
    //  MÉTODOS DE LÓGICA DE JUEGO
    // ---------------------------------------------------------

    /**
     * Dibuja una línea recta predictiva que representa
     * la trayectoria aproximada de la flecha.
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
     * Crea y dispara una flecha en línea recta,
     * asignándole una velocidad X/Y basada en el ángulo de la balista.
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
        arrow.speedY = Math.sin(angleRad) * this.SHOOT_SPEED * 1; 

        this.arrows.add(arrow);

        // Reactivar disparo tras el cooldown
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
     * Genera un nuevo cocodrilo en el borde derecho de la pantalla
     * y lo añade al grupo, con velocidad hacia la izquierda.
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
     * Verifica colisiones entre flechas y cocodrilos usando bounding boxes.
     * Si detecta intersección, delega en {@link CrocoShoot#hitCrocodile}.
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
     * Destruye ambos y actualiza el contador de kills.
     *
     * @param {Phaser.GameObjects.GameObject} arrow - Flecha que impacta.
     * @param {Phaser.GameObjects.GameObject} crocodile - Cocodrilo impactado.
     */
    hitCrocodile(arrow, crocodile) {
        if (this.gameIsOver) return;

        arrow.destroy();
        crocodile.destroy();

        this.killedCrocodilesCount++;

        this.checkGameConditions();
    }

    /**
     * Elimina objetos que salen fuera de la pantalla y
     * contabiliza los cocodrilos que escapan por la izquierda.
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
     * Genera el texto del HUD de vidas/escapes restantes.
     * @returns {string} Texto formateado para el HUD.
     */
    getLivesText() {
        const remaining = this.maxEscapes - this.escapesCount;
        return `VIDAS: ${remaining}`;
    }

    /**
     * Verifica las condiciones de victoria y derrota:
     * - Derrota si se supera el número máximo de escapes.
     * - Evaluación de victoria/derrota al terminar la oleada de cocodrilos.
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
        // Entonces decidimos victoria/derrota según kills.
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
    }

    /**
     * Lógica de final de minijuego en caso de victoria.
     * Detiene la generación de cocodrilos, pausa físicas y
     * lanza el menú de post-minijuego con resultado "victory".
     */
    endAsVictory() {
        if (this.crocodileSpawnTimer) this.crocodileSpawnTimer.remove(false);
        this.soundManager.stopMusic();
        this.physics.pause();

        // Lanzar menu de resultado
        this.scene.launch('PostMinigameMenu', {
            result: 'victory',
            difficulty: this.difficulty,
            minijuego: 'CrocoShoot',
            jeroglificoId: this.jeroglificoId,
            secreta:this.secreta,
            options: {
                "Salir": () => {
                    this.scene.stop('PostMinigameMenu');
                    this.scene.start('MapScene');
                }
            }
        });

        this.scene.stop();
    }

    /**
     * Lógica de final de minijuego en caso de derrota.
     * Detiene la generación de cocodrilos, pausa físicas y
     * lanza el menú de post-minijuego con opciones de reintentar o salir.
     */
    endAsDefeat() {
        if (this.crocodileSpawnTimer) this.crocodileSpawnTimer.remove(false);
        this.soundManager.stopMusic();
        this.physics.pause();

        this.scene.launch('PostMinigameMenu', {
            result: 'defeat',
            difficulty: this.difficulty,
            minijuego: 'CrocoShoot',
            jeroglificoId: this.jeroglificoId,
            secreta:this.secreta,
            options: {
                "Reintentar": () => {
                    this.scene.stop('PostMinigameMenu');
                    this.scene.start('CrocoShoot', {
                        minijuego: this.minijuego,
                        dificultad: this.difficulty,
                        jeroglificoId: this.jeroglificoId,
                    });
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