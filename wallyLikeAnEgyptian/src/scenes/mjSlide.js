/**
 * @file SlideBar.js
 * @class SlideBar
 * @extends Phaser.Scene
 * @description
 * Minijuego de barra deslizante.
 * El jugador debe detener el cursor dentro de la zona verde pulsando ESPACIO.
 * Dispone de intentos limitados según la dificultad; los intentos restantes
 * se conservan entre reintentos dentro del propio minijuego.
 */

import { DIFICULTADES } from '../config/MinigameData.js';
import InputManager from '../core/InputManager.js';

/**
 * Escena del minijuego "SlideBar".
 * Consiste en una barra horizontal, una zona de acierto y un cursor que
 * se mueve de lado a lado; el jugador debe acertar sincronizando el pulso.
 */
export default class SlideBar extends Phaser.Scene {

    /**
     * Crea la escena SlideBar.
     */
    constructor() {
        super('SlideBar');

        /**
         * Indica que esta escena se trata de un minijuego.
         * @type {boolean}
         */
        this.isMinigame = true;

        /**
         * Identificador del minijuego.
         * @type {string|undefined}
         */
        this.minijuego = undefined;

        /**
         * Dificultad seleccionada para el minijuego.
         * @type {string}
         */
        this.difficulty = 'FACIL';

        /**
         * ID del jeroglífico asociado a este minijuego.
         * @type {string|number|undefined}
         */
        this.jeroglificoId = undefined;

        /**
         * Número de intentos restantes.
         * Se inicializa en init según dificultad o reintentos.
         * @type {number}
         */
        this.tries = 0;

        /**
         * Velocidad de movimiento del cursor sobre la barra (px/seg).
         * @type {number}
         */
        this.barSpeed = 0;

        /**
         * Gestor de entrada personalizado.
         * @type {InputManager|undefined}
         */
        this.inputManager = undefined;

        /**
         * Anchura de la barra en píxeles.
         * @type {number}
         */
        this.barWidth = 500;

        /**
         * Altura de la barra en píxeles.
         * @type {number}
         */
        this.barHeight = 20;

        /**
         * Sprite de la barra principal.
         * @type {Phaser.GameObjects.Image|undefined}
         */
        this.bar = undefined;

        /**
         * Sprite de la zona verde de acierto.
         * @type {Phaser.GameObjects.Sprite|undefined}
         */
        this.greenZone = undefined;

        /**
         * Sprite del cursor que se mueve sobre la barra.
         * @type {Phaser.GameObjects.Sprite|undefined}
         */
        this.cursor = undefined;

        /**
         * Velocidad actual del cursor en píxeles/segundo.
         * @type {number}
         */
        this.cursorSpeed = 0;

        /**
         * Dirección actual del cursor: 1 = derecha, -1 = izquierda.
         * @type {number}
         */
        this.direction = 1;

        /**
         * Texto de HUD que muestra intentos restantes y título.
         * @type {Phaser.GameObjects.Text|undefined}
         */
        this.hud = undefined;

        /**
         * Gestor de sonido/música global.
         * @type {Object|undefined}
         */
        this.soundManager = undefined;
    }

    /**
     * Inicializa el minijuego con datos de configuración y reintentos.
     *
     * @param {Object} [data={}] - Datos pasados al iniciar la escena.
     * @param {string} [data.minijuego] - Identificador del minijuego.
     * @param {string} [data.dificultad='FACIL'] - Dificultad seleccionada.
     * @param {string|number} [data.jeroglificoId] - ID del jeroglífico asociado.
     * @param {number} [data.remainingTries] - Intentos restantes al reintentar.
     */
    init(data = {}) {
        this.isMinigame = true;

        // Guardamos el minijuego
        this.minijuego = data.minijuego;

        // Dificultad 
        this.difficulty = data.dificultad ?? 'FACIL';
        this.jeroglificoId = data.jeroglificoId;

        // Configuración según dificultad
        const config = DIFICULTADES[this.difficulty].minijuegos.SlideBar;

        // Si venimos de un reintento, mantenemos los intentos restantes;
        // en caso contrario, usamos los intentos completos de la dificultad.
        this.tries = data.remainingTries ?? config.intentos;
        this.barSpeed = config.velocidadBarra;
    }

