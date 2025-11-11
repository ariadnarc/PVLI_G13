import InputManager from '../core/InputManager.js';

/**
 * Clase base para todos los menús del juego (pantallas completas o overlays)
 * Define la estructura, pero no el estilo visual.
 */
export default class MenuBase extends Phaser.Scene {
  constructor(key) {
    super(key);
    this.inputManager = null;
    this.menuElements = [];
  }

  init(data) {
    this.menuConfig = data || {}; // datos opcionales (overlay, parentScene, etc.)
  }

  create() {
    // Asocia el InputManager
    this.inputManager = InputManager.getInstance(this);

    // Inicialización base de menú (sin diseño específico)
    this.initMenu();

    // Activar manejo de input
    this.enableMenuInput();
  }

  /**
   * Método que debe redefinirse en las subclases
   * para definir el layout, botones, textos, etc.
   */
  initMenu() {}

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
