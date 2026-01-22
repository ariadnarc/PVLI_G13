/**
 * JSDOC
 * YA
 * A
 */

import DialogText from '../core/DialogText.js';

export default class IntroScene extends Phaser.Scene {
    constructor() {
        super('IntroScene');
        this.dialogIndex = 0;

    }

    preload() {
        this.load.json('dialog', 'wallyLikeAnEgyptian/src/config/dialogoIntroData.json');
    }

    create() {
        this.dialogData = this.cache.json.get('dialog').dialogos;

        const w = this.scale.width;
        const h = this.scale.height;

        const bg = this.add.image(w / 2, h / 2, 'fondoIntro');
        bg.setDisplaySize(w, h);
        bg.setDepth(-10);

        this.portraitFrame = this.add.rectangle(125, 250, 180, 180, 0x000000, 0.3)
            .setStrokeStyle(3, 0xffffff)
            .setOrigin(0.5);

        this.portraitSprite = this.add.image(125, 250, 'mariano')
        .setScale(0.18)
        .setVisible(false);
        
        // Crear ventana de dialogo
        this.dialogWindow = new DialogText(this, {
            windowHeight: 190,
            dialogSpeed: 4,
            fontSize: 28,
            fontFamily: 'Filgaia'
        });
        
        this.soundManager = this.registry.get('soundManager');
        this.soundManager.playMusic('ambience', { loop: true });
        
        // Mostrar el primer dialogo
        this.showDialog();
        
        // Avanzar dialogo
        this.input.keyboard.on('keydown-SPACE', () => { this.nextDialog(); }); // con space
        this.input.on('pointerdown', () => { this.sound.play("click"); this.nextDialog(); }); // con click

        // Crear botón de saltar al mapa
        this.createSkipButton();

    }

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
            ? `${line.speaker}: ${line.text || ''}` // si hay speaker, mostramos "Speaker: texto"
            : `${line.text || ''}`;                 // si no hay speaker, solo mostramos el texto


        this.dialogWindow.setText(textToShow, true);
    }


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

    createSkipButton() {
        const width = this.sys.game.config.width;

        const btn = this.add.image(width - 140, 90, "fondoBoton")
            .setOrigin(0.5)
            .setScale(0.75)
            .setInteractive({ useHandCursor: true });

        //=== Texto encima ===
        const btnText = this.add.text(btn.x, btn.y, "Ir al mapa", {
            fontFamily: "Filgaia",
            fontSize: "20px",
            color: '#382f23ff'
        }).setOrigin(0.5);

        //=== Hover: pequeña animación ===
        btn.on("pointerover", () => {
            btn.setScale(0.85);
            btnText.setColor("#ffffaa");
        });

        btn.on("pointerout", () => {
            btn.setScale(0.75);
            btnText.setColor('#382f23ff');
        });

        //=== Acción del botón ===
        btn.on("pointerdown", () => {
            this.soundManager?.stopMusic();
            this.scene.start("MapScene");
        });
    }

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