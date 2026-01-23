/**
 * @file mjFinalGame.js
 * @class FinalGame
 * @extends Phaser.Scene
 * @description Minijuego "Find Wally".
 * El jugador debe encontrar a Wally en una multitud de personajes en 3 fases
 * de dificultad creciente, todo ello bajo un temporizador global.
 */
export default class FinalGame extends Phaser.Scene {
    constructor() {
        super('FinalGame');
    }

    /**
     * @property {number} globalTimeLimit - Tiempo total para completar todas las fases (en ms).
     * @property {number} currentPhase - La fase actual (1, 2, 3).
     * @property {number} score - Contador de Wallys encontrados (reinicia por fase).
     * @property {number} maxPhases - Número total de fases.
     * @property {number} globalSpriteScale - Tamaño de los sprites (inicial)
     * @property {boolean} gameIsOver - Indica si el juego ha terminado.
     * @property {Phaser.Time.TimerEvent} globalTimer - Temporizador principal del juego (30s).
     * @property {Array<string>} distractorKeys - Claves de los sprites de personajes distractores (los "faroles").
     * @property {Phaser.GameObjects.Text} phaseText - Objeto de texto para el HUD de la fase actual.
     * @property {Phaser.GameObjects.Text} timerText - Objeto de texto para el HUD del temporizador global.
     * @property {Phaser.GameObjects.Image} fondo - Imagen de fondo de la escena.
     * @property {Phaser.GameObjects.Group} crowdGroup - Grupo para gestionar todos los personajes de la multitud.
     * @property {boolean} canClick - Flaj de control para evitar clics múltiples o 'masheo' durante el feedback.
     * @property {Object} phaseConfigs - Configuración de dificultad para cada fase (crowdSize, scale, movement, etc.).
     * @property {number} centerX - Centro horizontal de la cámara.
     * @property {number} centerY - Centro vertical de la cámara.
     */
    init() {
        this.globalTimeLimit = 30000;
        this.currentPhase = 1;
        this.score = 0;
        this.maxPhases = 3;
        this.gameIsOver = false;
        this.globalSpriteScale = 6;

        this.phaseConfigs = { // Configuración de fases
            // FASE 1:
            1: {
                crowdSize: 56,
                cellSize: 60,
                scale: 0.55,
                rows: 7,
                cols: 8,
                movement: false,
                wiggleStrength: 0
            },

            // FASE 2:
            2: {
                crowdSize: 90,
                cellSize: 50,
                scale: 0.45,
                rows: 9,
                cols: 10,
                movement: true,
                wiggleStrength: 0.6
            },

            // FASE 3:
            3: {
                crowdSize: 132,
                cellSize: 40,
                scale: 0.35,
                rows: 11,
                cols: 12,
                movement: true,
                wiggleStrength: 1.2
            }
        };

        this.distractorKeys = ['npc1', 'npc2', 'npc3']; // Los faroles
        this.canClick = true; // Flag para no "mashear"
    }

    /**
     * Configura y crea todos los elementos del juego: fondo, HUD, timers y listeners.
     */
    create() {
        this.centerX = this.cameras.main.width / 2;
        this.centerY = this.cameras.main.height / 2;

        this.fondo = this.add.image(0, 0, 'fondoFinal').setOrigin(0);
        this.fondo.setDisplaySize(this.game.config.width, this.game.config.height);

        this.soundManager = this.registry.get('soundManager');
        this.soundManager.playMusic('finalBossTheme');

        // HUD
        this.phaseText = this.add.text(10, 10, 'Fase: 1/3', {
            fontFamily: 'Filgaia',
            color: '#382f23ff',
            fontSize: '32px',
        });
        this.timerText = this.add.text(this.cameras.main.width - 270, 10, 'Tiempo: 30s', {
            fontFamily: 'Filgaia',
            color: '#382f23ff',
            fontSize: '32px',
        });

        this.crowdGroup = this.add.group(); // Wally + distractores

        // Temporizador
        this.globalTimer = this.time.addEvent({
            delay: this.globalTimeLimit,
            callback: this.gameOver,
            callbackScope: this,
            args: ['¡TIEMPO AGOTADO!'],
            paused: true
        });

        this.input.on('gameobjectdown', this.handleInput, this);

        this.startPhase();
    }

    /**
     * Lógica de actualización continua. Maneja el movimiento de la multitud y la actualización del temporizador.
     */
    update() {
        if (this.gameIsOver) return;

        // Actualizar el temporizador global
        const remainingTime = Math.floor((this.globalTimeLimit - this.globalTimer.getElapsed()) / 1000); // Enteros
        this.timerText.setText(`Tiempo: ${remainingTime}s`);

        // Mover personajes si la fase actual lo requiere
        const currentConfig = this.phaseConfigs[this.currentPhase];
        if (currentConfig && currentConfig.movement) {
            const strength = currentConfig.wiggleStrength;
            this.crowdGroup.children.each(char => {
                char.x += Math.sin(this.time.now / (500) * 0.5 + char.startOffset) * strength;
                char.y += Math.cos(this.time.now / (700) * 0.5 + char.startOffset) * strength;
            });
        }
    }

