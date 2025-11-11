import MenuBase from './MenuBase.js';

export default class MainMenu extends MenuBase {
  constructor() {
    super('MainMenu');
  }

  initMenu() {
    const { width, height } = this.scale;

    // Fondo completo
    this.add.rectangle(0, 0, width, height, 0x2c3e50).setOrigin(0);

    this.add.text(width / 2, 120, 'WALLY LIKE AN EGYPTIAN', {
      fontSize: '36px',
      color: '#f1c40f',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, 170, 'Una aventura para entregar el café más importante de tu vida ☕', {
      fontSize: '16px',
      color: '#ecf0f1',
      wordWrap: { width: width - 100 },
      align: 'center',
    }).setOrigin(0.5);

    this.createButton('Nueva Partida', width / 2, 260, () => {
      this.scene.start('MapScene');
    });

    this.createButton('Ajustes', width / 2, 320, () => {
      this.scene.launch('SettingsMenu', { parentMenu: 'MainMenu' });
      this.scene.pause();
    });

    this.createButton('Salir', width / 2, 380, () => {
      console.log('Salir del juego (placeholder)');
    });
  }
}
