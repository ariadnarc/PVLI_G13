class Start extends Phaser.Scene {
  constructor() {
    super('Start'); // clave de la escena
  }

  create() {

    // fondo
    this.add.rectangle(400, 300, 800, 600, 0xd97f40).setOrigin(0.5);

    // título
    this.titleText = this.add.text(400, 200, 'Wally Like An Egyptian', {
      fontFamily: '"LUCKIEST GUY",cursive',
      fontSize: '48px',
      color: '#3a2a1f',
      align: 'center'
    }).setOrigin(0.5);

    // botón (texto interactivo)
    const playButton = this.add.text(400, 360, 'JUGAR', {
      fontFamily: '"Confortaa",san-serif',
      fontSize: '36px',
      color: '#000000',
      backgroundColor: '#c8a679',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);

    playButton.setInteractive({ useHandCursor: true });
    playButton.on('pointerover', () => playButton.setAlpha(0.8));
    playButton.on('pointerout', () => playButton.setAlpha(1));
    playButton.on('pointerdown', () => {
      this.scene.start('MapScene');
    });

    // teclado: una sola vez
    this.input.keyboard.once('keydown-SPACE', () => {
      console.log('SPACE pulsado -> start MapScene');
      this.scene.start('MapScene');
    });
  }
}

