/**
 * @file FindLuigi.js
 * @class FindLuigi
 * @extends Phaser.Scene
 * @description Minijuego "Find Luigi" inspirado en Mario Party DS.
 * El jugador debe encontrar a Luigi en una multitud de personajes en 3 fases
 * de dificultad creciente, todo ello bajo un temporizador global.
 */
export default class FindLuigi extends Phaser.Scene {
    constructor() {
        super('FindLuigi');
    }

    /**
     * @property {number} globalTimeLimit - Tiempo total para completar todas las fases (en ms).
     * @property {number} currentPhase - La fase actual (1, 2, 3).
     * @property {number} score - Número de Luigis encontrados correctamente.
     * @property {number} maxPhases - Número total de fases.
     * @property {boolean} gameIsOver - Indica si el juego ha terminado.
     * @property {Phaser.Time.TimerEvent} globalTimer - Temporizador principal del juego.
     * @property {Array<string>} distractorKeys - Claves de los sprites de personajes no-Luigi.
     * @property {Phaser.GameObjects.Text} scoreText - Objeto de texto para la puntuación.
     * @property {Phaser.GameObjects.Text} phaseText - Objeto de texto para la fase actual.
     * @property {Phaser.GameObjects.Text} timerText - Objeto de texto para el temporizador global.
     * @property {Phaser.GameObjects.Group} crowdGroup - Grupo para gestionar los personajes de la multitud.
     * @property {Phaser.Math.Vector2} centerX - Centro horizontal de la cámara.
     * @property {Phaser.Math.Vector2} centerY - Centro vertical de la cámara.
     */
    init() {
        this.globalTimeLimit = 30000; // 30 segundos para las 3 fases
        this.currentPhase = 1;
        this.score = 0; // Luigis encontrados, necesario para avanzar de fase
        this.maxPhases = 3;
        this.gameIsOver = false;

        // Configuración de dificultad por fase
        this.phaseConfigs = {
            1: { crowdSize: 15, cellSize: 100, scale: 0.8, rows: 3, cols: 5, bgAlpha: 0.0, movement: false }, // Fácil
            2: { crowdSize: 25, cellSize: 80, scale: 0.7, rows: 5, cols: 5, bgAlpha: 0.2, movement: false }, // Medio
            3: { crowdSize: 35, cellSize: 60, scale: 0.6, rows: 5, cols: 7, bgAlpha: 0.4, movement: true }  // Difícil (con movimiento)
        };

        // Asumiendo que estos son los assets cargados en preload
        this.distractorKeys = ['npc1', 'npc2', 'npc3'];

        // Propiedad para evitar clics múltiples mientras se procesa una respuesta
        this.canClick = true;
    }

    create() {
        this.centerX = this.cameras.main.width / 2;
        this.centerY = this.cameras.main.height / 2;

        this.fondo = this.add.image(0, 0, 'fondoFinal').setOrigin(0);
        this.fondo.setDisplaySize(this.game.config.width, this.game.config.height);

        // --- HUD ---
        this.phaseText = this.add.text(10, 10, 'Fase: 1/3', { fontSize: '30px', fill: '#FFF', backgroundColor: '#00000088' }).setDepth(10);
        this.scoreText = this.add.text(10, 50, 'Encontrados: 0', { fontSize: '30px', fill: '#FFF', backgroundColor: '#00000088' }).setDepth(10);
        this.timerText = this.add.text(this.cameras.main.width - 10, 10, 'Tiempo: 30.0s', { fontSize: '30px', fill: '#FFF', backgroundColor: '#00000088' }).setOrigin(1, 0).setDepth(10);

        // --- Grupo de la multitud ---
        this.crowdGroup = this.add.group();

        // --- Temporizador Global ---
        this.globalTimer = this.time.addEvent({
            delay: this.globalTimeLimit,
            callback: this.gameOver,
            callbackScope: this,
            args: ['¡TIEMPO AGOTADO!'],
            paused: true // Lo pausamos hasta que la primera fase esté lista
        });

        // Configurar el evento de clic/toque para toda la escena
        this.input.on('gameobjectdown', this.handleInput, this);

        // Iniciar la primera fase
        this.startPhase();
    }

