export default class MensajeFinal extends Phaser.Scene {
    constructor() {
        super('MensajeFinal');
    }

    create() {
        // fondo
        const overlay = this.add.rectangle(
            0, 0,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000,
            0.8 // 60% de opacidad
        ).setOrigin(0);

        const panel = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            400, 300,
            0xffffff
        );

        const texto = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 50,
            'jerogíficos descifrados',
            { fontSize: '22px', color: '#000' }
        ).setOrigin(0.5);

        // Botón para cerrar
        const btnContinuar = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 100,
            'Continuar',
            { fontSize: '24px', color: '#000' }
        ).setOrigin(0.5).setInteractive();

        btnContinuar.on('pointerdown', () => {
            this.scene.stop(); // Cierra esta escena
        });
    }
}