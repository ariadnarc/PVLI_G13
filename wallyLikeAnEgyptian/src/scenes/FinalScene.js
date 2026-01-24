/**
 * @file FinalScene.js
 * @class FinalScene
 * @extends Phaser.Scene
 * @description Escena de créditos con scroll suave y opción de reiniciar el juego al terminar.
 */

export default class FinalScene extends Phaser.Scene {
    constructor() {
        super('FinalScene');
    }

    create() {
        const { width, height } = this.scale;

        // Fondo
        this.add.image(width / 2, height / 2, 'creditsFondo').setDisplaySize(width, height);

        this.add.image(200, 470, 'wallyy').setDisplaySize(200,200);

        // Música
        this.soundManager = this.registry.get('soundManager');
        this.soundManager?.playMusic('creditsMusic', { loop: false, volume: 0.6 });

        // Texto de créditos
        const creditsText = `
        PVLI 2o GDV
        

        AUTORES / ALUMNOS:

        David Palacios Daza
        Ariadna Alicia Ruiz Castillo
        Blanca Navajas Gómez
        Juan Sánchez Arias


        DOCENTES:
        
        Antonio Calvo Morata
        Pablo Gutiérrez Sánchez


        GRACIAS POR JUGAR
        `;

        this.credits = this.add.text(
            width / 2,
            height + 50,
            creditsText,
            {
                fontFamily: 'Filgaia',
                fontSize: '32px',
                color: '#979696ff',
                align: 'center'
            }
        ).setOrigin(0.5, 0);

        // Velocidad del scroll
        this.scrollSpeed = 40;
        this.stopY = height - 1500;
        this.creditsStopped = false;

        // Capa negra para fade
        this.fadeRect = this.add.rectangle(
            0, 0, width, height, 0x000000
        ).setOrigin(0).setAlpha(0).setDepth(10);

    }

    update(time, delta) {
        if (!this.creditsStopped) {
            this.credits.y -= this.scrollSpeed * (delta / 1000);

            // Cuando llegan al punto deseado, se detienen
            if (this.credits.y <= this.stopY) {
                this.creditsStopped = true;
                this.time.delayedCall(6000, () =>  this.startFadeToBlack());
            }
        }
    }

    startFadeToBlack() {
        this.tweens.add({
            targets: this.fadeRect,
            alpha: 1,
            duration: 4000,
            ease: 'Linear',
            onComplete: () => this.showRestartPrompt()
        });
    }

    showRestartPrompt() {
        const { width, height } = this.scale;

        // Texto de la pregunta
        this.add.text(
            width / 2,
            height / 2 - 60,
            '¿Quieres volver a jugar?',
            {
                fontFamily: 'Filgaia',
                fontSize: '36px',
                color: '#563314'
            }
        ).setOrigin(0.5).setDepth(20);

        // Botón SÍ
        const yesButton = this.add.sprite(
        width / 2 - 100,
        height / 2 + 20,
        'fondoboton'
    ).setInteractive({ useHandCursor: true }).setDepth(20);

    yesButton.on('pointerdown', () => {
        this.soundManager?.stopMusic();

        window.location.reload();
    });
    }
    
    pause() {
        this.soundManager?.pauseMusic();
    }

    resume() {
        this.soundManager?.resumeMusic();
    }

    shutdown() {
        this.soundManager?.stopMusic();
    }
}