/**
 * @file LockPick.js
 * @class LockPick
 * @extends Phaser.Scene
 * @description
 * Minijuego de ganzúa inspirado en Skyrim.
 * El jugador debe encontrar el "sweetspot" (punto óptimo) de dos cerraduras consecutivas
 * bajo presión de tensión para evitar que la ganzúa se rompa.
 */

import { DIFICULTADES } from '../config/MinigameData.js';

/**
 * Escena del minijuego "LockPick".
 * Incluye dos cerraduras: al desbloquear la primera, se transiciona a la segunda;
 * al desbloquear ambas sin romper la ganzúa, el jugador gana.
 */
export default class LockPick extends Phaser.Scene {

    /**
     * Crea la escena LockPick e inicializa constantes fijas.
     */
    constructor() {
        super('LockPick');

        // --- Constantes de configuración (Valores fijos) ---
        /**
         * Velocidad a la cual se rota la cerradura (por unidad de delta).
         * @type {number}
         */
        this.LOCK_ROTATION_SPEED = 0.1;

        /**
         * Velocidad de rotación de la ganzúa (grados/segundo).
         * @type {number}
         */
        this.PICK_MOVEMENT_SPEED = 120;

        /**
         * Límite de rotación de la cerradura para desbloqueo (en grados).
         * @type {number}
         */
        this.MAX_LOCK_ROTATION = 90;

        /**
         * Ángulo de la cerradura (en grados) a partir del cual aumenta la resistencia
         * si no se está en el sweetspot.
         * @type {number}
         */
        this.RESISTANCE_THRESHOLD = 45;

        /**
         * Centro horizontal de la cámara.
         * @type {number}
         */
        this.CENTER_X = 0;

        /**
         * Centro vertical de la cámara.
         * @type {number}
         */
        this.CENTER_Y = 0;

        // --- Propiedades definidas por dificultad (se rellenan en create) ---

        /**
         * Rango angular del sweetspot (se usa alrededor de sweetCenter).
         * @type {number}
         */
        this.SWEET_WIDTH = 0;

        /**
         * Rango angular donde el jugador puede intentar girar la cerradura.
         * @type {number}
         */
        this.ROTATION_WIDTH = 0;

        /**
         * Tasa de aumento de tensión por milisegundo.
         * @type {number}
         */
        this.TENSION_INCREASE_RATE = 0;

        /**
         * Tasa de disminución de tensión por milisegundo.
         * @type {number}
         */
        this.TENSION_DECREASE_RATE = 0;

        // --- Sprites y gráficos ---

        /** @type {Phaser.GameObjects.Image|undefined} */
        this.fondo = undefined;

        /** @type {Phaser.GameObjects.Image|undefined} */
        this.spr_fondo = undefined;

        /** @type {Phaser.GameObjects.Image|undefined} */
        this.spr_fondo2 = undefined;

        /** @type {Phaser.GameObjects.Image|undefined} */
        this.spr_ring1 = undefined;

        /** @type {Phaser.GameObjects.Image|undefined} */
        this.spr_ring2 = undefined;

        /** @type {Phaser.GameObjects.Image|undefined} */
        this.spr_lock1 = undefined;

        /** @type {Phaser.GameObjects.Image|undefined} */
        this.spr_lock2 = undefined;

        /** @type {Phaser.GameObjects.Image|undefined} */
        this.spr_pick = undefined;

        /** @type {Phaser.GameObjects.Graphics|undefined} */
        this.tensionGraphics = undefined;

        // --- Variables de estado y lógica ---

        /**
         * Ángulo actual de la ganzúa (-90 a 90 grados).
         * @type {number}
         */
        this.pickAngle = 0;

        /**
         * Tensión actual acumulada (0 a maxTension).
         * @type {number}
         */
        this.tension = 0;

        /**
         * Límite máximo de tensión antes de romper la ganzúa.
         * @type {number}
         */
        this.maxTension = 100;

        /**
         * Intensidad de la vibración visual de la ganzúa.
         * @type {number}
         */
        this.vibrationStrength = 0;

        /**
         * Indica si se está en transición entre cerraduras (bloquea inputs).
         * @type {boolean}
         */
        this.isTransitioning = false;

        /**
         * Índice de la cerradura activa (1 o 2).
         * @type {number}
         */
        this.currentLock = 1;

        /**
         * Datos de configuración (sweetspot, rangos) de cada cerradura.
         * Índices 1 y 2, el 0 se deja dummy.
         * @type {Array<Object>|undefined}
         */
        this.locks = undefined;

        /**
         * Rotación actual de cada cerradura (0 a MAX_LOCK_ROTATION).
         * @type {{1: number, 2: number}}
         */
        this.lockRotation = { 1: 0, 2: 0 };

        // --- Controles ---

        /**
         * Conjunto de teclas de movimiento de ganzúa (cursores).
         * @type {Phaser.Types.Input.Keyboard.CursorKeys|undefined}
         */
        this.keys = undefined;

        /**
         * Tecla de acción (girar la cerradura, ESPACIO).
         * @type {Phaser.Input.Keyboard.Key|undefined}
         */
        this.turnKey = undefined;

        // --- Estado de minijuego / integración ---

        /**
         * Indica que esta escena es un minijuego.
         * @type {boolean}
         */
        this.isMinigame = true;

        /**
         * Identificador del minijuego.
         * @type {string|undefined}
         */
        this.minijuego = undefined;

        /**
         * Dificultad seleccionada.
         * @type {string|undefined}
         */
        this.difficulty = undefined;

        /**
         * ID del jeroglífico asociado.
         * @type {string|number|undefined}
         */
        this.jeroglificoId = undefined;

        /**
         * Indica si se juega desde la sala secreta.
         * @type {boolean|undefined}
         */
        this.secreta = undefined;

        /**
         * Gestor de sonido global.
         * @type {Object|undefined}
         */
        this.soundManager = undefined; 
    }

