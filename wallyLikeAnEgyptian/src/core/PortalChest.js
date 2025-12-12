/**
 * JSDOC
 * YA
 * A
 */

export default class PortalChest {
    constructor(scene, data, player, callback) {
        this.scene = scene;
        this.data = data;
        this.player = player;
        this.callback = callback;

        this.sprite = this.scene.physics.add.sprite(
            this.data.posInicial.x,
            this.data.posInicial.y,
            'cofre', 0);

        this.sprite.setScale(1.5);
        this.sprite.body.setImmovable(true);

        if (!scene.anims.exists('cofre_open')) {
            scene.anims.create({
                key: 'cofre_open',
                frames: this.scene.anims.generateFrameNumbers('cofre', { start: 0, end: 4 }),
                frameRate: 10,
                repeat: 0
            });
        }
        // Detectar si el jugador está encima
        scene.physics.add.overlap(this.player.sprite, this.sprite, () => {
            if (!this.canOpen) {
                this.canOpen = true;
                //escribimos texto con info

                this.infoText = this.scene.add.text(this.data.posInicial.x, this.data.posInicial.y + 150, `Pulsa E para abrir`, {
                    fontFamily: 'Filgaia',
                    fontSize: '20px',
                    color: '#d8af75ff',
                    fontStyle: 'bold',
                    stroke: '#33261bff',
                    strokeThickness: 4
                }).setOrigin(0.5);
            }

        }, null, this);

        // Input de la tecla E
        this.keyE = scene.input.keyboard.addKey('E');
    }

    update() {
        // Solo abrir si jugador está encima, presiona E y no hay animación en curso
        if (this.canOpen && Phaser.Input.Keyboard.JustDown(this.keyE) && !this.isAnimating) {
            this.isAnimating = true;

            this.sprite.play('cofre_open');

            this.sprite.once('animationcomplete', () => {
                this.sprite.setFrame(0); // volver al frame inicial
                this.isAnimating = false;
                if (this.callback) this.callback(this.data.minijuego);
            });
            if (this.infoText) {
                this.infoText.destroy();
                this.infoText = null;
            }
            this.canOpen = false; // para evitar reabrir sin salir del cofre
        }

        const distance = Phaser.Math.Distance.Between(
            this.player.sprite.x,
            this.player.sprite.y,
            this.sprite.x,
            this.sprite.y
        );

        if (distance > 50 && this.canOpen) { // 50 px de tolerancia
            this.canOpen = false;
            if (this.infoText) {
                this.infoText.destroy();
                this.infoText = null;
            }
        }
    }
}