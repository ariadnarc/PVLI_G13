/** Singleton para acceso desde cualquier clase que necesita gestion de Input */
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
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keys = scene.input.keyboard.addKeys({
      B: Phaser.Input.Keyboard.KeyCodes.B,
      ESC: Phaser.Input.Keyboard.KeyCodes.ESC,
    });
    this.mouseEnabled = false;
    this.registeredButtons = [];
  }

  /** Registra un botón UI para que use eventos */
  registerButton(button, callback) {
    button.setInteractive();

    button.on('pointerover', () => button.setStyle({ backgroundColor: '#bbb' }));
    button.on('pointerout', () => button.setStyle({ backgroundColor: '#ddd' }));

    button.on('pointerdown', () => {
      if (!this.mouseEnabled) return;
      this.scene.sound.play('click');
      callback();
    });

    this.registeredButtons.push(button);
  }

  /** Habilita el uso de ratón en la escena */
  enableMouse() {
    this.mouseEnabled = true;
  }

  /** Deshabilita temporalmente el ratón */
  disableMouse() {
    this.mouseEnabled = false;
  }

  /** Detecta si se pulsa ESC y lanza el menú correspondiente */
  handlePause(context) {
    if (Phaser.Input.Keyboard.JustDown(this.keys.ESC)) {
      if (context === 'game') {
        this.scene.scene.launch('PauseMenuGame');
        this.scene.scene.pause();
      } else if (context === 'minigame') {
        this.scene.scene.launch('PauseMenuMinigame', {
          minigameScene: this.scene.scene.key,
        });
        this.scene.scene.pause();
      }
    }
  }

  /** Movimiento básico del jugador */
  getMovementVector() {
    let x = 0, y = 0;
    if (this.cursors.left.isDown) x = -1;
    else if (this.cursors.right.isDown) x = 1;

    if (this.cursors.up.isDown) y = -1;
    else if (this.cursors.down.isDown) y = 1;

    return { x, y };
  }
}
