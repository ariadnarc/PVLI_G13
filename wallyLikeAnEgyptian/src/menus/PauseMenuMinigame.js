import MenuBase from './MenuBase.js';

export default class PauseMenuMiniggame extends MenuBase {
  constructor(data) {
    super('PauseMenuMinigme', data);
  }

  create() {
    super.create();

    const { width, height } = this.sys.game.config;

    this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0);
    this.add.text(width / 2, 120, 'PAUSA - MINIJUEGO', {
      fontFamily: 'Filgaia',
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const parent = this.menuConfig.minigameScene;

    // Reanudar
    this.createButton('Reanudar', width / 2, 220, () => {
      this.scene.stop();
      this.scene.resume(parent);
    }, { width: 250, height: 60, hoverTint: 0xffaa00, fontSize: '28px' },
    'fondoBoton');

    // Reintentar
    this.createButton('Reintentar', width / 2, 280, () => {
      this.scene.stop(parent);
      this.scene.start(parent);
    }, { width: 250, height: 60, hoverTint: 0xffaa00, fontSize: '28px' },
    'fondoBoton');

    // Ajustes
    this.createButton('Ajustes', width / 2, 340, () => {
      this.scene.launch('SettingsMenu', { parentScene: 'PauseMenuMinigame' });
      this.scene.pause();
    }, { width: 250, height: 60, hoverTint: 0xffaa00, fontSize: '28px' },
    'fondoBoton');

    // Volver al mapa
    this.createButton('Volver al mapa', width / 2, 400, () => {
      this.scene.stop(parent);
      this.scene.start('MapScene');
    }, { width: 250, height: 60, hoverTint: 0xffaa00, fontSize: '28px' },
    'fondoBoton');
  }

  onEscape() {
    const parent = this.menuConfig.minigameScene;
    this.scene.stop();
    this.scene.resume(parent);
  }
}