    update() {
        if (this.gameIsOver) return;

        // Actualizar el temporizador global
        const remainingTime = (this.globalTimeLimit - this.globalTimer.getElapsed()).toFixed(1);
        this.timerText.setText(`Tiempo: ${remainingTime}s`);

        // Mover personajes si la fase actual lo requiere
        const currentConfig = this.phaseConfigs[this.currentPhase];
        if (currentConfig && currentConfig.movement) {
            this.crowdGroup.children.each(char => {
                // Simula un movimiento aleatorio o un simple wiggle
                char.x += Math.sin(this.time.now / 500 + char.startOffset) * 0.5;
                char.y += Math.cos(this.time.now / 700 + char.startOffset) * 0.5;
            });
        }

        // Si el tiempo llega a 0, la función gameOver se encargará
    }

    // ---------------------------------------------------------
    //  MÉTODOS DE FASES Y JUEGO
    // ---------------------------------------------------------

    /**
     * Inicia una nueva fase del juego.
     */
    startPhase() {
        if (this.gameIsOver) return;

        this.canClick = true; // Habilitar clics
        this.score = 0; // Reiniciar score para la fase actual

        this.phaseText.setText(`Fase: ${this.currentPhase}/${this.maxPhases}`);
        this.scoreText.setText(`Encontrados: ${this.score}`);

        this.createCrowd();

        // Resaltar Luigi momentáneamente al inicio de cada fase (ayuda inicial)
        const luigi = this.crowdGroup.children.entries.find(char => char.roundTarget);
        if (luigi) {
            this.tweens.add({
                targets: luigi,
                scale: luigi.scale * 1.2,
                duration: 200,
                yoyo: true,
                repeat: 0,
                ease: 'Sine.easeInOut'
            });
        }

        // Si es la primera fase, iniciar el temporizador global
        if (this.currentPhase === 1) {
            this.globalTimer.paused = false;
        }
    }

