export default class GameScene extends Phaser.Scene {
  constructor() {
    super('minijuegoJuan');
  }

  preload(){
    //this.load.image('playerj', './assets/sprites/playerj.png')
  }

  create() {

    // fondo
    this.cameras.main.setBackgroundColor(0x000000);

    // centro pantalla
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // borde de la zona de juego (antes del player ya que las pos del player se basa en este rect)
    this.borde = this.add.rectangle(centerX, centerY + 120, 450, 300);
    this.borde.setStrokeStyle(4, 0xFFFFFF);
    // this.physics.add(this.borde, true);

    // jugador
    this.player = this.add.rectangle(this.borde.x, this.borde.y, 50, 50, 0x0000FF);
    this.player.setDisplaySize (500,500);

    // collider jugador-borde
    this.physics.add.collider(this.player, this.borde);

    // teclas
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  }

  update() {
    const speed = 200; // píxeles por segundo
    this.player.body.setVelocity(0);

    if (this.aKey.isDown) { this.player.body.setVelocityX(-speed); }
    if (this.dKey.isDown) { this.player.body.setVelocityX(speed); }
    if (this.wKey.isDown) { this.player.body.setVelocityY(-speed); }
    if (this.sKey.isDown) { this.player.body.setVelocityY(speed); }
  }
}

// ctrl k -> ctrl f para organizar código