    /**
     * Inicializa las variables de dificultad y estado del minijuego.
     * @param {Object} data - Datos pasados a la escena.
     * @param {string} data.minijuego - Identificador del minijuego.
     * @param {string} data.dificultad - Nivel de dificultad ('facil', 'medio', 'dificil', etc.).
     * @param {string|number} data.jeroglificoId - ID del jeroglífico asociado.
     * @param {boolean} [data.secreta=false] - Indica si se juega desde sala secreta.
     */
    init(data) {
        this.isMinigame = true;
        this.minijuego = data.minijuego;
        this.difficulty = data.dificultad;
        this.jeroglificoId = data.jeroglificoId;
        this.secreta=data.secreta;
    }

    /**
     * Crea los elementos visuales (sprites), inicializa las variables de estado
     * y la lógica de juego en función de la dificultad configurada.
     * @override
     */
    create() {
        this.CENTER_X = this.cameras.main.centerX;
        this.CENTER_Y = this.cameras.main.centerY;

        const config = DIFICULTADES[this.difficulty].minijuegos.LockPick;

        // SPRITES (son 2 cerraduras, por eso hay "duplicados")

        // Fondo general
        this.fondo = this.add.image(this.CENTER_X, this.CENTER_Y, 'paredBG');

        // Fondos de cerradura
        this.spr_fondo = this.add.image(this.CENTER_X, this.CENTER_Y + 150, 'lock_fondo');
        this.spr_fondo.setOrigin(0.5); 
        this.spr_fondo.setDisplaySize(260, 260); 

        this.spr_fondo2 = this.add.image(this.CENTER_X, this.CENTER_Y - 150, 'lock_fondo');
        this.spr_fondo2.setOrigin(0.5);
        this.spr_fondo2.setDisplaySize(260, 260);

        // Aros exteriores (decorativos)
        this.spr_ring1 = this.add.image(this.CENTER_X, this.CENTER_Y - 150, 'lock_ring');
        this.spr_ring1.setOrigin(0.5);
        this.spr_ring1.setDisplaySize(250, 250);

        this.spr_ring2 = this.add.image(this.CENTER_X, this.CENTER_Y + 150, 'lock_ring');
        this.spr_ring2.setOrigin(0.5);
        this.spr_ring2.setDisplaySize(250, 250);

        // Cerraduras
        this.spr_lock1 = this.add.image(this.CENTER_X, this.CENTER_Y - 150, 'lock_lock');
        this.spr_lock1.setOrigin(0.5);
        this.spr_lock1.setDisplaySize(200, 200);

        this.spr_lock2 = this.add.image(this.CENTER_X, this.CENTER_Y + 150, 'lock_lock');
        this.spr_lock2.setOrigin(0.5);
        this.spr_lock2.setDisplaySize(200, 200);

        // Ganzúa (solo 1)
        this.spr_pick = this.add.image(this.CENTER_X, this.CENTER_Y, 'lock_lockpick');
        this.spr_pick.setDisplaySize(200, 200);

        // Variables de juego
        this.pickAngle = 0; 
        this.tension = 0; 
        this.maxTension = 100; 
        this.vibrationStrength = 0; 
        this.isTransitioning = false; 

        // Constantes que se definen por la dificultad (MinigameData)
        this.SWEET_WIDTH = config.limiteSweet; 
        this.ROTATION_WIDTH = config.limiteRotacion; 
        this.TENSION_INCREASE_RATE = config.tensionSube; 
        this.TENSION_DECREASE_RATE = config.tensionBaja; 

        this.currentLock = 1; 

        // Array con datos de cada cerradura
        this.locks = [
            null,                    // dummy en posición 0
            this.generateLockData(), // cerradura 1
            this.generateLockData()  // cerradura 2
        ];

        this.lockRotation = { 1: 0, 2: 0 }; 

        // Gráfico para barra de tensión
        this.tensionGraphics = this.add.graphics(); 

        // Controles (no usamos InputManager aquí)
        this.keys = this.input.keyboard.createCursorKeys();
        this.turnKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Música
        this.soundManager = this.registry.get('soundManager');
        this.soundManager.playMusic('lockPickTheme');
    }

