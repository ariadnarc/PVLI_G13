export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {

    // fondo
    this.cameras.main.setBackgroundColor('0xB310FF');

    // jugador
    this.player = this.add.rectangle(600, 300, 50, 50, 0x00000FF);

    // el portalillo con el que estamos yendo al minijuego
    this.portal = this.add.rectangle(1000, 300, 60, 60, 0x00FF00);

    // teclas
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  }

  update() {
    const speed = 8;

    if (this.cursors.left.isDown || this.aKey.isDown) {
      this.player.x -= speed;
    } else if (this.cursors.right.isDown || this.dKey.isDown) {
      this.player.x += speed;
    }

    if (this.cursors.up.isDown || this.wKey.isDown) {
      this.player.y -= speed;
    } else if (this.cursors.down.isDown || this.sKey.isDown) {
      this.player.y += speed;
    }

    // colisiónUpdate
    if (this.checkCollision(this.player, this.portal)) {
      this.scene.start('minijuegoJuan'); // AQUÍ PONED VUESTRA ESCENA
    }

    // límites
    this.player.x = Phaser.Math.Clamp(this.player.x, 25, 1175);
    this.player.y = Phaser.Math.Clamp(this.player.y, 25, 575);
  }

  // función colisión
  checkCollision(rect1, rect2) {
    return Phaser.Geom.Intersects.RectangleToRectangle(
      rect1.getBounds(),
      rect2.getBounds()
    );
  }
}
