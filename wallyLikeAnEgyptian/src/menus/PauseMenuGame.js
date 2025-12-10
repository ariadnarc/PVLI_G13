import MenuBase from './MenuBase.js';

export default class PauseMenuGame extends MenuBase {

  constructor() {
    super('PauseMenuGame');
  }

  init(data) {
    this.parentScene = data.parentScene; //esta es la escena q pausamos
    this.isMinigame = !!data.isMinigame; //flag para saber si vienes de un minijuego
  }

  create() {
    super.create(); //activa ESC + InputManager

    this.scene.bringToTop(); //aseguramos que la escena este encima de todo
    const { width, height } = this.sys.game.config;

    //fondo semitransparente con depth alto
    this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0).setDepth(1000);

    //titulo de pausa
    const title = this.isMinigame ? 'PAUSA - MINIJUEGO' : 'PAUSA - MODO AVENTURA';
    this.add.text(width / 2, 120, title, {
      fontFamily: 'Filgaia',
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(1001);

    //=========DESDE MINIJUEGO===========
    if (this.isMinigame) {
      //reintentar
      this.createButton('Reintentar', width / 2, 240, () => {
        this.scene.stop(this.parentScene);
        this.scene.start(this.parentScene);
      }, { width: 250, height: 60, hoverTint: 0xffaa00, fontSize: '28px' }, 'fondoBoton').setDepth(1002);

      //volver al mapa
      this.createButton('Volver al mapa', width / 2, 340, () => {
        this.scene.stop(this.parentScene);
        this.scene.start('MapScene');
      }, { width: 350, height: 60, hoverTint: 0xffaa00, fontSize: '28px' }, 'fondoBoton').setDepth(1002);

      //ajustes
      this.createButton('Ajustes', width / 2, 440, () => {
        this.scene.launch('SettingsMenu', { parentScene: 'PauseMenuGame' });
        this.scene.bringToTop('SettingsMenu');
        this.scene.pause();
      }, { width: 250, height: 60, hoverTint: 0xffaa00, fontSize: '28px' }, 'fondoBoton').setDepth(1002);
    } else 
    //=========DESDE MAPA===========
    {
      // Ajustes
      this.createButton('Ajustes', width / 2, 280, () => {
        this.scene.launch('SettingsMenu', { parentScene: 'PauseMenuGame' });
        this.scene.bringToTop('SettingsMenu');
        this.scene.pause();
      }, { width: 250, height: 60, hoverTint: 0xffaa00, fontSize: '28px' }, 'fondoBoton').setDepth(1002);

      // Menu principal
      this.createButton('Menú principal', width / 2, 360, () => {
        this.scene.stop(this.parentScene);
        this.scene.start('MainMenu');
        this.scene.stop();
      }, { width: 340, height: 60, hoverTint: 0xffaa00, fontSize: '28px' }, 'fondoBoton').setDepth(1002);
    }

    //Reanudar
    this.add.text(width / 2, height - 60, 'Pulsa ESC para reanudar', {
      fontFamily: 'Filgaia',
      fontSize: '18px',
      color: '#cccccc'
    } ).setOrigin(0.5).setDepth(1003);
  }

  onEscape() {
    // ESC = reanudar juego
    this.scene.stop();
    const parent = this.scene.get(this.parentScene);
    if (parent.inputManager) parent.inputManager.enabled = true;
  }
}
