export default class GameTitle extends Phaser.Scene {
  constructor() {
    super('GameTitle');
  }

  create() {
    // Centrar
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    // Título
    this.add.text(centerX, centerY - 100, 'Wally like an Egyptian', {
      fontFamily: 'Comfortaa',
      fontSize: '64px',
      color: '#3c2f2f',
    }).setOrigin(0.5);

    // Botón de play
    const playButton = this.add.text(centerX, centerY + 50, 'JUGAR', {
      fontFamily: 'Comfortaa',
      fontSize: '48px',
      color: '#ffffff',
      backgroundColor: '#3c2f2f',
      padding: { x: 30, y: 15 },
      borderRadius: 10,
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true }) // esto hace q el texto sea interactivo y funcione como un botón
      .on('pointerover', () => playButton.setStyle({ backgroundColor: '#5a4444' }))
      .on('pointerout', () => playButton.setStyle({ backgroundColor: '#3c2f2f' }))
      .on('pointerdown', () => {
        this.scene.start('MapScene'); // cambiamos de escena
      });
  }
}