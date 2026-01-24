/**
 * @file MovingObject.js
 * @description
 * Clase que representa un objeto movible.
 * Estos objetos pueden ser empujados por el jugador y colisionan con paredes y otros colliders.
 * Gestiona físicas básicas, velocidad máxima y empuje por parte del jugador.
 *
 * El objeto se crea como un sprite con cuerpo físico y se añade a los colliders proporcionados.
 */

/**
 * Datos iniciales de un MovingObject.
 * @typedef {Object} MovingObjectData
 * @property {{x: number, y: number}} posInicial - Posición inicial del objeto.
 */

/**
 * Clase para objetos movibles.
 */
export default class MovingObject {
  /**
   * Crea un objeto movible con físicas.
   * @param {Phaser.Scene} scene - Escena de Phaser donde se añade el objeto.
   * @param {Phaser.Physics.Arcade.Sprite} player - Sprite del jugador para detectar empujes.
   * @param {Phaser.GameObjects.Group|Phaser.Tilemaps.TilemapLayer} colisiones - Obstáculos y paredes.
   * @param {MovingObjectData} data - Datos iniciales del objeto.
   */
  constructor(scene, player, colisiones, data) {
    this.scene = scene;

    /** @type {Phaser.Physics.Arcade.Sprite} */
    this.sprite = scene.physics.add.sprite(data.posInicial.x, data.posInicial.y, 'caja');
    this.sprite.setScale(2);

    /** @type {number} Multiplicador de empuje al jugador */
    this.speed = 25;

    /** @type {Phaser.GameObjects.Group|Phaser.Tilemaps.TilemapLayer} */
    this.colisiones = colisiones;

    /** @type {Phaser.Physics.Arcade.Sprite} */
    this.player = player;

    this.sprite.body.slideFactor.set(1, 1);
    this.sprite.setDrag(1500, 1500);
    this.sprite.setMaxVelocity(60, 60);
    this.sprite.body.setImmovable(false);
    this.sprite.body.pushable = true;

    // Guardar referencias a los colliders
    /** @type {Phaser.Physics.Arcade.Collider} */
    this.colliderPlayer = scene.physics.add.collider(player.sprite, this.sprite);

    /** @type {Phaser.Physics.Arcade.Collider} */
    this.colliderPared = scene.physics.add.collider(colisiones, this.sprite);
  }

  /**
   * Actualiza el estado del objeto.
   * Llama a este método en el update de la escena.
   * Gestiona colisiones, empuje por jugador y velocidad máxima.
   */
  update() {
    if (!this.sprite || !this.sprite.body) return;

    // Verifica colisión actual
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
        // Empuje por el jugador
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