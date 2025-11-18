export default class Menu extends Phaser.Scene{
    constructor(){
        super(Menu);
    }
    
  create() {
    // Centrar
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    // Título
    this.add.text(centerX, centerY - 100, 'Pausa', {
      fontFamily: 'Comfortaa',
      fontSize: '64px',
      color: '#3c2f2f',
    }).setOrigin(0.5);

    // Botón de play
    const playButton = this.add.text(centerX, centerY + 50, 'CONTINUAR', {
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
        this.scene.start('MapScene'); // cambiamos de escena al mapa
      });

      // Botón de scape
    const scapeButton = this.add.text(centerX, centerY + 50, 'CONTINUAR', {
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
        this.scene.start('GameTitle'); // cambiamos de escena al menu de inicio
      });
  }
}