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
      this.data.spriteName,
      0 //frame inicial
    );

    this.sprite.setScale(this.data.scale); // scale del initialData
    this.speed = this.data.speed || 200;

    // Ajustar collider
    this.sprite.setSize(25, 32);
    this.sprite.setOffset(20, 12);

    // Estado para evitar repetir animaciones constantemente
    this.currentAnim = null;
  }

  update() {

    const dir = this.inputManager.getMovementVector();
    const body = this.sprite.body;

    body.setVelocity(dir.x * this.speed, dir.y * this.speed);

    // Si no te mueves → animación idle
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
