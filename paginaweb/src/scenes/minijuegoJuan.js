export default class GameScene extends Phaser.Scene {
  constructor() {
    super('minijuegoJuan');
  }

  create() {

    // fondo
    this.cameras.main.setBackgroundColor('0x000000');

    // centro pantalla
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // jugador
    this.player = this.add.rectangle(600, 300, 50, 50, 0x00000FF);

    // borde de la zona de juego
    this.borde = this.add.rectangle(centerX, centerY + 120, 450, 300);
    this.borde.setStrokeStyle(4, 0xFFFFFF);

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

    // límites
    this.player.x = Phaser.Math.Clamp(this.player.x, 25, 1175);
    this.player.y = Phaser.Math.Clamp(this.player.y, 25, 575);
  }
}
