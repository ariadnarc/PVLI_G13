/**
 * @file SalaSecreta.js
 * @class SalaSecreta
 * @extends MenuBase
 * @description
 * Menú previo de la Sala Secreta.
 * Explica el riesgo/recompensa (ganar o perder jeroglíficos)
 * y permite iniciar el minijuego especial o volver al mapa.
 */

import MenuBase from '../menus/MenuBase.js';
import { JEROGLIFICOS_DATA } from '../config/JeroglificosData.js';
import { NOMBRES_MINIJUEGOS } from '../config/MinigameData.js';
import { addJeroglifico, hasJeroglifico } from '../config/PlayerData.js';

/**
 * Escena de menú para la Sala Secreta.
 * Extiende MenuBase y actúa como overlay de confirmación antes del minijuego secreto.
 */
export default class SalaSecreta extends MenuBase{

  /**
   * Crea la escena SalaSecreta.
   */
  constructor() {
    super('SalaSecreta');

    /**
     * Clave del minijuego que se va a jugar en la sala secreta.
     * @type {string|undefined}
     */
    this.minijuego = undefined;

    /**
     * Dificultad con la que se jugará el minijuego.
     * @type {string|undefined}
     */
    this.dificultad = undefined;

    /**
     * Lista de descripciones de controles que se mostrarán al jugador.
     * @type {string[]}
     */
    this.controles = [];

    /**
     * Clave de la escena padre desde la que se abre esta sala (normalmente 'MapScene').
     * @type {string|undefined}
     */
    this.parentScene = undefined;

    /**
     * Flag que indica que el minijuego se juega en modo Sala Secreta.
     * Se pasa al minijuego para aplicar reglas especiales de jeroglíficos.
     * @type {boolean}
     */
    this.secreta = true;
  }

  /**
   * Inicializa la escena con los datos del minijuego secreto.
   *
   * @param {Object} data - Datos pasados desde la escena que abre la sala.
   * @param {string} data.minijuego - Clave del minijuego que se jugará.
   * @param {string} data.dificultad - Dificultad seleccionada.
   * @param {string[]} [data.controles=[]] - Lista de textos con los controles.
   * @param {string} data.parentScene - Escena padre (por ejemplo, 'MapScene').
   */
  init(data) {

    this.minijuego = data.minijuego ;
    this.dificultad = data.dificultad;
    this.controles = data.controles || [];
    this.parentScene =data.parentScene;
    this.secreta=true;
  }

  /**
   * Crea la interfaz de la Sala Secreta:
   * fondo, explicación de reglas, info de minijuego y controles,
   * y botones de JUGAR / VOLVER.
   * @override
   */
  create() {
    super.create();

    const centerX = this.cameras.main.centerX;
    const { width, height } = this.sys.game.config;

    //=== Fondo ===
    const bg = this.add.image(width / 2, height / 2, 'selectdiffBG');
    bg.setDisplaySize(width, height);
    bg.setDepth(-10);

    //=== Título ===
    this.add.text(centerX, 90, 'Sala Secreta', {
      fontFamily: 'Filgaia',
      fontSize: '48px',
      color: '#634830ff',
    }).setOrigin(0.5);

    //=== Explicación riesgo/recompensa ===
     this.add.text(centerX, 170, '  Si GANAS-> ganas 3 jeroglificos \nSi PIERDES-> pierdes 5 jeroglificos', {
        fontFamily: 'Filgaia',
        fontSize: '30px',
        color: '#ffd98d',
      }).setOrigin(0.5);

    //=== Minijuego ===
    this.add.text(centerX, 280, `Minijuego: ${this.minijuego}`, {
        fontFamily: 'Filgaia',
      fontSize: '30px',
      color: '#ffffff',
    }).setOrigin(0.5);

    //=== Dificultad ===
    this.add.text(centerX, 320, `Dificultad: ${this.dificultad}`, {
      fontFamily: 'Filgaia',
      fontSize: '24px',
      color: '#ffffff',
    }).setOrigin(0.5);

    //=== Controles ===
    this.add.text(centerX, 400, 'Controles:', {
      fontFamily: 'Filgaia',
      fontSize: '20px',
      color: '#ffd98d',
    }).setOrigin(0.5);

    const controlesTexto = this.controles.join('\n');
    this.add.text(centerX, 450, controlesTexto, { 
      fontFamily: 'Filgaia',
      fontSize: '18px',
      color: '#ffffff',
      align: 'center',
      lineSpacing: 8,
      wordWrap: { width: 600 }
    }).setOrigin(0.5);

    //=== Botón JUGAR ===
    this.createOptButton('JUGAR', centerX + (centerX / 2), height - 70, () => {
      this.scene.stop('SalaSecreta'); 
      this.scene.stop('MapScene'); 
      this.scene.start(this.minijuego, { 
        dificultad: this.dificultad,
        secreta:this.secreta
      });
    });

    //=== Botón VOLVER ===
    this.createOptButton('VOLVER', centerX - (centerX / 2), height - 70, () => {
      this.scene.stop('SalaSecreta'); 
      this.scene.stop('MapScene'); 
      this.scene.start('MapScene');
    });
  }

  /**
   * Crea un botón de opción reutilizable para esta escena.
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