    /**
     * Genera la multitud de personajes, incluyendo un Luigi.
     */
    createCrowd() {
        this.crowdGroup.clear(true, true); // Limpia la multitud anterior

        const config = this.phaseConfigs[this.currentPhase];
        if (!config) {
            console.error('Configuración de fase no encontrada:', this.currentPhase);
            return;
        }

        const { crowdSize, cellSize, scale, rows, cols, bgAlpha, movement } = config;

        const targetIndex = Phaser.Math.Between(0, crowdSize - 1); // Posición donde estará Luigi
        const gridStartX = this.centerX - (cols * cellSize / 2);
        const gridStartY = this.centerY - (rows * cellSize / 2);

        let count = 0;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (count >= crowdSize) break;

                const x = gridStartX + j * cellSize + cellSize / 2;
                const y = gridStartY + i * cellSize + cellSize / 2;

                let charKey;
                let isLuigi = false;

                if (count === targetIndex) {
                    charKey = 'luigi';
                    isLuigi = true;
                } else {
                    charKey = Phaser.Utils.Array.GetRandom(this.distractorKeys);
                }

                const char = this.add.image(x, y, charKey).setScale(scale);
                char.setInteractive({ useHandCursor: true }); // Habilita la detección de clics/toques
                char.roundTarget = isLuigi; // Propiedad personalizada para saber si es el objetivo
                char.startOffset = Phaser.Math.Between(0, 1000); // Para movimiento aleatorio
                char.setDepth(1); // Asegurar que los personajes estén sobre el fondo si lo hay

                this.crowdGroup.add(char);
                count++;
            }
            if (count >= crowdSize) break;
        }

        // Fondo semi-transparente para la cuadrícula
        this.add.rectangle(this.centerX, this.centerY, cols * cellSize + 20, rows * cellSize + 20, 0x000000, bgAlpha).setDepth(0);
    }

    /**
     * Procesa la entrada del usuario (clic/toque en un personaje).
     * @param {Phaser.Input.Pointer} pointer - El puntero que interactuó.
     * @param {Phaser.GameObjects.GameObject} gameObject - El objeto de juego clicado.
     */
    handleInput(pointer, gameObject) {
        if (this.gameIsOver || !this.canClick) return; // Si el juego ha terminado o no se puede clicar, salir

        this.canClick = false; // Deshabilitar clics temporalmente

        // Animación de feedback para el clic
        this.tweens.add({
            targets: gameObject,
            scale: gameObject.scale * 1.1,
            duration: 100,
            yoyo: true,
            onComplete: () => {
                if (gameObject.roundTarget) {
                    this.correctAnswer(gameObject);
                } else {
                    this.wrongAnswer(gameObject);
                }
            }
        });
    }

    /**
     * Lógica para una respuesta correcta (Luigi encontrado).
     * @param {Phaser.GameObjects.GameObject} luigiFound - El objeto Luigi encontrado.
     */
    correctAnswer(luigiFound) {
        this.score++;
        this.scoreText.setText(`Encontrados: ${this.score}`);

        // Efecto visual de encontrado
        luigiFound.setTint(0x00FF00); // Verde

        // Pequeño mensaje de feedback
        const feedback = this.add.text(this.centerX, this.centerY + 50, '¡BIEN!', { fontSize: '48px', fill: '#00FF00', stroke: '#000', strokeThickness: 4 }).setOrigin(0.5).setDepth(11);
        this.tweens.add({
            targets: feedback,
            alpha: 0,
            y: feedback.y - 50,
            duration: 1000,
            onComplete: () => feedback.destroy()
        });

        // Si se encuentra a Luigi, se avanza a la siguiente fase
        this.time.delayedCall(1500, () => {
            this.crowdGroup.clear(true, true); // Limpiar personajes antes de la siguiente fase
            if (this.currentPhase < this.maxPhases) {
                this.currentPhase++;
                this.startPhase();
            } else {
                this.gameOver('¡HAS GANADO! Luigi está a salvo.');
            }
        }, [], this);
    }

    /**
     * Lógica para una respuesta incorrecta.
     * @param {Phaser.GameObjects.GameObject} clickedChar - El objeto clicado incorrectamente.
     */
    wrongAnswer(clickedChar) {
        clickedChar.setTint(0xFF0000); // Rojo

        // Muestra dónde estaba Luigi
        const luigi = this.crowdGroup.children.entries.find(char => char.roundTarget);
        if (luigi) {
            luigi.setTint(0x0000FF); // Azul para Luigi correcto
            const feedback = this.add.text(luigi.x, luigi.y, '← LUIGI', { fontSize: '24px', fill: '#0000FF', stroke: '#FFF', strokeThickness: 2 }).setOrigin(0, 0.5).setDepth(11);
            this.tweens.add({
                targets: feedback,
                x: feedback.x + 30,
                duration: 500,
                yoyo: true,
                repeat: 0,
                onComplete: () => feedback.destroy()
            });
        }

        // Pequeño mensaje de feedback
        const feedback = this.add.text(this.centerX, this.centerY + 50, '¡NO!', { fontSize: '48px', fill: '#FF0000', stroke: '#000', strokeThickness: 4 }).setOrigin(0.5).setDepth(11);
        this.tweens.add({
            targets: feedback,
            alpha: 0,
            y: feedback.y - 50,
            duration: 1000,
            onComplete: () => feedback.destroy()
        });

        // Esperar un momento y reiniciar la misma fase
        this.time.delayedCall(2000, () => {
            this.crowdGroup.clear(true, true);
            this.startPhase(); // Reinicia la fase actual
        }, [], this);
    }


    /**
     * Finaliza el juego, mostrando un mensaje de victoria o derrota.
     * @param {string} message - Mensaje a mostrar al finalizar el juego.
     */
    gameOver(message) {
        if (this.gameIsOver) return;

        this.gameIsOver = true;
        this.globalTimer.paused = true; // Detener el temporizador
        this.crowdGroup.clear(true, true); // Limpiar la multitud
        this.input.off('gameobjectdown', this.handleInput, this); // Desactivar clics

        // Mostrar mensaje final
        this.add.text(this.centerX, this.centerY, message, {
            fontSize: '64px',
            fill: '#FFFFFF',
            backgroundColor: '#000000CC',
            padding: { x: 30, y: 20 },
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        // Puedes añadir aquí la lógica para volver al menú principal, etc.
        // this.time.delayedCall(5000, () => this.scene.start('TitleScreen'));
    }
}