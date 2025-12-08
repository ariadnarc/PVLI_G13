import MenuBase from './MenuBase.js';

export default class PauseMenuGame extends MenuBase {

  constructor() {
    super('PauseMenuGame');
  }

  init(data) {
    // Guardamos la escena padre que nos envía MapScene
    this.parentScene = data.parentScene;
  }

  create() {
    super.create(); // activa ESC + InputManager

    const { width, height } = this.sys.game.config;

    // Fondo semitransparente
    this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0);

    this.add.text(width / 2, 120, 'PAUSA - MODO AVENTURA', {
      fontFamily: 'Filgaia',
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    //========BOTON REANUDAR=========
    this.createButton('Reanudar', width / 2, 220, () => {
      this.scene.stop();                       // Cierra este menú
      this.scene.resume(this.parentScene);  // Reanuda la escena padre
    },{ width: 250, height: 60, hoverTint: 0xffaa00, fontSize: '28px' },
    'fondoBoton');

    //========BOTON AJUSTES=========
    this.createButton('Ajustes', width / 2, 320, () => {
      // Abrimos ajustes ENCIMA del menú de pausa
      this.scene.launch('SettingsMenu', { parentScene: 'PauseMenuGame' });

      //PAUSAR ESTA ESCENA ERA LO QUE ROMPIA EL FLUJO
    },{ width: 250, height: 60, hoverTint: 0xffaa00, fontSize: '28px' },
    'fondoBoton');

    //========BOTON MAINMENU=========
    this.createButton('Menú principal', width / 2, 420, () => {
      this.scene.stop(this.parentScene);
      this.scene.start('MainMenu');
    },{ width: 340, height: 60, hoverTint: 0xffaa00, fontSize: '28px' },
    'fondoBoton');
  }

  onEscape() {
    // ESC = reanudar juego
    this.scene.stop();
    this.scene.resume(this.parentScene);
  }
}
