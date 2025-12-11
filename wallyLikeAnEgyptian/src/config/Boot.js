import { playerInitialData } from './PlayerData.js';

export default class Boot extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {

    // ASSETS QUE FALTAN: LOCKPICK, CROCOSHOOT, UNDERTALE,
    // SPRITES DIÁLOGO, PROPS MAPA...

    // MINIJUEGOS
    //  Lockpick (PLACEHOLDER)
    this.load.image('lock_fondo', 'wallyLikeAnEgyptian/assets/minijuegos/minijuegoLock/lock_fondo.png');
    this.load.image('lock_ring', 'wallyLikeAnEgyptian/assets/minijuegos/minijuegoLock/lock_ring.png');
    this.load.image('lock_lock', 'wallyLikeAnEgyptian/assets/minijuegos/minijuegoLock/lock_lock.png');
    this.load.image('lock_lockpick', 'wallyLikeAnEgyptian/assets/minijuegos/minijuegoLock/lock_lockpick.png');
    //TODO: UNDERTALE
    //TODO: CROCOSHOOT

    // FONDOS/MENUS
    this.load.image('mainmenuBG', 'wallyLikeAnEgyptian/assets/ui/mainmenuBG.jpg');
    this.load.image('selectdiffBG', 'wallyLikeAnEgyptian/assets/ui/selectdiffBG.jpg');
    this.load.image('paredBG', 'wallyLikeAnEgyptian/assets/ui/paredBG.jpg');
    this.load.image('fondoBoton', 'wallyLikeAnEgyptian/assets/ui/boton.png');
    this.load.image('fondoUndertale', 'wallyLikeAnEgyptian/assets/ui/fondoUndertale.png');


    // === IMÁGENES Y SPRITES ===
    this.load.spritesheet('player', 'wallyLikeAnEgyptian/assets/sprites/playerSpriteSheet.png', {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet('egyptTiles', 'wallyLikeAnEgyptian/assets/sprites/egypt_tomb.png', {
      frameWidth: 32,
      frameHeight: 32
    }); //esto es para coger sprites de pixel art egipcio

    this.load.image('papiroBar', 'wallyLikeAnEgyptian/assets/sprites/papyrusBar.jpg'); //barra de papiro para el slideBar


    /*this.load.image('gold_particle', 'assets/particles/gold.png');
    this.load.image('sand_particle', 'assets/particles/sand.png');*/

    // MAPA
    this.load.image('tilesImg', 'wallyLikeAnEgyptian/assets/mapa/tileSetProp.png');
    this.load.tilemapTiledJSON('mapa', 'wallyLikeAnEgyptian/assets/mapa/mapaTiled.json');


    // ICONOS JEROGLÍFICOS
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
