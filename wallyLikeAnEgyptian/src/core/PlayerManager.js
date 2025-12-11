
export default class PlayerManager {
  constructor(inputManager, scene,data) {

    this.scene = scene;
    this.inputManager = inputManager; // ya configurada
    this.data=data;
    this.sprite = scene.physics.add.sprite(
      this.data.posInicial.x,
      this.data.posInicial.y,
      this.data.spriteName,
      0 //frame inicial
    );

    this.sprite.setScale(this.data.scale); // scale del initialData
    this.speed = data.speed || 200;
    this.sprite.setCollideWorldBounds(false);

    // Ajustar collider
    this.sprite.setSize(25, 32);
    this.sprite.setOffset(20, 12);

    // Estado para evitar repetir animaciones constantemente
    this.currentAnim = null;
    this.lastDirection = 'down';
  }

  update() {

    const dir = this.inputManager.getMovementVector();
    const body = this.sprite.body;

    // Normalizar diagonal
    if (dir.x !== 0 && dir.y !== 0) {
      const length = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
      dir.x /= length;
      dir.y /= length;
    }
    body.setVelocity(dir.x * this.speed, dir.y * this.speed);

    // Si no te mueves, idle
    if (dir.x === 0 && dir.y === 0) {
      this.playIdle();
      return;
    }

    // Movimiento horizontal
    if (Math.abs(dir.x) > Math.abs(dir.y)) {
      if (dir.x > 0) {
        this.lastDirection = 'right';
        this.playAnim('walk-right');
      } else {
        this.lastDirection = 'left';
        this.playAnim('walk-left');
      }
    }
    // Movimiento vertical
    else {
      if (dir.y > 0) {
        this.lastDirection = 'down';
        this.playAnim('walk-down');
      } else {
        this.lastDirection = 'up';
        this.playAnim('walk-up');
      }
    }
  }

  playAnim(key) {
    if (this.currentAnim !== key) {
      this.sprite.anims.play(key, true);
      this.currentAnim = key;
    }
  }

  // NUEVO idle según la última dirección guardada
  playIdle() {
    const idleFrames = {
      up: 7,
      down: 0,
      right: 14,
      left: 21,
    };

    const frame = idleFrames[this.lastDirection] ?? 0;

    this.sprite.setFrame(frame);
    this.currentAnim = null;
  }

  getSprite() {
    return this.sprite;
  }
}
