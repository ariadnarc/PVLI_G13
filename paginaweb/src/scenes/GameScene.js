export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    this.add.text(centerX, centerY, '¡Bienvenido al juego!', {
      fontFamily: 'Comfortaa',
      fontSize: '48px',
      color: '#3c2f2f',
    }).setOrigin(0.5);

    // botón para volver al menú
    const backButton = this.add.text(centerX, centerY + 100, 'Volver al menú', {
      fontFamily: 'Comfortaa',
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#3c2f2f',
      padding: { x: 20, y: 10 },
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start('GameTitle');
      });
  }
}
