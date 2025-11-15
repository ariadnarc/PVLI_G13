import Phaser from "../lib/phaser.js";

export default class InputManager extends Phaser.Events.EventEmitter {

  constructor(scene) {
    super();

    this.scene = scene;
    this.cursors = null;
    this.keys = {};
    this.enabled = true;   // puedes activar/desactivar inputs
  }

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

  // registra un boton para poder ejecutar callbacks
  registerButton(button, callback) {
    button.setInteractive();

    button.on("pointerdown", () => {
        if (!this.enabled) return;
        this.emit("buttonPressed", button);
        callback();
    });
}

  // gestión de inputs
  update() {
    if (!this.enabled) return;

    // 1) Movimiento
    if (this.cursors) {
      let x = 0, y = 0;

      if (this.cursors.left.isDown) x = -1;
      else if (this.cursors.right.isDown) x = 1;

      if (this.cursors.up.isDown) y = -1;
      else if (this.cursors.down.isDown) y = 1;

      this.emit("move", { x, y });
    }

    // 2) Teclas individuales definidas en la escena / menu donde se usen
    for (const keyName in this.keys) {
      const keyObj = this.keys[keyName];
      if (Phaser.Input.Keyboard.JustDown(keyObj)) {
        this.emit("keyDown", keyName);
      }
    }
  }
}
