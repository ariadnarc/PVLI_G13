export default class InputManager extends Phaser.Events.EventEmitter {

static instance = null;

  constructor(scene) {
    
    super();
        if (InputManager.instance) {
            return InputManager.instance;
        }

    this.scene = scene;
    this.cursors = null;
    this.keys = {};
    this.enabled = true;   // puedes activar/desactivar inputs

    InputManager.instance = this;
  }

  static getInstance(scene) {
        if (!InputManager.instance) {
            InputManager.instance = new InputManager(scene);
        }
        return InputManager.instance;
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

  // devuelve un vector de movimiento, usado por PlayerManager
  getMovementVector() {
    if (!this.enabled || !this.cursors) return { x: 0, y: 0 };

    let x = 0, y = 0;

    if (this.cursors.left.isDown) x = -1;
    else if (this.cursors.right.isDown) x = 1;

    if (this.cursors.up.isDown) y = -1;
    else if (this.cursors.down.isDown) y = 1;

    return { x, y };
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

    // emite movimiento si hay cursores
    if (this.cursors) {
      const dir = this.getMovementVector();
      this.emit("move", dir);
    }

    // emite keyDown para teclas individuales
    for (const keyName in this.keys) {
      const keyObj = this.keys[keyName];
      if (Phaser.Input.Keyboard.JustDown(keyObj)) {
        this.emit("keyDown", keyName);
      }
    }
  }
}
