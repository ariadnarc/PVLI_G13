import MenuBase from './MenuBase.js';

export default class PauseMenuMinigame extends MenuBase {
  constructor() {
    super('PauseMenuMinigame');
  }

  create() {
    // llama al metodo del padre
    super.create();

    const { width, height } = this.sys.game.config;

    // Input escena
    this.inputManager = InputManager.getInstance(this);
    this.inputManager.configure({
        keyboard: true,
        keys: ['ESC']
    });

    this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0);
    this.add.text(width / 2, 120, 'PAUSA - MINIJUEGO', {
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.createButton('Reanudar', width / 2, 220, () => {
      this.scene.stop();
      const parent = this.menuConfig.minigameScene || 'UnknownMinigame';
      this.scene.resume(parent);
    });

    this.createButton('Reintentar', width / 2, 280, () => {
      const minigame = this.menuConfig.minigameScene || 'UnknownMinigame';
      this.scene.stop(minigame);
      this.scene.start(minigame);
    });

    this.createButton('Ajustes', width / 2, 340, () => {
      this.scene.launch('SettingsMenu', { parentMenu: 'PauseMenuMinigame' });
      this.scene.pause();
    });

    this.createButton('Volver al mapa', width / 2, 400, () => {
      this.scene.stop(this.menuConfig.minigameScene);
      this.scene.start('MapScene');
    });
  }

  update(){
    this.inputManager.handleExit('Minigame');
  }
}
