/**
 * @file FinalPortal.js
 * @class FinalPortal
 * @description
 * Portal final del juego.
 * Permite al jugador acceder a la escena final cuando se acerca
 * y pulsa la tecla de interacción.
 */

/**
 * Clase que representa el portal final interactivo.
 * Gestiona la detección de proximidad del jugador, la interacción
 * mediante teclado y la transición a la escena final del juego.
 */
export default class FinalPortal {

    /**
     * Crea una instancia del portal final.
     *
     * @param {Phaser.Scene} scene - Escena en la que se crea el portal.
     * @param {number} x - Posición X del portal en el mundo.
     * @param {number} y - Posición Y del portal en el mundo.
     * @param {Object} player - Referencia al jugador (debe contener `sprite`).
     */
    constructor(scene, x, y, player) {

        /**
         * Escena en la que existe el portal.
         * @type {Phaser.Scene}
         */
        this.scene = scene;

        /**
         * Referencia al jugador.
         * Se espera que tenga una propiedad `sprite` con físicas.
         * @type {Object}
         */
        this.player = player;

        /**
         * Sprite físico del portal.
         * @type {Phaser.Physics.Arcade.Sprite}
         */
        this.sprite = this.scene.physics.add.sprite(x, y, 'portalFinal', 0);
        this.sprite.setScale(0.1);
        this.sprite.body.setImmovable(true);

        this.sprite.play('portal_idle');

        /**
         * Indica si el jugador está cerca del portal este frame.
         * @type {boolean}
         */
        this.playerNear = false; 

        /**
         * Texto informativo que aparece al acercarse al portal.
         * @type {Phaser.GameObjects.Text|null}
         */
        this.infoText = null;

        /**
         * Indica si el portal ya ha sido activado.
         * @type {boolean}
         */
        this.isActivated = false;

        /**
         * Tecla de interacción para activar el portal.
         * @type {Phaser.Input.Keyboard.Key}
         */
        this.keyE = scene.input.keyboard.addKey('E');
    }

    /**
     * Actualiza el estado del portal en cada frame.
     * Comprueba la proximidad del jugador, muestra u oculta
     * el texto de interacción y detecta la pulsación de la tecla.
     */
    update() {

        //=== GUARDS ===
        if (!this.scene || 
            !this.scene.physics ||
            !this.scene.physics.world ||
            !this.player ||
            !this.player.sprite ||
            !this.player.sprite.body ||
            !this.sprite ||
            !this.sprite.body) {
            return;
        }
    
        this.playerNear = false; // reset

        // Ver si hay overlapeo real este frame
        this.scene.physics.world.overlap(
            this.player.sprite,
            this.sprite,
            () => {
                this.playerNear = true;
            }
        );

        // Crear texto si está cerca
        if (this.playerNear && !this.infoText) {
            this.infoText = this.scene.add.text(
                this.sprite.x,
                this.sprite.y + 50,
                'Enfrentar',
                {
                    fontFamily: 'Filgaia',
                    fontSize: '20px',
                    color: '#2d1a00ff'
                }
            ).setOrigin(0.5);
        }

        // Borrar texto si NO está cerca
        if (!this.playerNear && this.infoText) {
            this.infoText.destroy();
            this.infoText = null;
        }

        // Activar portal al pulsar la tecla de interacción
        if (this.playerNear && Phaser.Input.Keyboard.JustDown(this.keyE)) {
            this.activatePortal();
        }
    }

    /**
     * Activa el portal final.
     * Limpia elementos visuales, detiene la escena actual
     * y lanza directamente la escena final del juego.
     */
    activatePortal() {
        this.isActivated = true;

        // Limpiar texto informativo
        if (this.infoText) {
            this.infoText.destroy();
            this.infoText = null;
        }

        // Parar escena actual 
        const currentSceneKey = this.scene.scene.key;
        this.scene.scene.stop(currentSceneKey);

        // Ir directamente a la escena final
        this.scene.scene.start('FinalGame');
    }

    /**
     * Destruye el portal y libera todos sus recursos.
     * Debe llamarse al salir de la escena para evitar fugas de memoria.
     */
    destroy() {
        if (this.infoText) {
            this.infoText.destroy();
            this.infoText = null;
        }

        if (this.sprite) {
            this.sprite.destroy();
            this.sprite = null;
        }

        if (this.keyE) {
            this.keyE.destroy();
            this.keyE = null;
        }
    }
}