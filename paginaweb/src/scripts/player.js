export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "player");

    // Añadir el sprite a la escena
    this.sprite=scene.add.rectangle(x,y,15,25,0x3498db);
    scene.physics.add.existing(this.sprite);

    // Configuración del jugador
    this.speed = 200;
    this.cursors = scene.input.keyboard.createCursorKeys();
  }

  update() {
    const body=this.sprite.body;
    body.setVelocity(0);

    if (this.cursors.left.isDown) {
      body.setVelocityX(-this.speed);
      this.flipX = true;
    } else if (this.cursors.right.isDown) {
      body.setVelocityX(this.speed);
      this.flipX = false;
    }

    if (this.cursors.up.isDown) {
      body.setVelocityY(-this.speed);
    } else if (this.cursors.down.isDown) {
      body.setVelocityY(this.speed);
    }
  }
}