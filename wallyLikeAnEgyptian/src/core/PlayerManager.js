import { playerInitialData } from '../config/PlayerData.js';

export default class PlayerManager {
  constructor(inputManager, scene) {

    this.scene = scene;
    this.inputManager = inputManager; // ya configurada
    this.data = playerInitialData; // usa la info inicial
    
    this.sprite = scene.physics.add.sprite(this.data.posInicial.x, this.data.posInicial.y, 
    this.data.spriteName);

      
    // Evita que el jugador salga del mapa
    this.sprite.setCollideWorldBounds(true);
    this.speed = this.data.speed || 200;
  }

  update() {

    const dir = this.inputManager.getMovementVector();
    const body = this.sprite.body;

    body.setVelocity(dir.x * this.speed, dir.y * this.speed);
  }

  getSprite() {
    return this.sprite;
  }
}
