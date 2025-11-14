import { playerInitialData } from './PlayerData.js';

export default class Boot extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {

    //TODO: Cambiar por los assets del juego (ESTO ES UN PLACEHOLDER CON ELEMENTOS INVENTADOSp)

    // === IMÁGENES Y SPRITES ===
    //this.load.image(playerInitialData.spriteName, 'assets/player.png');
    /*this.load.image('gold_particle', 'assets/particles/gold.png');
    this.load.image('sand_particle', 'assets/particles/sand.png');*/

    //Carga los tiles del mapa (pared)
    this.load.image('pared_1', 'Wally like an Egyptian/assets/mapa/tiles/pared_1.png');
    this.load.image('pared_2', 'Wally like an Egyptian/assets/mapa/tiles/pared_2.png');
    this.load.image('pared_3', 'Wally like an Egyptian/assets/mapa/tiles/pared_3.png');
    this.load.image('pared_4', 'Wally like an Egyptian/assets/mapa/tiles/pared_4.png');
    this.load.image('pared_5', 'Wally like an Egyptian/assets/mapa/tiles/pared_5.png');
    this.load.image('pared_6', 'Wally like an Egyptian/assets/mapa/tiles/pared_6.png');
    this.load.image('pared_7', 'Wally like an Egyptian/assets/mapa/tiles/pared_7.png');
    this.load.image('pared_8', 'Wally like an Egyptian/assets/mapa/tiles/pared_8.png');
    this.load.image('pared_9', 'Wally like an Egyptian/assets/mapa/tiles/pared_9.png');

    //suelo
    this.load.image('suelo_22', 'Wally like an Egyptian/assets/mapa/tiles/suelo_22.png');

    //techo
    this.load.image('techo_43', 'Wally like an Egyptian/assets/mapa/tiles/techo_43.png');

    // === ICONOS JEROGLÍFICOS ===
    for (let i = 1; i <= 9; i++) {
    this.load.image(`jero${i}`, `Wally like an Egyptian/assets/minijuegos/luces/jero${i}.png`);
    }

    // === SONIDOS ===
    this.load.audio('victory', 'Wally like an Egyptian/assets/sounds/victory.wav');
    this.load.audio('defeat', 'Wally like an Egyptian/assets/sounds/defeat.wav');
    this.load.audio('click', 'Wally like an Egyptian/assets/sounds/click.wav');
    this.load.audio('locked', 'Wally like an Egyptian/assets/sounds/locked.wav');
    this.load.audio('unlocked', 'Wally like an Egyptian/assets/sounds/unlocked.wav');
    this.load.audio('start', 'Wally like an Egyptian/assets/sounds/start.wav');
    //this.load.audio('sandstorm', 'assets/sounds/sandstorm.mp3');

    // === OTROS ===
    /*this.load.image('background_pyramid', 'assets/backgrounds/pyramid.png');*/
  }

  create() {
    // Opcional: reproducir sonido de inicio o mostrar logo
    this.scene.start('MainMenu'); // escena principal de título o menú
  }
}
