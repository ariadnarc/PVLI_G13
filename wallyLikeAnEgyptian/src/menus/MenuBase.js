/**
 * @file MenuBase.js
 * @class MenuBase
 * @extends Phaser.Scene
 * @description
 * Clase base para todos los menús del juego.
 * Proporciona gestión común de input, comportamiento por defecto del botón ESC,
 * creación de botones reutilizables y limpieza automática de recursos.
 * Todas las escenas de menú deben extender de esta clase.
 */

import InputManager from '../core/InputManager.js';

/**
 * Clase base para menús.
 * Extiende Phaser.Scene.
 */
export default class MenuBase extends Phaser.Scene {

  /**
   * @param {string} key - Key de la escena del menú.
   */
  constructor(key) {
    super(key);

    /** @type {Array<Phaser.GameObjects.GameObject>} */
    this.menuElements = [];

    /** @type {Object} */
    this.menuConfig = {};
  }

  /**
   * Inicializa la configuración del menú.
   * @param {Object} data - Configuración del menú (ej: escena padre).
   */
  init(data) {
    this.menuConfig = data || {};
  }

  /**
   * Crea el InputManager y configura el comportamiento común del menú.
   */
  create() {
    // Crear InputManager
    this.inputManager = new InputManager(this);

    // Todos los menús escuchan ESC por defecto
    this.inputManager.configure({
      keys: ['ESC']
    });

    // Handler genérico para ESC
    this.inputManager.on("keyDown", (key) => {
      if (key === "ESC") {
        this.onEscape();
      }
    });
  }

  /**
   * Método genérico al pulsar ESC.
   * Puede ser sobrescrito por los menús hijos.
   * Por defecto cierra el menú y vuelve a la escena padre.
   */
  onEscape() {
    const parent = this.menuConfig.parentScene;

    if (parent) {
      this.scene.stop();
      this.scene.resume(parent);
    } else { 
      console.warn(`MenuBase: No se ha definido parentScene en ${this.scene.key}`);
      this.scene.stop();
    }
  }

  /**
   * Crea un botón reutilizable para menús.
   * Puede ser un botón con sprite o solo texto.
   *
   * @param {string} label - Texto del botón.
   * @param {number} x - Posición X.
   * @param {number} y - Posición Y.
   * @param {Function} callback - Función a ejecutar al pulsar.
   * @param {Object} [style={}] - Estilos del texto y del botón.
   * @param {string|null} [spriteKey=null] - Sprite de fondo opcional.
   * @returns {Phaser.GameObjects.GameObject} Botón creado.
   */
  createButton(label, x, y, callback, style = {}, spriteKey = null) {
    let container;

    if (spriteKey) {
      // Sprite de fondo
      const bg = this.add.image(0, 0, spriteKey).setOrigin(0.5);

      if (style.width && style.height) {
        bg.setDisplaySize(style.width, style.height);
      }

      // Escala original para hover
      const originalScaleX = bg.scaleX;
      const originalScaleY = bg.scaleY;

      // Texto del botón
      const txt = this.add.text(0, 0, label, {
        fontSize: style.fontSize || '22px',
        fontFamily: 'Filgaia',
        color: style.color || '#634830ff',
        align: 'center',
        ...style
      }).setOrigin(0.5);

      // Container
      container = this.add.container(x, y, [bg, txt]);

      // Interactividad
      bg.setInteractive({ useHandCursor: true });
      bg.on('pointerdown', callback);

      // Hover animado
      bg.on('pointerover', () => {
        this.tweens.add({
          targets: bg,
          scaleX: originalScaleX * 1.05,
          scaleY: originalScaleY * 1.05,
          duration: 120,
          ease: 'Power2'
        });

        if (!style.hoverTint) {
          bg.setTint(0xAAAAAA);
        }
      });

      bg.on('pointerout', () => {
        this.tweens.add({
          targets: bg,
          scaleX: originalScaleX,
          scaleY: originalScaleY,
          duration: 120,
          ease: 'Power2'
        });

        if (!style.hoverTint) {
          bg.clearTint();
        }
      });

      if (style.hoverTint) {
        bg.on('pointerover', () => bg.setTint(style.hoverTint));
        bg.on('pointerout', () => bg.clearTint());
      }

    } else {
      // Botón solo texto
      const txt = this.add.text(x, y, label, {
        fontSize: style.fontSize || '22px',
        fontFamily: 'Filgaia',
        color: style.color || '#000',
        backgroundColor: style.backgroundColor || '#ddd',
        padding: { x: 12, y: 6 },
        align: 'center',
        ...style,
      }).setOrigin(0.5);

      this.inputManager.registerButton(txt, callback);
      container = txt;
    }

    // Guardar referencia
    this.menuElements.push(container);
    return container;
  }

  /**
   * Limpia todos los elementos del menú y el InputManager.
   */
  shutdown() {
    this.menuElements.forEach(el => el.destroy());
    this.menuElements = [];

    if (this.inputManager) {
        this.inputManager.destroy(); 
        this.inputManager = null;
    }
  }
}
