import InputManager from '../core/InputManager.js';

export default class MenuBase extends Phaser.Scene {

  constructor(key) {
    super(key);
    this.menuElements = [];
    this.menuConfig = {};
  }

  init(data){
    this.menuConfig = data || {};
  }

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
   * Los menús individuales pueden sobrescribirlo.
   */
  onEscape() {
    // Comportamiento por defecto: cerrar menú y volver a la escena padre
    const parent = this.menuConfig.parentScene;

    if (parent) {
      this.scene.stop();
      this.scene.resume(parent);
    } else { // detecta errores con la escena padre
      console.warn(`MenuBase: No se ha definido parentScene en ${this.scene.key}`);
      this.scene.stop();
    }
  }

  /**
   * Crear botón genérico
   */
  createButton(label, x, y, callback, style = {}) {
    const btn = this.add.text(x, y, label, {
      fontSize: '22px',
      color: style.color || '#000',
      backgroundColor: style.backgroundColor || '#ddd',
      padding: { x: 12, y: 6 },
      align: 'center',
      ...style,
    }).setOrigin(0.5);

    this.inputManager.registerButton(btn, callback);

    this.menuElements.push(btn);
    return btn;
  }

  /**
   * Cleanup
   */
  shutdown() {
    this.menuElements.forEach(el => el.destroy());
    this.menuElements = [];
  }
}