    /**
     * Inicia o reinicia la configuración para la fase actual.
     */
    startPhase() {
        if (this.gameIsOver) return;

        this.canClick = true;
        this.score = 0;

        this.phaseText.setText(`Fase: ${this.currentPhase}/${this.maxPhases}`);

        this.createCrowd();

        if (this.currentPhase === 1) {
            this.globalTimer.paused = false;
        }
    }

    /**
     * Genera la multitud de personajes (crowd) incluyendo al objetivo (Wally) según la configuración de la fase.
     */
    createCrowd() {
        this.crowdGroup.clear(true, true);

        const config = this.phaseConfigs[this.currentPhase];
        if (!config) return;

        const { crowdSize, cellSize, scale, rows, cols } = config;

        const targetIndex = Phaser.Math.Between(0, crowdSize - 1);

        // Cálculo para centrar la cuadrícula y contener los personajes
        const totalWidth = cols * cellSize;
        const totalHeight = rows * cellSize;
        const gridStartX = this.centerX - (totalWidth / 2);
        const gridStartY = this.centerY - (totalHeight / 2);

        let count = 0;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (count >= crowdSize) break;

                const x = gridStartX + j * cellSize + cellSize / 2;
                const y = gridStartY + i * cellSize + cellSize / 2;

                let charKey;
                let iswally = false;

                if (count === targetIndex) {
                    charKey = 'wallyMinijuego';
                    iswally = true;
                } else {
                    charKey = Phaser.Utils.Array.GetRandom(this.distractorKeys);
                }

                const char = this.add.image(x, y, charKey).setScale(scale * this.globalSpriteScale);
                char.setInteractive({ useHandCursor: true });
                char.roundTarget = iswally;
                char.startOffset = Phaser.Math.Between(0, 1000);
                char.setDepth(1);

                this.crowdGroup.add(char);
                count++;
            }
            if (count >= crowdSize) break;
        }
    }

    /**
     * Gestión del click/toque en un personaje.
     * @param {Phaser.Input.Pointer} pointer - El puntero que interactuó.
     * @param {Phaser.GameObjects.GameObject} gameObject - El objeto de juego clicado.
     */
    handleInput(pointer, gameObject) {
        if (this.gameIsOver || !this.canClick) return;

        this.canClick = false;

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
     * Lógica ejecutada al hacer click en Wally. Avanza a la siguiente fase o finaliza el juego.
     * @param {Phaser.GameObjects.GameObject} wallyFound - El objeto Wally encontrado.
     */
    correctAnswer(wallyFound) {
        this.score++;

        wallyFound.setTint(0x00FF00); // Verde - Bien

        // Mensaje de feedback simplificado
        const feedback = this.add.text(this.centerX, this.centerY + 50, '¡BIEN!', {
            fontSize: '48px',
            color: '#00FF00',
        }).setOrigin(0.5);
        this.tweens.add({
            targets: feedback,
            alpha: 0,
            y: feedback.y - 50,
            duration: 1000,
            onComplete: () => feedback.destroy()
        });

        this.time.delayedCall(1000, () => {
            this.crowdGroup.clear(true, true);
            if (this.currentPhase < this.maxPhases) {
                this.currentPhase++;
                this.startPhase();
            } else {
                // Victoria:
                this.soundManager.stopMusic();
                this.scene.start('FinalScene');
                this.scene.stop();
            }
        }, [], this);
    }

    /**
     * Lógica ejecutada al hacer click en un farolillo. Reinicia la fase actual. Pero no el tiempo
     * @param {Phaser.GameObjects.GameObject} clickedChar - El personaje incorrecto clicado.
     */
    wrongAnswer(clickedChar) {
        clickedChar.setTint(0xFF0000); // Rojo - Suspenso

        // Mensaje de feedback
        const feedback = this.add.text(this.centerX, this.centerY + 50, '¡NO!', {
            fontSize: '48px',
            color: '#FF0000',
        }).setOrigin(0.5);
        this.tweens.add({
            targets: feedback,
            alpha: 0,
            y: feedback.y - 50,
            duration: 1000,
            onComplete: () => feedback.destroy()
        });

        this.time.delayedCall(1000, () => {
            this.crowdGroup.clear(true, true);
            this.startPhase();
        }, [], this);
    }

    /**
     * Finaliza el juego por tiempo agotado. Transiciona al menú principal.
     */
    gameOver() {
        this.soundManager.stopMusic();
        if (this.gameIsOver) return;

        this.gameIsOver = true;
        this.globalTimer.paused = true;

        this.destroyAllObjects();
        this.scene.stop();

        this.scene.start('MainMenu')
    }

    /**
     * Destruye todos los objetos persistentes, grupos y timers de la escena para liberar recursos.
     */
    destroyAllObjects() {
        if (this.globalTimer) {
            this.globalTimer.remove(false);
        }

        if (this.crowdGroup) {
            this.crowdGroup.destroy(true, true);
        }

        if (this.fondo) {
            this.fondo.destroy();
        }
        if (this.phaseText) {
            this.phaseText.destroy();
        }
        if (this.timerText) {
            this.timerText.destroy();
        }

        this.input.off('gameobjectdown', this.handleInput, this);
    }
}   