    /**
     * Genera los datos de configuración aleatorios para una cerradura.
     * @returns {{sweetCenter:number, sweetMin:number, sweetMax:number, rotationMin:number, rotationMax:number}}
     *  Datos de la cerradura: centro, límites del sweetspot y límites del rango de rotación.
     */
    generateLockData() { 
        let sweetCenter = Phaser.Math.Between(-90, 90); 

        return {
            sweetCenter: sweetCenter, 
            sweetMin: sweetCenter - this.SWEET_WIDTH, 
            sweetMax: sweetCenter + this.SWEET_WIDTH, 
            rotationMin: sweetCenter - this.ROTATION_WIDTH, 
            rotationMax: sweetCenter + this.ROTATION_WIDTH 
        };
    }

    /**
     * Bucle principal de la escena. Gestiona la lógica de input, giro de cerradura,
     * tensión y dibujado de elementos.
     * @param {number} time - Tiempo total transcurrido.
     * @param {number} delta - Tiempo desde el último frame (ms).
     * @override
     */
    update(time, delta) {
        this.tensionGraphics.clear(); // Limpia el dibujo anterior de la barra de tensión

        // Solo procesar inputs si NO estamos en transición entre cerraduras
        if (!this.isTransitioning) {
            this.handlePickMovement(delta); // Movimiento de ganzúa
            this.applyTurnLogic(delta);     // Movimiento de cerradura / tensión 
        }

        // Dibuja todo en pantalla cada frame
        this.drawLock(1); 
        this.drawLock(2);
        this.drawPick(time);
        this.drawTensionBar();
    }

