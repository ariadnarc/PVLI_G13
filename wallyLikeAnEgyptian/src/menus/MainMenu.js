import MenuBase from './MenuBase.js';

export default class MainMenu extends MenuBase {
  constructor() {
    super('MainMenu', {});
  }

  create() {
    super.create();

    const { width, height } = this.sys.game.config;

    // === FONDO ===
    const bg = this.add.image(width / 2, height / 2, 'mainmenuBG');
    bg.setDisplaySize(width, height);
    bg.setDepth(-10);

    // color debajo por si no carga el fondo:
    // this.add.rectangle(0, 0, width, height, 0x2c3e50).setOrigin(0);

    this.add.text(450, 150, 'WALLY LIKE AN EGYPTIAN', {
      fontFamily: 'Filgaia',
      fontSize: '40px',
      color: '#634830ff',
    }).setOrigin(0.5);

    this.add.text(450, 223,
      'La entrega del café más importante de tu vida ☕',
      {
        fontFamily: 'Filgaia',
        fontSize: '23px',
        color: '#ddd',
        fontStyle: 'bold',
        wordWrap: { width: width - 100 },
        align: 'center',
      })
      .setOrigin(0.5);

    this.createButton('Jugar', 450, 320, () => {
      this.scene.start('MapScene');
    },{ width: 250, height: 60, hoverTint: 0xffaa00, fontSize: '28px' },
    'fondoBoton');

    this.createButton('Ajustes', 450, 420, () => {
      this.scene.launch('SettingsMenu', { parentScene: 'MainMenu' });
      this.scene.pause();
    }, { width: 250, height: 60, hoverTint: 0xffaa00, fontSize: '28px' },
    'fondoBoton');
  }

  // MainMenu: ESC no hace nada
  onEscape() {
    console.log("ESC en MainMenu: ignorado.");
  }
}
