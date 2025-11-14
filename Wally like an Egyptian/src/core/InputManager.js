/** Singleton para acceso desde cualquier clase que necesita gestión de Input */
export default class InputManager {
  static instance = null;

  static getInstance(scene) {
    if (!InputManager.instance) {
      InputManager.instance = new InputManager(scene);
    } else {
      InputManager.instance.scene = scene;
    }
    return InputManager.instance;
  }

  constructor(scene) {
    this.scene = scene;
    this.mouseEnabled = false;
    this.keyBoardEnabled = false;
    this.registeredButtons = [];
    this.cursors = null;
    this.keys = {};
  }

   /** Habilita el uso de ratón */
  enableMouse() {
    this.mouseEnabled = true;
  }

  /** Deshabilita temporalmente el ratón */
  disableMouse() {
    this.mouseEnabled = false;
  }

  /** Habilita el teclado */
  enableKeyBoard() {
    this.keyBoardEnabled = true;
  }

  /** Deshabilita el teclado */
  disableKeyBoard() {
    this.keyBoardEnabled = false;
  }

  /**
   * Configura las entradas necesarias para la escena actual.
   * @param {Object} config - configuración opcional
   * @example
   * configureInputs({
   *   mouse: true,
   *   keyboard: true,
   *   keys: ['B', 'ESC'],
   *   cursors: true
   * })
   */
  configureInputs(config = {}) {
    const input = this.scene.input.keyboard;

    this.mouseEnabled = !!config.mouse;
    this.keyBoardEnabled = !!config.keyboard;

    // crea cursores si se pide movimiento
    if (config.cursors) {
      this.cursors = input.createCursorKeys();
    } else {
      this.cursors = null;
    }

    // crea teclas personalizadas si se piden
    if (config.keys && Array.isArray(config.keys)) {
      this.keys = input.addKeys(
        config.keys.reduce((acc, key) => {
          acc[key] = Phaser.Input.Keyboard.KeyCodes[key];
          return acc;
        }, {})
      );
    } else {
      this.keys = {};
    }
  }

  /** Registra un botón UI */
  registerButton(button, callback) {
    button.setInteractive();
    button.on('pointerdown', () => {
      if (!this.mouseEnabled) return;
      this.scene.sound?.play('click');
      callback();
    });

    this.registeredButtons.push(button);
  }

  /** Detecta ESC y lanza el menú de pausa */
  handleExit(context) {
    if (this.keys.ESC && Phaser.Input.Keyboard.JustDown(this.keys.ESC)) {
      if (context === 'MapScene') {
        this.scene.scene.launch('PauseMenuGame', this.scene.scene.key);
        this.scene.scene.pause();
      } if (context === 'Minigame') {
        this.scene.scene.launch('PauseMenuMinigame', {
          parentScene: this.scene.scene.key,
        });
        this.scene.scene.pause();
      } if (context === 'Menu') {
        this.scene.pause();
        this.scene.start(this.scene.getParentSceneNode());
      }
    }
  }

  /** Movimiento básico del jugador */
  getMovementVector() {
    if (!this.keyBoardEnabled || !this.cursors) return { x: 0, y: 0 };

    let x = 0, y = 0;
    if (this.cursors.left.isDown) x = -1;
    else if (this.cursors.right.isDown) x = 1;
    if (this.cursors.up.isDown) y = -1;
    else if (this.cursors.down.isDown) y = 1;

    return { x, y };
  }
}
