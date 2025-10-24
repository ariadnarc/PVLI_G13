export default class GameScene extends Phaser.Scene {
  constructor() {
    super('minijuegoJuan');
  }


  preload(){

  }

  create() {
    this.cameras.main.setBackgroundColor('#000000ff');
    this.add.text(600, 300, 'me han cerrao el estanco', { 
      fontSize: '32px', 
      color: '#fff' 
    }).setOrigin(0.5);
  }

  update(){

  }
}