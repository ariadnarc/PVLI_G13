/**
 * @file IntroScene.js
 * @class IntroScene
 * @extends Phaser.Scene
 * @description
 * Escena de introducción del juego.
 * Muestra un conjunto de diálogos con retratos y permite
 * avanzar con espacio/click o saltar directamente al mapa.
 */
import DialogText from '../core/DialogText.js';

/**
 * Escena de introducción con sistema de diálogos secuenciales.
 */
export default class IntroScene extends Phaser.Scene {

    /**
     * Crea la escena IntroScene.
     */
    constructor() {
        super('IntroScene');

        /**
         * Índice del diálogo actual dentro del array de diálogos.
         * @type {number}
         */
        this.dialogIndex = 0;

        /**
         * Datos de los diálogos cargados desde el JSON.
         * @type {Array<Object>|undefined}
         */
        this.dialogData = undefined;

        /**
         * Ventana de diálogo que gestiona el texto y su animación.
         * @type {DialogText|undefined}
         */
        this.dialogWindow = undefined;

        /**
         * Marco gráfico del retrato del personaje.
         * @type {Phaser.GameObjects.Rectangle|undefined}
         */
        this.portraitFrame = undefined;

        /**
         * Sprite del retrato del personaje que habla.
         * @type {Phaser.GameObjects.Image|undefined}
         */
        this.portraitSprite = undefined;

        /**
         * Gestor de sonido global obtenido del registry.
         * @type {Object|undefined}
         */
        this.soundManager = undefined;
    }

    /**
     * Precarga los recursos necesarios para la escena de introducción.
     * En concreto, carga el JSON con los diálogos.
     * @override
     */
    preload() {
        this.load.json('dialog', 'wallyLikeAnEgyptian/src/config/dialogoIntroData.json');
    }

    /**
     * Crea los elementos visuales, la ventana de diálogo,
     * configura la música de ambiente y los inputs para avanzar o saltar la intro.
     * @override
     */
    create() {
        this.dialogData = this.cache.json.get('dialog').dialogos;

        const w = this.scale.width;
        const h = this.scale.height;

        // Fondo
        const bg = this.add.image(w / 2, h / 2, 'fondoIntro');
        bg.setDisplaySize(w, h);
        bg.setDepth(-10);

        // Marco del retrato
        this.portraitFrame = this.add.rectangle(125, 250, 180, 180, 0x000000, 0.3).setStrokeStyle(3, 0xffffff).setOrigin(0.5);

        // Sprite de retrato (cambia según el speaker)
        this.portraitSprite = this.add.image(125, 250, 'mariano').setScale(0.18).setVisible(false);
        
        // Crear ventana de diálogo
        this.dialogWindow = new DialogText(this, {
            windowHeight: 190,
            dialogSpeed: 4,
            fontSize: 28,
            fontFamily: 'Filgaia'
        });
        
        // Música de ambiente
        this.soundManager = this.registry.get('soundManager');
        this.soundManager.playMusic('ambience', { loop: true });
        
        // Mostrar el primer dialogo
        this.showDialog();
        
        // Avanzar dialogo con espacio
        this.input.keyboard.on('keydown-SPACE', () => { this.nextDialog(); }); 

        // Avanzar diálogo con click
        this.input.on('pointerdown', () => { this.sound.play("click"); this.nextDialog(); }); 

        // Botón para saltar directamente al mapa
        this.createSkipButton();

    }

    /**
     * Muestra el diálogo actual según {@link IntroScene#dialogIndex}.
     * Si no quedan más diálogos, detiene el sonido y pasa al mapa.
     */
    showDialog() {
        if (this.dialogIndex >= this.dialogData.length) {
            this.soundManager?.stop();
            this.sound.play("click");
            this.scene.start('MapScene'); 
            return;
        }

        const line = this.dialogData[this.dialogIndex];
        this.updatePortrait(line.speaker);
        const textToShow = line.speaker
            ? `${line.speaker}: ${line.text || ''}` 
            : `${line.text || ''}`;                 

        this.dialogWindow.setText(textToShow, true);
    }

    /**
     * Gestiona el avance del diálogo:
     * - Si el texto todavía se está escribiendo, lo completa de golpe.
     * - Si ya terminó de escribirse, avanza a la siguiente línea.
     */
    nextDialog() {
        // Si el texto aún se está animando, mostrar todo de golpe
        if (this.dialogWindow.timedEvent && this.dialogWindow.timedEvent.getProgress() < 1) {
            const line = this.dialogData[this.dialogIndex];
            const textToShow = `${line.speaker}: ${line.text}`;
            this.dialogWindow.setText(textToShow, false);
        } else {
            // Avanzar al siguiente diálogo
            this.dialogIndex++;
            this.showDialog();
        }
    }

    /**
     * Crea el botón para saltar la introducción y pasar directamente al mapa.
     * El botón se muestra en la esquina superior derecha.
     */
    createSkipButton() {
        const width = this.sys.game.config.width;

        const btn = this.add.image(width - 140, 90, "fondoBoton")
            .setOrigin(0.5)
            .setScale(0.75)
            .setInteractive({ useHandCursor: true });

        // Texto encima del botón
        const btnText = this.add.text(btn.x, btn.y, "Ir al mapa", {
            fontFamily: "Filgaia",
            fontSize: "20px",
            color: '#382f23ff'
        }).setOrigin(0.5);

        // Hover: pequeña animación
        btn.on("pointerover", () => {
            btn.setScale(0.85);
            btnText.setColor("#ffffaa");
        });

        btn.on("pointerout", () => {
            btn.setScale(0.75);
            btnText.setColor('#382f23ff');
        });

        // Acción del botón
        btn.on("pointerdown", () => {
            this.soundManager?.stopMusic();
            this.scene.start("MapScene");
        });
    }

    /**
     * Actualiza el retrato mostrado según el personaje que habla.
     *
     * @param {string} speaker - Nombre del personaje que habla en la línea actual.
     */
    updatePortrait(speaker) {

        if (speaker === "Mariano") {
            this.portraitSprite.setTexture("mariano");
            this.portraitSprite.setScale(0.18);
            this.portraitSprite.setVisible(true);
        }
        else if (speaker === "Café") {
            this.portraitSprite.setTexture("cafe");
            this.portraitSprite.setScale(0.18);
            this.portraitSprite.setVisible(true);
        }
        else if (speaker === "Desconocido") {
            this.portraitSprite.setTexture("cafe");
            this.portraitSprite.setScale(0.18);
            this.portraitSprite.setVisible(true);
        }
        else if (speaker === "Narrador") {
            this.portraitSprite.setVisible(false);
        }
    }

}