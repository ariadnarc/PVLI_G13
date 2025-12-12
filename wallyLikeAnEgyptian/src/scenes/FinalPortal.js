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

        this.playerNear = false; // flag de interacción

        if (!scene.anims.exists('portal_idle')) {
            scene.anims.create({
                key: 'portal_idle',
                frames: this.scene.anims.generateFrameNumbers('portalFinal', { start: 0, end: 3 }),
                frameRate: 6,
                repeat: -1 // loop
            });
        }
        this.sprite.play('portal_idle');

        this.keyE = scene.input.keyboard.addKey('E');
    }

    update() {
        this.playerNear = false; // reset

        // 2. Ver si hay overlapeo REAL este frame
        this.scene.physics.world.overlap(
            this.player.sprite,
            this.sprite,
            () => {
                this.playerNear = true;
            }
        );

        // 3. Crear texto si está cerca
        if (this.playerNear && !this.infoText) {
            this.infoText = this.scene.add.text(
                this.sprite.x,
                this.sprite.y + 150,
                'Pulsa E para entrar',
                {
                    fontFamily: 'Filgaia',
                    fontSize: '20px',
                    color: '#2d1a00ff'
                }
            ).setOrigin(0.5);
        }

        // 4. Borrar texto si NO está cerca
        if (!this.playerNear && this.infoText) {
            this.infoText.destroy();
            this.infoText = null;
        }

        if (this.playerNear && Phaser.Input.Keyboard.JustDown(this.keyE)) {

            // Quitar texto del portal
            if (this.infoText) {
                this.infoText.destroy();
                this.infoText = null;
            }
            this.scene.scene.launch('FinalMessage');
            this.scene.scene.pause();

            // Opcional: destruir todo ya que vamos al minijuegfinal
        }
    }
}