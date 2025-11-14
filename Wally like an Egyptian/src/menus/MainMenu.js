import MenuBase from './MenuBase.js';

export default class MainMenu extends MenuBase {
  constructor() {
    super('MainMenu', {});
  }

  create() {
    // llama al metodo del padre
    super.create();

    const { width, height } = this.sys.game.config;

    this.inputManager.configureInputs({
        mouse: true
    });

    // Fondo completo
    this.add.rectangle(0, 0, width, height, 0x2c3e50).setOrigin(0);

    this.add.text(width / 2, 120, 'WALLY LIKE AN EGYPTIAN', {
      fontFamily: 'Comfortaa',
      fontSize: '36px',
      color: '#f1c40f',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, 170, 'Una aventura para entregar el café más importante de tu vida ☕', {
      fontFamily: 'Comfortaa',
      fontSize: '16px',
      color: '#ecf0f1',
      wordWrap: { width: width - 100 },
      align: 'center',
    }).setOrigin(0.5);

    this.createButton('Jugar', width / 2, 260, () => {
      this.scene.start('MapScene');
    });

    this.createButton('Ajustes', width / 2, 320, () => {
      this.scene.launch('SettingsMenu', { parentScene: 'MainMenu' });
      this.scene.pause();
    });

    // TODO: Meter una animacion previa al MenuInicio (si da tiempo)
    this.createButton('Salir', width / 2, 380, () => {
      console.log('Salir del juego (placeholder)');
    });
  }
}
