/**
 * JSDOC
 * YA
 * A
 */

export default class FinalPortal {
    constructor(scene, x, y, player) {
        this.scene = scene;
        this.player = player;

        this.sprite = this.scene.physics.add.sprite(x, y, 'portalFinal', 0);
        this.sprite.setScale(0.1);
        this.sprite.body.setImmovable(true);

        this.sprite.play('portal_idle');

        this.playerNear = false; // flag de interacción
        this.infoText = null;
        this.isActivated = false;

        this.keyE = scene.input.keyboard.addKey('E');
    }

    update() {

        // ====== GUARDS (MUY IMPORTANTES) ======
    if (!this.scene || !this.scene.physics ||
        !this.scene.physics.world ||
        !this.player ||
        !this.player.sprite ||
        !this.player.sprite.body ||
        !this.sprite ||
        !this.sprite.body) {
        return;
    }
    // =====================================

        this.playerNear = false; // reset

        // Ver si hay overlapeo REAL este frame
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

        if (this.playerNear && Phaser.Input.Keyboard.JustDown(this.keyE)) {
            this.activatePortal();
        }
    }

    activatePortal() {
        this.isActivated = true;

        // limpiar texto
        if (this.infoText) {
            this.infoText.destroy();
            this.infoText = null;
        }

        // parar escena actual 
        const currentSceneKey = this.scene.scene.key;
        this.scene.scene.stop(currentSceneKey);

        // ir DIRECTO al final
        this.scene.scene.start('FinalGame');
    }

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