    /**
     * Gestiona el movimiento de rotación de la ganzúa mediante las flechas izquierda/derecha.
     * @param {number} delta - Tiempo transcurrido desde el último frame (ms).
     */
    handlePickMovement(delta) { 
        if (this.keys.left.isDown) { 
            this.pickAngle -= this.PICK_MOVEMENT_SPEED * delta / 1000;
        }
        if (this.keys.right.isDown) { 
            this.pickAngle += this.PICK_MOVEMENT_SPEED * delta / 1000;
        }

        // Evitamos que la ganzúa se mueva más allá de -90 o +90 grados
        this.pickAngle = Phaser.Math.Clamp(this.pickAngle, -90, 90);
    }

    /**
     * Lógica principal del minijuego.
     * Controla el giro de la cerradura y la tensión de la ganzúa al presionar ESPACIO.
     * @param {number} delta - Tiempo transcurrido desde el último frame (ms).
     */
    applyTurnLogic(delta) { 
        let lock = this.locks[this.currentLock]; 
        let angle = this.pickAngle; 
        let currentRotation = this.lockRotation[this.currentLock]; 

        // Si NO estás presionando ESPACIO:
        if (!this.turnKey.isDown) {
            this.vibrationStrength = 0; 
            this.tension = Math.max(this.tension - this.TENSION_DECREASE_RATE * delta, 0);

            if (currentRotation < this.MAX_LOCK_ROTATION && currentRotation > 0) {
                this.lockRotation[this.currentLock] =
                    Math.max(currentRotation - this.LOCK_ROTATION_SPEED * delta * 2, 0);
            }
            return; 
        }

        // 1. FUERA DEL RANGO DE ROTACIÓN
        if (angle < lock.rotationMin || angle > lock.rotationMax) {
            this.vibrationStrength = 5; 
            this.tension += this.TENSION_INCREASE_RATE * delta; 
            
            if (currentRotation > 0) {
                this.lockRotation[this.currentLock] =
                    Math.max(currentRotation - this.LOCK_ROTATION_SPEED * delta * 1.5, 0);
            }

            if (this.tension >= this.maxTension) {
                this.fail();
            }
            return; 
        }

        // 2. EN RANGO PERO FUERA DEL SWEETSPOT
        if (angle < lock.sweetMin || angle > lock.sweetMax) {
            this.vibrationStrength = 0; 
            this.tension = Math.max(this.tension - this.TENSION_DECREASE_RATE * delta * 0.5, 0); 

            if (currentRotation < this.RESISTANCE_THRESHOLD) {
                this.lockRotation[this.currentLock] += this.LOCK_ROTATION_SPEED * delta;
            } else {
                this.vibrationStrength = 10; 
                this.tension += this.TENSION_INCREASE_RATE * delta;

                if (this.tension >= this.maxTension) {
                    this.fail(); 
                }
            }
            return; 
        }

        // 3. EN EL SWEETSPOT 
        this.vibrationStrength = 0; 
        this.tension = Math.max(this.tension - this.TENSION_DECREASE_RATE * delta * 2, 0); 

        this.lockRotation[this.currentLock] += this.LOCK_ROTATION_SPEED * delta;

        if (this.lockRotation[this.currentLock] >= this.MAX_LOCK_ROTATION) {
            this.lockRotation[this.currentLock] = this.MAX_LOCK_ROTATION; 
            this.unlockCurrentLock(); 
        }
    }

    /**
     * Gestiona el desbloqueo de la cerradura actual.
     * Si es la primera, inicia la transición a la segunda;
     * si es la segunda, termina el minijuego con victoria.
     */
    unlockCurrentLock() { 
        if (this.currentLock === 1) { 
            this.isTransitioning = true; 

            // Animación de transición
            this.tweens.add({
                targets: this.spr_pick,
                alpha: 0, 
                duration: 500, 
                onComplete: () => {

                    // Cambiar a la segunda cerradura
                    this.currentLock = 2;
                    this.tension = 0;
                    this.pickAngle = 0;
                    this.vibrationStrength = 0;

                    // Reaparecer la ganzúa
                    this.tweens.add({
                        targets: this.spr_pick,
                        alpha: 1, 
                        duration: 500,
                        onComplete: () => {
                            this.isTransitioning = false; 
                        }
                    });
                }
            });
        } else { 
            this.winGame();
        }
    }

