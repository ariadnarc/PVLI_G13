/**
 * @file MainMenu.js
 * @class MainMenu
 * @extends MenuBase
 * @description
 * Escena del menú principal del juego.
 * Muestra el fondo, título, subtítulo y botones principales
 * (Jugar y Ajustes). Gestiona la música del menú principal
 * y desactiva el comportamiento por defecto de la tecla ESC.
 */

import MenuBase from './MenuBase.js';

/**
 * Menú principal del juego.
 * Extiende MenuBase.
 */
export default class MainMenu extends MenuBase {
  /**
   * Crea la escena del menú principal.
   */
  constructor() {
    super('MainMenu', {});
  }

  /**
   * Crea todos los elementos visuales e interactivos del menú principal.
   * Incluye fondo, textos, botones y música.
   */
  create() {
    super.create();

    const { width, height } = this.sys.game.config;

    // Gestor de sonido
    this.soundManager = this.registry.get('soundManager');
    this.soundManager.playMusic('walkLikeAnEgyptian');
    
    //=== FONDO ===
    const bg = this.add.image(width / 2, height / 2, 'mainmenuBG');
    bg.setDisplaySize(width, height);
    bg.setDepth(-10);

    //=== TÍTULO ===
    this.add.text(450, 150, 'WALLY LIKE AN EGYPTIAN', {
      fontFamily: 'Filgaia',
      fontSize: '40px',
      color: '#634830ff',
    }).setOrigin(0.5);
    
    //=== SUBTÍTULO ===
    this.add.text(450, 223,
      '¿Qué se esconde en lo profundo de la pirámide? ☕',
      {
        fontFamily: 'Filgaia',
        fontSize: '23px',
        color: '#ddd',
        fontStyle: 'bold',
        wordWrap: { width: width - 100 },
        align: 'center',
      }
    ).setOrigin(0.5);
    
    //=== BOTÓN JUGAR ===
    this.createButton('Jugar', 450, 320, () => {
      this.soundManager?.stopMusic();
      this.soundManager?.play('click');
      this.scene.start('IntroScene');
    }, { width: 250, height: 60, hoverTint: 0xffaa00, fontSize: '28px' },
    'fondoBoton'
    );
    
    //=== BOTÓN AJUSTES ===
    this.createButton('Ajustes', 450, 420, () => {
      this.soundManager?.play('click');
      this.scene.launch('SettingsMenu', { parentScene: 'MainMenu' });
      this.scene.pause();
    }, { width: 250, height: 60, hoverTint: 0xffaa00, fontSize: '28px' },
    'fondoBoton'
    );
  }

  /**
   * Sobrescribe el comportamiento del ESC.
   * En el menú principal, ESC no realiza ninguna acción.
   */
  onEscape() {
    console.log("ESC en MainMenu: ignorado.");
  }
}
