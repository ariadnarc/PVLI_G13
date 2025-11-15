import { playerInitialData } from '../config/PlayerData.js';
import InputManager from './InputManager.js';

export default class PlayerManager {
  constructor(scene) {
    this.scene = scene;
    this.data = playerInitialData; // usa la info inicial
    
    this.sprite = scene.physics.add.sprite(this.data.posInicial.x, this.data.posInicial.y, 
      this.data.spriteName);

    this.speed = this.data.speed || 0;

    // instancia de InputManager para movimiento Player
    this.inputManager = InputManager.getInstance(scene);
  }

  update() {
    const dir = this.inputManager.getMovementVector();
    const body = this.sprite.body;

    body.setVelocity(0);

    if (dir.x !== 0 || dir.y !== 0) {
      body.setVelocity(dir.x * this.speed, dir.y * this.speed);
      body.velocity.normalize().scale(this.speed);
    }
  }

  getSprite() {
    return this.sprite;
  }
}
