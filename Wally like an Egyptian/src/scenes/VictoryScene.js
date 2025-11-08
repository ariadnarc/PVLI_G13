export default class VictoryScene extends Phaser.Scene {
    constructor() {
        super('VictoryScene');
    }

    create() {
        // FOndo
        const overlay = this.add.rectangle(
            0, 0,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000,
            0.6 // 60% de opacidad
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
            'Conseguiste el jeroglífico',
            { fontSize: '20px', color: '#000' }
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
            this.scene.launch('MapScene');
        });
    }
}