    /**
     * Dibuja y aplica la rotación al sprite de la cerradura (1 o 2).
     * @param {number} lockNumber - Índice de la cerradura a dibujar (1 o 2).
     */
    drawLock(lockNumber) { 
        const sprite = lockNumber === 1 ? this.spr_lock1 : this.spr_lock2; 
        sprite.setRotation(Phaser.Math.DegToRad(this.lockRotation[lockNumber]));
    }

    /**
     * Dibuja la ganzúa, aplica su rotación actual y añade el efecto de vibración
     * basado en la tensión.
     * @param {number} time - Tiempo total transcurrido (usado para la oscilación).
     */
    drawPick(time) { 
        
        const vibration = this.vibrationStrength > 0
            ? Math.sin(time * 0.02) * this.vibrationStrength * 0.4  
            : 0;
        const angle = this.pickAngle + vibration; 

        const targetY = this.currentLock === 1
            ? this.CENTER_Y - 150  
            : this.CENTER_Y + 150; 

        this.spr_pick.setPosition(this.CENTER_X, targetY); 

        // Ajuste manual del punto de pivote para que la ganzúa gire desde la punta
        this.spr_pick.setOrigin(0.32, 0.06); 
        this.spr_pick.setRotation(Phaser.Math.DegToRad(angle - 135)); 
    }

    /**
     * Dibuja y actualiza la barra de tensión visual en el centro de la pantalla,
     * cambiando de color según el nivel de tensión.
     */
    drawTensionBar() { 
        let barWidth = Phaser.Math.Clamp((this.tension / this.maxTension) * 200, 0, 200);

        // Color según tensión
        let color = 0x00ff00; 
        if (this.tension > 60) {
            color = 0xff0000; 
        } else if (this.tension > 30) {
            color = 0xffff00; 
        }

        this.tensionGraphics.fillStyle(color); 
        this.tensionGraphics.fillRect(this.CENTER_X - 100, this.CENTER_Y - 10, barWidth, 20);

        this.tensionGraphics.lineStyle(2, 0xffffff); 
        this.tensionGraphics.strokeRect(this.CENTER_X - 100, this.CENTER_Y - 10, 200, 20); 
    }

    /**
     * Método que se llama al completar con éxito todas las cerraduras.
     * Lanza el menú de post-minijuego con resultado de victoria.
     */
    winGame() {
        this.soundManager.stopMusic();
        this.isTransitioning = true; 
        this.tweens.killAll(); 

        this.scene.launch('PostMinigameMenu', {
            result: 'victory',
            difficulty: this.difficulty,
            minijuego: 'LockPick',
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
     * Método que se llama cuando la barra de tensión se llena (ganzúa rota).
     * Encadena con la lógica de derrota.
     */
    fail() {
        this.loseGame();
    }

    /**
     * Gestiona la derrota del minijuego.
     * Lanza el menú de post-minijuego con resultado de derrota
     * y opciones de reintentar o salir al mapa.
     */
    loseGame() {
        this.soundManager.stopMusic();
        this.isTransitioning = true; 
        this.tweens.killAll();

        //lanzamos PostMinigameMenu con resultado defeat
        this.scene.launch('PostMinigameMenu', {
            result: 'defeat',
            difficulty: this.difficulty,
            minijuego: 'LockPick',
            jeroglificoId: this.jeroglificoId,
            secreta:this.secreta,
            options: {
                "Reintentar": () => {
                    this.scene.stop('PostMinigameMenu');
                    this.scene.stop();
                    this.scene.start('LockPick', { 
                        minijuego: this.minijuego, 
                        dificultad: this.difficulty,
                        jeroglificoId: this.jeroglificoId, 
                    });
                },
                "Salir": () => {
                    this.scene.stop('PostMinigameMenu');
                    this.scene.stop();
                    this.scene.start('MapScene');
                }
            }
        });
        this.scene.stop();
    }
}