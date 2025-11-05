import Barrita from '../objetos/objetosBarrita/Barrita.js'

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('minijuegoAri');
  }

  
  preload(){

  }

  create() {
    this.cameras.main.setBackgroundColor('#184f44ff')
    
    this.startGame();


  }

  startGame(){
    const barrita = new Barrita(scene, this.x, this.y);
    scene.add.existing(barrita);
  }

  update(){

  }
}