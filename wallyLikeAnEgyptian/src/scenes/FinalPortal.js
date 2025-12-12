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
        this.sprite.setScale(2);
        this.sprite.body.setImmovable(true);

        this.playerNear = false; // flag de interacción

        if (!scene.anims.exists('portal_idle')) {
            scene.anims.create({
                key: 'portal_idle',
                frames: this.scene.anims.generateFrameNumbers('portalFinal', { start: 0, end: 4 }),
                frameRate: 10,
                repeat: 0
            });
        }
        // Detectar si el jugador está encima
        scene.physics.add.overlap(this.player.sprite, this.sprite, () => {
            this.playerNear = true;
        }, null, this);

        // Input de la tecla E
        this.keyE = scene.input.keyboard.addKey('E');
    }

    update() {
        // si está cerca y no hay texto → créalo
        this.playerNear = false;
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

        // si NO está cerca → destruye texto
        if (!this.playerNear && this.infoText) {
            this.infoText.destroy();
            this.infoText = null;
        }



        this.scene.physics.world.overlap(
            this.player.sprite,
            this.sprite,
            () => {
                console.log("🔥 OVERLAP DETECTADO");
            }
        );
        console.log("body:", this.sprite.body);
    }
}