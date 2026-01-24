/**
 * @file InputManager.js
 * @description
 * Clase para gestionar inputs del jugador.
 * Permite movimiento con cursores, detectar teclas individuales y botones interactivos.
 * Se pueden activar/desactivar inputs temporalmente.
 *
 * Eventos emitidos:
 *  - "move": { x, y } → vector de movimiento de cursores.
 *  - "keyDown": keyName → tecla pulsada.
 *  - "buttonPressed": button → botón interactivo pulsado.
 */

/**
 * Configuración opcional para InputManager.
 * @typedef {Object} InputManagerConfig
 * @property {boolean} [cursors=false] - Habilitar cursores.
 * @property {string[]} [keys] - Array de nombres de teclas a habilitar.
 */

/**
 * Clase que gestiona inputs de teclado y botones.
 */
export default class InputManager extends Phaser.Events.EventEmitter {

  /**
   * Crea un InputManager.
   * @param {Phaser.Scene} scene - Escena de Phaser donde se gestionarán los inputs.
   */
  constructor(scene) {
    super();
    this.scene = scene;

    /** @type {Phaser.Types.Input.Keyboard.CursorKeys|null} */
    this.cursors = null;

    /** @type {Object.<string, Phaser.Input.Keyboard.Key>} */
    this.keys = {};

    /** @type {boolean} */
    this.enabled = true;   //Aactivar/desactivar inputs
  }

  /**
   * Configura los cursores y teclas individuales.
   * @param {InputManagerConfig} [config={}]
   */
  configure(config = {}) {
    const input = this.scene.input.keyboard;

    if (config.cursors) {
      this.cursors = input.createCursorKeys();
    }

    if (config.keys && Array.isArray(config.keys)) {
      this.keys = input.addKeys(
        config.keys.reduce((acc, key) => {
          acc[key] = Phaser.Input.Keyboard.KeyCodes[key];
          return acc;
        }, {})
      );
    }
  }

  /**
   * Devuelve un vector de movimiento según los cursores.
   * @returns {{x: number, y: number}}
   */
  getMovementVector() {
    let x = 0, y = 0;

    if (!this.cursors) return { x, y };

    if (this.cursors) {
        if (this.cursors.left.isDown) x = -1;
        else if (this.cursors.right.isDown) x = 1;

        if (this.cursors.up.isDown) y = -1;
        else if (this.cursors.down.isDown) y = 1;
    }

    return { x, y };
  }

  /**
   * Registra un botón interactivo de Phaser y asigna un callback al pulsarlo.
   * @param {Phaser.GameObjects.GameObject} button
   * @param {function} callback
   */
  registerButton(button, callback) {
    button.setInteractive();

    button.on("pointerdown", () => {
        if (!this.enabled) return;
        this.emit("buttonPressed", button);
        callback();
    });
  }

  /**
   * Debe llamarse en el update de la escena.
   * Emite los eventos correspondientes según inputs.
   */s
  update() {
    if (!this.cursors && !this.keys) return;

    if (this.cursors) {
      const dir = this.getMovementVector();
      this.emit("move", dir);
    }

    for (const keyName in this.keys) {
      const keyObj = this.keys[keyName];
      if (Phaser.Input.Keyboard.JustDown(keyObj)) {
        this.emit("keyDown", keyName);
      }
    }
  }
}
