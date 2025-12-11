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
    this.load.image('fondoIntro', 'wallyLikeAnEgyptian/assets/ui/IntroScenebg.png');

    // === IMÁGENES Y SPRITES ===
    this.load.spritesheet('player', 'wallyLikeAnEgyptian/assets/sprites/playerSpriteSheet.png', {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet('egyptTiles', 'wallyLikeAnEgyptian/assets/sprites/egypt_tomb.png', {
      frameWidth: 32,
      frameHeight: 32
    }); //esto es para coger sprites de pixel art egipcio

    this.load.image('cafe', 'wallyLikeAnEgyptian/assets/sprites/cafe.png');
    this.load.image('mariano', 'wallyLikeAnEgyptian/assets/sprites/mariano.png');


    this.load.image('papiroBar', 'wallyLikeAnEgyptian/assets/sprites/papyrusBar.jpg'); //barra de papiro para el slideBar


    /*this.load.image('gold_particle', 'assets/particles/gold.png');
    this.load.image('sand_particle', 'assets/particles/sand.png');*/

    // MAPA
    this.load.image('tilesImg', 'wallyLikeAnEgyptian/assets/mapa/tileSetProp.png');
    this.load.tilemapTiledJSON('mapa', 'wallyLikeAnEgyptian/assets/mapa/mapaTiled.json');

    //Objetos movibles
    this.load.image('caja', 'wallyLikeAnEgyptian/assets/sprites/caja.png');

    //portales cofres con animacion
    this.load.spritesheet('cofre', 'wallyLikeAnEgyptian/assets/sprites/cofreSpriteSheet.png', {
    frameWidth: 15,  
    frameHeight: 16  
    });
    
    // ICONOS JEROGLÍFICOS
    for (let i = 1; i <= 9; i++) {
      this.load.image(`jero${i}`, `wallyLikeAnEgyptian/assets/minijuegos/luces/jero${i}.png`);
    }
    //jeroglificos bitacora
    this.load.image('A', 'wallyLikeAnEgyptian/assets/jeroglificos/a.png');
    this.load.image('B', 'wallyLikeAnEgyptian/assets/jeroglificos/b.png');
    this.load.image('C', 'wallyLikeAnEgyptian/assets/jeroglificos/c.png');
    this.load.image('E', 'wallyLikeAnEgyptian/assets/jeroglificos/e.png');
    this.load.image('I', 'wallyLikeAnEgyptian/assets/jeroglificos/i.png');
    this.load.image('L', 'wallyLikeAnEgyptian/assets/jeroglificos/l.png');
    this.load.image('M', 'wallyLikeAnEgyptian/assets/jeroglificos/m.png');
    this.load.image('N', 'wallyLikeAnEgyptian/assets/jeroglificos/n.png');
    this.load.image('O', 'wallyLikeAnEgyptian/assets/jeroglificos/o.png');
    this.load.image('P', 'wallyLikeAnEgyptian/assets/jeroglificos/p.png');
    this.load.image('Q', 'wallyLikeAnEgyptian/assets/jeroglificos/q.png');
    this.load.image('R', 'wallyLikeAnEgyptian/assets/jeroglificos/r.png');
    this.load.image('S', 'wallyLikeAnEgyptian/assets/jeroglificos/s.png');
    this.load.image('T', 'wallyLikeAnEgyptian/assets/jeroglificos/t.png');
    this.load.image('U', 'wallyLikeAnEgyptian/assets/jeroglificos/u.png');

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
   
    //this.load.audio('sandstorm', 'assets/sounds/sandstorm.mp3');
  }

  create() {
    // Opcional: reproducir sonido de inicio o mostrar logo
    this.scene.start('MainMenu'); // escena principal de título o menú
  }
}
