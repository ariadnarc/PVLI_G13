

export default class MovingObject {
  constructor(scene, player, colisiones, data) {
    this.scene = scene;

    this.sprite = scene.physics.add.sprite(data.posInicial.x, data.posInicial.y, 'caja');
    this.sprite.setScale(2);

    this.speed = 25;
    this.colisiones = colisiones;
    this.player = player;

    this.sprite.body.slideFactor.set(1, 1);
    this.sprite.setDrag(1500, 1500);
    this.sprite.setMaxVelocity(60, 60);

    this.sprite.body.setImmovable(false);
    this.sprite.body.pushable = true;

    // Guardar referencias a los colliders
    this.colliderPlayer = scene.physics.add.collider(player.sprite, this.sprite);
    this.colliderPared = scene.physics.add.collider(colisiones, this.sprite);
  }

  update() {
    // Verificar si ACTUALMENTE está colisionando (Phaser mantiene esta info)
    const touchingPlayer = this.sprite.body.touching.none === false;
    const touchingWall = this.sprite.body.blocked.none === false || this.sprite.body.immovable;

    if (touchingWall) {
      // Contra pared: inmóvil
      this.sprite.body.setImmovable(true);
      this.sprite.setVelocity(0, 0);
    } else {
      // No contra pared: puede moverse
      this.sprite.body.setImmovable(false);

      if (touchingPlayer) {
        // El jugador está tocando la caja
        this.sprite.body.velocity.x += this.player.sprite.body.velocity.x * this.speed;
        this.sprite.body.velocity.y += this.player.sprite.body.velocity.y * this.speed;
      }
    }

    // Limitar velocidad máxima
    const mx = this.sprite.body.maxVelocity?.x || 50;
    const my = this.sprite.body.maxVelocity?.y || 50;

    if (Math.abs(this.sprite.body.velocity.x) > mx) {
      this.sprite.body.velocity.x = mx * Math.sign(this.sprite.body.velocity.x);
    }
    if (Math.abs(this.sprite.body.velocity.y) > my) {
      this.sprite.body.velocity.y = my * Math.sign(this.sprite.body.velocity.y);
    }
  }
}