/**
 * JSDOC
 * YA
 * A
 */
export default class SalaSecreta { //funciona igual q los cofres de minijuegos pero con valor aleatorio de minijuego en dificil
    constructor(scene, player, onOpenCallback) {
        this.scene = scene;
        this.data = data;
        this.player = player;
        this.onOpenCallback = onOpenCallback;

        this.sprite = this.scene.physics.add.sprite(
            this.data.posInicial.x,
            this.data.posInicial.y,
            'cofre', 0
        );

        this.sprite.setScale(1.5);
        this.sprite.body.setImmovable(true);

        // Detectar si el jugador está encima
        scene.physics.add.overlap(this.player.sprite, this.sprite, () => {
            if (!this.canOpen) {
                this.canOpen = true;
                // Mostrar texto de abrir
                if (!this.infoText) {
                    this.infoText = this.scene.add.text(
                        this.data.posInicial.x,
                        this.data.posInicial.y + 150,
                        `Pulsa E para abrir`,
                        {
                            fontFamily: 'Filgaia',
                            fontSize: '20px',
                            color: '#d8af75ff',
                            fontStyle: 'bold',
                            stroke: '#33261bff',
                            strokeThickness: 4
                        }
                    ).setOrigin(0.5);
                }
            }
        }, null, this);

        // Input de la tecla E
        this.keyE = scene.input.keyboard.addKey('E');
    }

    update() {
        // Abrir cofre si jugador está encima y presiona E
        if (this.canOpen && Phaser.Input.Keyboard.JustDown(this.keyE) && !this.isAnimating) {
            this.isAnimating = true;

            this.sprite.play('cofre_open');

            this.sprite.once('animationcomplete', () => {
                this.sprite.setFrame(0); // volver al frame inicial
                this.isAnimating = false;
                
                if (this.onOpenCallback) {
                    this.onOpenCallback();
                }
            });

            if (this.infoText) {
                this.infoText.destroy();
                this.infoText = null;
            }
            this.canOpen = false; // evitar reabrir sin salir del cofre
        }

        // Si el jugador se aleja, ocultamos texto
        const distance = Phaser.Math.Distance.Between(
            this.player.sprite.x,
            this.player.sprite.y,
            this.sprite.x,
            this.sprite.y
        );

        if (distance > 50 && this.canOpen) {
            this.canOpen = false;
            if (this.infoText) {
                this.infoText.destroy();
                this.infoText = null;
            }
        }
    }
    
}