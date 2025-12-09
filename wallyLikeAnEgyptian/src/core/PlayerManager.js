import { playerInitialData } from '../config/PlayerData.js';

export default class PlayerManager {
  constructor(inputManager, scene, spriteConfig = {}) {

    this.scene = scene;
    this.inputManager = inputManager; // ya configurada

    this.data = {
      ...playerInitialData, // info del jugador
      ...spriteConfig // para pasar por el constructor el name del sprite deseado
    };
    // "..." significa spread operator, sirve para copiar o extender un objeto
    // dentro de otro, como el initalData lo quiero tal y como está y solo
    // quiero cambiar el sprite lo utilizo, creo una config exclusivamente para ello
    
    this.sprite = scene.physics.add.sprite(
      this.data.posInicial.x,
      this.data.posInicial.y, 
      this.data.spriteName
    );

    this.sprite.setScale(this.data.scale); // scale del initialData
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
