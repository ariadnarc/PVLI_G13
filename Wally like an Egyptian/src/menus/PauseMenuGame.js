import MenuBase from './MenuBase.js';

export default class PauseMenuGame extends MenuBase {
  constructor() {
    super('PauseMenuGame');
  }

  initMenu() {
    // llama al metodo del padre
    super.createBase();

    const { width, height } = this.sys.game.config;

    // Input escena
    this.inputManager.configureInputs({
        keyboard: true,
        keys: ['ESC']
    });

    // Fondo overlay translúcido
    this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0);

    this.add.text(width / 2, 120, 'PAUSA - MODO AVENTURA', {
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Botones
    this.createButton('Reanudar', width / 2, 220, () => {
      this.scene.stop();               // Cierra este menú
      this.scene.resume('MapScene');   // Reanuda el mapa
    });

    this.createButton('Ajustes', width / 2, 280, () => {
      this.scene.launch('SettingsMenu', { parentMenu: 'PauseMenuGame' });
      this.scene.pause();              // Pausa este menú (no el mapa)
    });

    this.createButton('Menú principal', width / 2, 340, () => {
      this.scene.stop('MapScene');
      this.scene.start('MainMenu');
    });
  }

  update(){
    this.inputManager.handleExit('Minigame');
  }
}
