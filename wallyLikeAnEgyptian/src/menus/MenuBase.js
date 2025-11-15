import InputManager from '../core/InputManager.js';

/**
 * Clase base para todos los menús del juego (pantallas completas o overlays)
 * Define la estructura, pero no el estilo visual.
 */
export default class MenuBase extends Phaser.Scene {
  constructor(key, data) {
    super(key);
    this.menuElements = [];

    this.menuConfig = data || {}; // datos opcionales (overlay, parentScene, etc.)
  }

  create() {
    // Asocia el InputManager
    // Cada clase define los inputs que permite (teclado, cursores, raton, etc)
    this.inputManager = InputManager.getInstance(this);
    this.inputManager.configure({ cursors: true });
  }

  getParentscene() {
    return this.menuConfig.parentSceneNode || null;
  }

  /**
   * Crea un botón genérico y lo registra en InputManager
   */
  createButton(label, x, y, callback, style = {}) {
    const btn = this.add.text(x, y, label, {
      fontSize: '22px',
      color: style.color || '#000',
      backgroundColor: style.backgroundColor || '#ddd',
      padding: { x: 12, y: 6 },
      align: 'center',
      ...style,
    })
      .setOrigin(0.5);

    // Registrar evento en InputManager, no directamente aquí
    this.inputManager.registerButton(btn, callback);

    this.menuElements.push(btn);
    return btn;
  }

  /**
   * Activar control del ratón (a través de InputManager)
   */
  enableMenuInput() {
    this.inputManager.enableMouse();
  }

  /**
   * Desactiva todos los inputs de menú
   */
  disableMenuInput() {
    this.inputManager.disableMouse();
  }

  /**
   * Limpieza
   */
  shutdown() {
    this.disableMenuInput();
    this.menuElements.forEach(el => el.destroy());
    this.menuElements = [];
  }
}
