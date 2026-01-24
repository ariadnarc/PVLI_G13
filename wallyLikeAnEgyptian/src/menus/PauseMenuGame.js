/**
 * @file PauseMenuGame.js
 * @class PauseMenuGame
 * @extends MenuBase
 * @description
 * Menú de pausa global del juego.
 * Overlay que permite reanudar, reiniciar, ir a ajustes o al menú principal.
 * Funciona tanto desde minijuegos como desde modo aventura.
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
    /**
     * Indica que esta escena funciona como overlay.
     * @type {boolean}
     */
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
   * Configura el overlay, pausa el audio global y muestra opciones
   * diferentes según se acceda desde un minijuego o desde el modo aventura.
   * @override
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
      this.createButton('Reintentar', width / 2, 240, () => this.retryMinigame(),
      { width: 250, height: 60, hoverTint: 0xffaa00, fontSize: '28px' }, 'fondoBoton').setDepth(1002);

      // Volver al mapa
      this.createButton('Volver al mapa', width / 2, 340, () => this.goToMap(),
      { width: 350, height: 60, hoverTint: 0xffaa00, fontSize: '28px' }, 'fondoBoton').setDepth(1002);

      // Ajustes
      this.createButton('Ajustes', width / 2, 440, () => this.openSettings(), 
      { width: 250, height: 60, hoverTint: 0xffaa00, fontSize: '28px' }, 'fondoBoton').setDepth(1002);

    } else {

    //=== DESDE MAPA ===

      // Ajustes
      this.createButton('Ajustes', width / 2, 280, () => this.openSettings(),
      { width: 250, height: 60, hoverTint: 0xffaa00, fontSize: '28px' }, 'fondoBoton').setDepth(1002);

      // Volver al menú principal
      this.createButton('Menú principal', width / 2, 360, () => this.goToMainMenu(),
      { width: 340, height: 60, hoverTint: 0xffaa00, fontSize: '28px' }, 'fondoBoton').setDepth(1002);
    }

    // Texto de reanudar
    this.add.text(width / 2, height - 60, 'Pulsa ESC para reanudar', {
      fontFamily: 'Filgaia',
      fontSize: '18px',
      color: '#cccccc'
    }).setOrigin(0.5).setDepth(1003);
  }

  //=== ACCIONES DE BOTONES ===

  /**
   * Reintenta el minijuego actual.
   * Detiene la escena padre, la reinicia desde cero y cierra el overlay de pausa.
   */
  retryMinigame() {
    this.soundManager?.play('click');
    this.soundManager?.resumeAll();
    this.scene.stop(this.parentScene);
    this.scene.start(this.parentScene); // reinicia minijuego desde cero
    this.scene.stop(); // cerrar overlay
  }

  /**
   * Vuelve al mapa principal desde un minijuego.
   * Detiene la escena padre (minijuego), reanuda el audio y abre la escena del mapa.
   */
  goToMap() {
    this.soundManager?.play('click');
    this.soundManager?.resumeAll();
    this.scene.stop(this.parentScene);
    this.scene.start('MapScene');
    this.scene.stop();
  }

  /**
   * Vuelve al menú principal.
   * Detiene la música y recarga la página para reiniciar completamente el juego.
   */
  goToMainMenu() {
    this.soundManager?.play('click');
    this.soundManager?.stopMusic();
    window.location.reload();
  }

  /**
   * Abre el menú de ajustes como overlay sobre el menú de pausa.
   * Lanza la escena `SettingsMenu` y pausa temporalmente este overlay.
   */
  openSettings() {
    this.soundManager?.play('click');
    this.scene.launch('SettingsMenu', { parentScene: 'PauseMenuGame' });
    this.scene.bringToTop('SettingsMenu');
    this.scene.pause();
  }

  /**
   * Maneja la pulsación de ESC.
   * Reanuda la escena padre, restaura el sonido y cierra el menú de pausa.
   * @override
   */
  onEscape() {
    this.soundManager = this.registry.get('soundManager');
    this.soundManager?.resumeAll();
    
    this.scene.stop();
    
    const parent = this.scene.get(this.parentScene);
    if (parent.inputManager) parent.inputManager.enabled = true;
  }
}
