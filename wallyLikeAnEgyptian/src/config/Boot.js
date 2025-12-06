import { playerInitialData } from './PlayerData.js';

export default class Boot extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {

    //TODO: Cambiar por los assets del juego (ESTO ES UN PLACEHOLDER CON ELEMENTOS INVENTADOS)

    //=====FONDOS/MENUS=======
    this.load.image('mainmenuBG', 'wallyLikeAnEgyptian/assets/ui/mainmenuBG.jpg');
    this.load.image('selectdiffBG', 'wallyLikeAnEgyptian/assets/ui/selectdiffBG.jpg');
    


    // === IMÁGENES Y SPRITES ===
    this.load.image('playerSprite', 'wallyLikeAnEgyptian/assets/sprites/playerMapa.png'); // sprite para el juego
    this.load.image('playerUndertale', 'wallyLikeAnEgyptian/assets/sprites/playerUndertale.png'); // sprite para el mjUndertale
    /*this.load.image('gold_particle', 'assets/particles/gold.png');
    this.load.image('sand_particle', 'assets/particles/sand.png');*/

    //Carga los tiles del mapa (pared)
    this.load.image('pared_1', 'wallyLikeAnEgyptian/assets/mapa/tiles/pared_1.png');
    this.load.image('pared_2', 'wallyLikeAnEgyptian/assets/mapa/tiles/pared_2.png');
    this.load.image('pared_3', 'wallyLikeAnEgyptian/assets/mapa/tiles/pared_3.png');
    this.load.image('pared_4', 'wallyLikeAnEgyptian/assets/mapa/tiles/pared_4.png');
    this.load.image('pared_5', 'wallyLikeAnEgyptian/assets/mapa/tiles/pared_5.png');
    this.load.image('pared_6', 'wallyLikeAnEgyptian/assets/mapa/tiles/pared_6.png');
    this.load.image('pared_7', 'wallyLikeAnEgyptian/assets/mapa/tiles/pared_7.png');
    this.load.image('pared_8', 'wallyLikeAnEgyptian/assets/mapa/tiles/pared_8.png');
    this.load.image('pared_9', 'wallyLikeAnEgyptian/assets/mapa/tiles/pared_9.png');

    //suelo
    this.load.image('suelo_22', 'wallyLikeAnEgyptian/assets/mapa/tiles/suelo_22.png');

    //techo
    this.load.image('techo_43', 'wallyLikeAnEgyptian/assets/mapa/tiles/techo_43.png');

    // === ICONOS JEROGLÍFICOS ===
    for (let i = 1; i <= 9; i++) {
    this.load.image(`jero${i}`, `wallyLikeAnEgyptian/assets/minijuegos/luces/jero${i}.png`);
    }

    // TODO: Meter img para los tiers (letras con un estilo chulo mismo)
    // === TIERS JEROGLIFICOS ===
    this.load.image("tier_S", "wallyLikeAnEgyptian/assets/ui/ankh.png");
    this.load.image("tier_A", "wallyLikeAnEgyptian/assets/ui/ba.jpg");
    this.load.image("tier_B", "wallyLikeAnEgyptian/assets/ui/uraeus.png");

    // Escena Victoria
    this.load.image("gold_particle", "wallyLikeAnEgyptian/assets/minijuegos/particles.jpg");

    // === SONIDOS ===
    this.load.audio('victory', 'wallyLikeAnEgyptian/assets/sounds/victory.wav');
    this.load.audio('defeat', 'wallyLikeAnEgyptian/assets/sounds/defeat.wav');
    this.load.audio('click', 'wallyLikeAnEgyptian/assets/sounds/click.wav');
    this.load.audio('locked', 'wallyLikeAnEgyptian/assets/sounds/locked.wav');
    this.load.audio('unlocked', 'wallyLikeAnEgyptian/assets/sounds/unlocked.wav');
    this.load.audio('start', 'wallyLikeAnEgyptian/assets/sounds/start.wav');
    this.load.audio('minigame_music', 'wallyLikeAnEgyptian/assets/sounds/minigame_sound.mp3');
    //Objetos movibles
    this.load.image('cofre', 'wallyLikeAnEgyptian/assets/sprites/cofre.png');
    //this.load.audio('sandstorm', 'assets/sounds/sandstorm.mp3');
  }

  create() {
    // Opcional: reproducir sonido de inicio o mostrar logo
    this.scene.start('MainMenu'); // escena principal de título o menú
  }
}
