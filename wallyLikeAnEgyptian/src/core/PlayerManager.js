import { playerInitialData } from '../config/PlayerData.js';

export default class PlayerManager {
  constructor(inputManager, scene, spriteConfig = {}) {

    this.scene = scene;
    this.inputManager = inputManager; // ya configurada

    this.data = playerInitialData; // usa la info inicial

    this.sprite = scene.physics.add.sprite(
      this.data.posInicial.x,
      this.data.posInicial.y,
      this.data.spriteName,
      0 //frame inicial
    );

    this.sprite.setScale(this.data.scale); // scale del initialData
    this.speed = this.data.speed || 200;
    this.sprite.setCollideWorldBounds(false);

    // Ajustar collider
    this.sprite.setSize(25, 32);
    this.sprite.setOffset(20, 12);

    // Estado para evitar repetir animaciones constantemente
    this.currentAnim = null;
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
      if (dir.x > 0) this.playAnim('walk-right');
      else this.playAnim('walk-left');
    }
    // Movimiento vertical
    else {
      if (dir.y > 0) this.playAnim('walk-down');
      else this.playAnim('walk-up');
    }
  }

  playAnim(key) {
    if (this.currentAnim !== key) {
      this.sprite.anims.play(key, true);
      this.currentAnim = key;
    }
  }

  playIdle() {
    const idleMap = {
      'walk-down': 0,
      'walk-up': 7,
      'walk-right': 14,
      'walk-left': 21,
    };

    // Si no hay animación previa, idle hacia abajo
    const idleFrame = idleMap[this.currentAnim] ?? 0;

    this.sprite.setFrame(idleFrame);
    this.currentAnim = null;
  }

  getSprite() {
    return this.sprite;
  }
}
