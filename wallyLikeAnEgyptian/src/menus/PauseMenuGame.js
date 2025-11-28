import MenuBase from './MenuBase.js';

export default class PauseMenuGame extends MenuBase {
  constructor(data) {
    super('PauseMenuGame', data);
  }

  create() {
    super.create(); // activa ESC + InputManager

    const { width, height } = this.sys.game.config;

    // Fondo
    this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0);

    this.add.text(width / 2, 120, 'PAUSA - MODO AVENTURA', {
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Reanudar
    this.createButton('Reanudar', width / 2, 220, () => {
      this.scene.stop();                       // Cierra este menú
      this.scene.resume(this.menuConfig.parentScene);  // Reanuda la escena padre
    });

    // Ajustes
    this.createButton('Ajustes', width / 2, 280, () => {
      this.scene.launch('SettingsMenu', { parentScene: 'PauseMenuGame' });
      this.scene.pause(); // Pausa SOLO este menú
    });

    // Ir al menú principal
    this.createButton('Menú principal', width / 2, 340, () => {
      this.scene.stop(this.menuConfig.parentScene);
      this.scene.start('MainMenu');
    });
  }

  onEscape() {
    // ESC = reanudar juego
    this.scene.stop();
    this.scene.resume(this.menuConfig.parentScene);
  }
}