    /**
     * Crea los elementos visuales, configura la entrada,
     * inicializa la barra, la zona verde, el cursor y el HUD.
     * @override
     */
    create() {

        //=== INPUT ===
        this.inputManager = new InputManager(this);
        this.inputManager.configure({
            cursors: false,
            keys: ['SPACE']
        });

        const w = this.scale.width;
        const h = this.scale.height;

        // Fondo
        const bg = this.add.image(w / 2, h / 2, 'paredBG');
        bg.setDisplaySize(w, h);
        bg.setDepth(-10);

        //=== BARRA, ZONA VERDE Y CURSOR ===

        // Barra
        this.barWidth = 500;
        this.barHeight = 20;
        this.bar = this.add.image(w / 2, h / 2, 'papiroBar');
        this.bar.setDisplaySize(this.barWidth, this.barHeight);

        // Zona verde (acierto)
        this.greenZone = this.add.sprite(w / 2, h / 2, 'egyptTiles', 22);
        this.greenZone.setScale(2);

        // Cursor
        this.cursor = this.add.sprite(w / 2 - this.barWidth / 2, h / 2, 'egyptTiles', 20).setScale(2);
        this.cursorSpeed = this.barSpeed;
        this.direction = 1; // 1 = derecha, -1 = izquierda

        //=== HUD ===
        this.hud = this.add.text(20, 15, "", {
            fontSize: "24px",
            color: "#ffffff"
        });

        // Música
        this.soundManager = this.registry.get('soundManager');
        this.soundManager.playMusic('slideBarTheme');

        this.updateHUD();
    }

    /**
     * Actualiza el estado del minijuego:
     * movimiento del cursor y detección de pulsación de ESPACIO.
     * @override
     */
    update() {

        this.inputManager.update();

        // Movimiento del cursor
        const dt = this.game.loop.delta / 1000;
        let nextX = this.cursor.x + this.direction * this.cursorSpeed * dt;

        const left = this.bar.x - this.barWidth / 2;
        const right = this.bar.x + this.barWidth / 2;

        if (nextX <= left || nextX >= right) {
            // cambia de dirección al llegar a los bordes
            this.direction *= -1; 
        } else {
            this.cursor.x = nextX;
        }

        // Pulsa SPACE para comprobar acierto
        if (this.inputManager.keys['SPACE'] && this.inputManager.keys['SPACE'].isDown) {
            this.checkHit();
        }
    }

    /**
     * Comprueba si el cursor se solapa con la zona verde.
     * Lanza victoria si acierta; en caso contrario resta intentos,
     * actualiza HUD y termina con derrota (o reintento).
     */
    checkHit() {
        const cursorBounds = this.cursor.getBounds();
        const greenBounds = this.greenZone.getBounds();

        const acierto = Phaser.Geom.Intersects.RectangleToRectangle(cursorBounds, greenBounds);

        if (acierto) {

            console.log("¡ACIERTO!");
            this.soundManager.stopMusic();

            this.endGame(true); 

        } else {

            console.log("FALLASTE");
            this.soundManager.stopMusic();


            this.tries--;
            this.updateHUD();

            // Siempre llamamos a endGame, pasando los intentos que quedaban
            this.endGame(false, this.tries);
        }
    }

    /**
     * Actualiza el HUD con el número de intentos restantes.
     */
    updateHUD() {
        this.hud.setText(
            `Precisión del Escriba\nIntentos restantes: ${this.tries}`
        );
    }

    /**
     * Termina el minijuego y abre el PostMinigameMenu con las opciones correctas.
     *
     * @param {boolean} victoria - true si el jugador ha acertado, false si ha fallado.
     * @param {number} [remainingTries=this.tries] - Intentos restantes (para reintentos).
     */
    endGame(victoria, remainingTries = this.tries) {
        const menuOptions = {};

        // Opción de reintentar solo si ha habido fallo y quedan intentos
        if(!victoria && remainingTries > 0){

            menuOptions['Reintentar'] = () => {
                this.soundManager.stopMusic();
                this.scene.stop('PostMinigameMenu');
                this.scene.stop();
    
                if (!victoria && remainingTries > 0) {
                    // Volvemos a SlideBar con los intentos restantes
                    this.scene.start('SlideBar', {
                        minijuego: this.minijuego,
                        dificultad: this.difficulty,
                        jeroglificoId: this.jeroglificoId,
                        remainingTries: remainingTries
                    });
                } 
            };
        }

        // Salir al mapa
        menuOptions['Salir'] = () => {
            this.scene.stop('PostMinigameMenu');
            this.scene.stop();
            this.scene.start('MapScene');
        };

        // Lanzamos el menú de fin de minijuego
        this.scene.start('PostMinigameMenu', {
            result: victoria ? 'victory' : 'defeat',
            difficulty: this.difficulty,
            minijuego: this.minijuego,
            jeroglificoId: this.jeroglificoId,
            options: menuOptions,
            remainingTries: remainingTries // Para mostrar en PostMinigameMenu
        });
    };
}