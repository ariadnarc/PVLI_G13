/**
 * @file PauseMenuGame.js
 * @class PauseMenuGame
 * @extends MenuBase
 * @description
 * Menú de pausa global del juego.
 * Funciona como overlay sobre la escena activa y adapta
 * sus opciones dependiendo de si el jugador proviene
 * de un minijuego o del modo aventura.
 * Permite reanudar, reiniciar, acceder a ajustes o volver al menú principal.
 */

import MenuBase from './MenuBase.js';

/**
 * Escena de menú de pausa del juego.
 * Extiende MenuBase y se comporta como overlay.
 */
export default class PauseMenuGame extends MenuBase {

  /**
   * Crea la escena del menú de pausa.
   */
  constructor() {
    super('PauseMenuGame');
    this.isOverlay = true;
  }

  /**
   * Inicializa el menú de pausa con datos de la escena llamante.
   * @param {Object} data
   * @param {string} data.parentScene - Escena que se ha pausado
   * @param {boolean} data.isMinigame - Indica si la escena pausada es un minijuego
   */
  init(data) {
    this.parentScene = data.parentScene; //esta es la escena q pausamos
    this.isMinigame = !!data.isMinigame; //flag para saber si vienes de un minijuego
  }

  /**
   * Crea los elementos visuales e interactivos del menú de pausa.
   * Se adapta dinámicamente si se accede desde un minijuego
   * o desde el modo aventura.
   */
  create() {
    super.create(); //activa ESC + InputManager

    this.soundManager = this.registry.get('soundManager');
    this.soundManager?.pauseAll();

    // Aseguramos que el menú esté por encima de todo
    this.scene.bringToTop(); 

    const { width, height } = this.sys.game.config;

    // Fondo semitransparente
    this.add
      .rectangle(0, 0, width, height, 0x000000, 0.6)
      .setOrigin(0)
      .setDepth(1000);

    // Título
    const title = this.isMinigame
     ? 'PAUSA - MINIJUEGO'
     : 'PAUSA - MODO AVENTURA';

    this.add.text(width / 2, 120, title, {
      fontFamily: 'Filgaia',
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(1001);

    //=== DESDE MINIJUEGO ===
    if (this.isMinigame) {

      // Reintentar minijuego
      this.createButton('Reintentar', width / 2, 240, () => {
        this.soundManager?.play('click');
        this.soundManager?.resumeAll();
        this.scene.stop(this.parentScene);
        this.scene.start(this.parentScene);
      }, { width: 250, height: 60, hoverTint: 0xffaa00, fontSize: '28px' }, 'fondoBoton').setDepth(1002);

      // Volver al mapa
      this.createButton('Volver al mapa', width / 2, 340, () => {
        this.soundManager?.play('click');
        this.soundManager?.resumeAll();
        this.scene.stop(this.parentScene);
        this.scene.start('MapScene');
      }, { width: 350, height: 60, hoverTint: 0xffaa00, fontSize: '28px' }, 'fondoBoton').setDepth(1002);

      // Ajustes
      this.createButton('Ajustes', width / 2, 440, () => {
        this.soundManager?.play('click');
        this.scene.launch('SettingsMenu', { parentScene: 'PauseMenuGame' });
        this.scene.bringToTop('SettingsMenu');
        this.scene.pause();
      }, { width: 250, height: 60, hoverTint: 0xffaa00, fontSize: '28px' }, 'fondoBoton').setDepth(1002);
    } else {

    //=== DESDE MAPA ===

      // Ajustes
      this.createButton('Ajustes', width / 2, 280, () => {
        this.soundManager?.play('click');
        this.scene.launch('SettingsMenu', { parentScene: 'PauseMenuGame' });
        this.scene.bringToTop('SettingsMenu');
        this.scene.pause();
      }, { width: 250, height: 60, hoverTint: 0xffaa00, fontSize: '28px' }, 'fondoBoton').setDepth(1002);

      // Volver al menú principal
      this.createButton('Menú principal', width / 2, 360, () => {
        this.soundManager?.play('click');
        this.soundManager?.stopMusic();
        this.scene.stop(this.parentScene);
        this.scene.start('MainMenu');
        this.scene.stop();
      }, { width: 340, height: 60, hoverTint: 0xffaa00, fontSize: '28px' }, 'fondoBoton').setDepth(1002);
    }

    // Texto de reanudar
    this.add.text(width / 2, height - 60, 'Pulsa ESC para reanudar', {
      fontFamily: 'Filgaia',
      fontSize: '18px',
      color: '#cccccc'
    }).setOrigin(0.5).setDepth(1003);
  }

  /**
   * Maneja la pulsación de ESC.
   * Reanuda la escena padre y restaura el sonido.
   */
  onEscape() {
    this.soundManager = this.registry.get('soundManager');
    this.soundManager?.resumeAll();
    
    this.scene.stop();
    
    const parent = this.scene.get(this.parentScene);
    if (parent.inputManager) parent.inputManager.enabled = true;
  }
}
