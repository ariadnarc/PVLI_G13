/**
 * @file PreMinigameScene.js
 * @class PreMinigameScene
 * @extends MenuBase
 * @description
 * Pantalla previa a cada minijuego.
 * Muestra información del jeroglífico, la dificultad y los controles,
 * y permite iniciar el minijuego o volver al mapa.
 */
import MenuBase from '../menus/MenuBase.js';
import { JEROGLIFICOS_DATA } from '../config/JeroglificosData.js';
import { NOMBRES_MINIJUEGOS } from '../config/MinigameData.js';
import { addJeroglifico, hasJeroglifico } from '../config/PlayerData.js';

/**
 * Escena de información previa al minijuego.
 * Extiende MenuBase y actúa como un menú intermedio entre el mapa y el minijuego.
 */
export default class PreMinigameScene extends MenuBase {

  /**
   * Crea la escena PreMinigameScene.
   */
  constructor() {
    super('PreMinigameScene');
  }

  /**
   * Inicializa la escena con los datos del minijuego y el jeroglífico.
   * @param {Object} data - Datos pasados desde la escena que abre este menú.
   * @param {string} data.minijuego - Clave del minijuego a iniciar.
   * @param {string} data.dificultad - Dificultad seleccionada para el minijuego.
   * @param {string|number} data.jeroglificoId - ID del jeroglífico asociado al minijuego.
   * @param {string[]} [data.controles=[]] - Lista de textos con los controles a mostrar.
   * @param {string} data.parentScene - Clave de la escena padre (por ejemplo, 'MapScene').
   */
  init(data) {
    super.init(data);

    this.minijuego = data.minijuego;
    this.dificultad = data.dificultad;
    this.jeroglificoId = data.jeroglificoId;
    this.controles = data.controles || [];
    this.parentScene = data.parentScene;

    this.nombreMinijuego = NOMBRES_MINIJUEGOS[this.minijuego];
    this.jeroglifico = JEROGLIFICOS_DATA.find(j => j.id === this.jeroglificoId);
  }

  /**
   * Crea y dibuja la interfaz previa al minijuego.
   * Muestra nombre del minijuego, jeroglífico, dificultad, controles
   * y los botones de "JUGAR" y "VOLVER".
   * @override
   */
  create() {
    super.create();

    const centerX = this.cameras.main.centerX;
    const { width, height } = this.sys.game.config;

    const jeroOwned = hasJeroglifico(this.jeroglificoId);

    //=== Fondo ===
    const bg = this.add.image(width / 2, height / 2, 'selectdiffBG');
    bg.setDisplaySize(width, height);
    bg.setDepth(-10);

    //=== Título Minijuego ===
    this.add.text(centerX, 90, this.nombreMinijuego, {
      fontFamily: 'Filgaia',
      fontSize: '48px',
      color: '#634830ff',
    }).setOrigin(0.5);

    //=== Jeroglífico ===
    if (this.jeroglifico) {
      this.add.text(centerX, 150, 'Jeroglífico que obtendrás', {
        fontFamily: 'Filgaia',
        fontSize: '26px',
        color: '#ffd98d',
      }).setOrigin(0.5);

      this.add.image(centerX, 230, this.jeroglifico.simbolo)
        .setScale(0.4);

      if (jeroOwned) {
        this.add.text(centerX, 300, this.jeroglifico.letra + ' (Ya lo tienes)', {
          fontFamily: 'Filgaia',
          fontSize: '18px',
          color: '#ffffffd7',
        }).setOrigin(0.5);
      }
      else {
        this.add.text(centerX, 300, this.jeroglifico.letra, {
          fontFamily: 'Filgaia',
          fontSize: '18px',
          color: '#ffffff',
        }).setOrigin(0.5);
      }
    }

    //=== Dificultad ===
    this.add.text(centerX, 360, `Dificultad: ${this.dificultad}`, {
      fontFamily: 'Filgaia',
      fontSize: '24px',
      color: '#ffffff',
    }).setOrigin(0.5);

    //=== Controles ===
    this.add.text(centerX, 400, 'Controles:', {
      fontFamily: 'Filgaia',
      fontSize: '24px',
      color: '#ffd98d',
    }).setOrigin(0.5);

    const controlesTexto = this.controles.join('\n');
    this.add.text(centerX, 450, controlesTexto, { // ajustado Y para que quede debajo del título
      fontFamily: 'Filgaia',
      fontSize: '20px',
      color: '#ffffff',
      align: 'center',
      lineSpacing: 8,
      wordWrap: { width: 600 }
    }).setOrigin(0.5);

    //=== Botón JUGAR ===
    this.createOptButton(
      'JUGAR', 
      centerX + (centerX / 2), 
      height - 70, 
      () => {
        this.scene.stop('PreMinigameScene'); // Cerrar este menú
        this.scene.stop('MapScene');         // Cerrar el mapa
        this.scene.start(this.minijuego, {   // Iniciar el minijuego
          dificultad: this.dificultad,
          jeroglificoId: this.jeroglificoId
        });
      }
    );

    //=== Botón VOLVER ===
    this.createOptButton(
      'VOLVER', 
        centerX - (centerX / 2), 
        height - 70, 
        () => {
        this.scene.stop('PreMinigameScene'); // Cerrar este menú
        this.scene.stop('MapScene');         // Cerrar el mapa
        this.scene.start('MapScene');
      }
    );
  }

  /**
   * Crea un botón de opción genérico para esta escena.
   *
   * @param {string} texto - Texto a mostrar en el botón.
   * @param {number} x - Posición X del botón.
   * @param {number} y - Posición Y del botón.
   * @param {Function} callback - Función a ejecutar al pulsar el botón.
   * @returns {Phaser.GameObjects.Image} La imagen del botón creada.
   */
  createOptButton(texto, x, y, callback) {

    const btn = this.add.image(x, y, "fondoBoton")
      .setInteractive({ useHandCursor: true });

    this.add.text(btn.x, btn.y, texto, {
      fontFamily: "Filgaia",
      fontSize: "20px",
      color: '#382f23ff'
    }).setOrigin(0.5);

    btn.once("pointerdown", callback);
    return btn;
  }

  /**
   * Limpia los recursos y listeners asociados a la escena.
   * Delegado en MenuBase para el comportamiento común de menús.
   * @override
   */
  shutdown() {
    super.shutdown(); 
  }
}
