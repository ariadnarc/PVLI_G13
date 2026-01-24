/**
 * @file FinalScene.js
 * @class FinalScene
 * @extends Phaser.Scene
 * @description
 * Escena final del juego.
 * Muestra los créditos con scroll vertical, reproduce música de cierre
 * y permite reiniciar completamente el juego al finalizar.
 */
export default class FinalScene extends Phaser.Scene {

    /**
     * Crea la escena FinalScene.
     */
    constructor() {
        super('FinalScene');

        /**
         * Gestor de sonido global.
         * @type {Object|undefined}
         */
        this.soundManager = undefined;

        /**
         * Texto de créditos que se desplaza verticalmente.
         * @type {Phaser.GameObjects.Text|undefined}
         */
        this.credits = undefined;

        /**
         * Velocidad del desplazamiento de los créditos (px/seg).
         * @type {number}
         */
        this.scrollSpeed = 0;

        /**
         * Posición Y donde los créditos se detienen.
         * @type {number}
         */
        this.stopY = 0;

        /**
         * Indica si los créditos han terminado su desplazamiento.
         * @type {boolean}
         */
        this.creditsStopped = false;

        /**
         * Rectángulo usado para el fade a negro.
         * @type {Phaser.GameObjects.Rectangle|undefined}
         */
        this.fadeRect = undefined;
    }

    /**
     * Crea los elementos visuales y sonoros de la escena final.
     * Configura el fondo, los créditos, la música y el sistema de fade.
     * @override
     */
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

        // Configuración del scroll
        this.scrollSpeed = 40;
        this.stopY = height - 1500;
        this.creditsStopped = false;

        // Capa negra para fade
        this.fadeRect = this.add.rectangle(
            0, 0, width, height, 0x000000
        ).setOrigin(0).setAlpha(0).setDepth(10);

    }

    /**
     * Actualiza la posición del texto de créditos.
     * Detiene el scroll al llegar a la posición final y lanza
     * la transición de fade a negro.
     *
     * @param {number} time - Tiempo total de ejecución.
     * @param {number} delta - Tiempo transcurrido desde el último frame.
     * @override
     */
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

    /**
     * Inicia la transición de fade a negro.
     * Al finalizar el fade, muestra la opción de reiniciar el juego.
     */
    startFadeToBlack() {
        this.tweens.add({
            targets: this.fadeRect,
            alpha: 1,
            duration: 4000,
            ease: 'Linear',
            onComplete: () => this.showRestartPrompt()
        });
    }

    /**
     * Muestra el mensaje de confirmación para volver a jugar.
     * Permite reiniciar completamente el juego mediante recarga de página.
     */
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
    
    /**
     * Pausa la música de la escena final.
     * Puede ser llamado si la escena pierde el foco.
     */
    pause() {
        this.soundManager?.pauseMusic();
    }

    /**
     * Reanuda la música de la escena final.
     * Puede ser llamado al volver a mostrar la escena.
     */
    resume() {
        this.soundManager?.resumeMusic();
    }

    /**
     * Limpia recursos al cerrar la escena.
     * Detiene la música de créditos.
     */
    shutdown() {
        this.soundManager?.stopMusic();
    }
}