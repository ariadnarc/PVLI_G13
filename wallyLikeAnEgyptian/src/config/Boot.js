/**
 * JSDOC
 * YA
 * A
 */

import { playerInitialData } from './PlayerData.js';
import SoundManager from '../core/SoundManager.js';

export default class Boot extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {

    //=== MINIJUEGOS ===
    // Lockpick:
    this.load.image('lock_fondo', 'wallyLikeAnEgyptian/assets/minijuegos/minijuegoLock/lock_fondo.png');
    this.load.image('lock_ring', 'wallyLikeAnEgyptian/assets/minijuegos/minijuegoLock/lock_ring.png');
    this.load.image('lock_lock', 'wallyLikeAnEgyptian/assets/minijuegos/minijuegoLock/lock_lock.png');
    this.load.image('lock_lockpick', 'wallyLikeAnEgyptian/assets/minijuegos/minijuegoLock/lock_lockpick.png');
    // Undertale:
    this.load.image('fondoUndertale', 'wallyLikeAnEgyptian/assets/minijuegos/minijuegoUndertale/fondoUndertale.png');
    this.load.image('fase1obs', 'wallyLikeAnEgyptian/assets/minijuegos/minijuegoUndertale/dagaUndertale.png');
    this.load.spritesheet('fase2obs', 'wallyLikeAnEgyptian/assets/minijuegos/minijuegoUndertale/chakramUndertale.png', {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.image('fase3obs', 'wallyLikeAnEgyptian/assets/minijuegos/minijuegoUndertale/lanzaUndertale.png');
    // CrocoShoot:
    this.load.image('fondoCroco', 'wallyLikeAnEgyptian/assets/minijuegos/minijuegoCroco/fondoCroco.jpg');
    this.load.image('flechaCroco', 'wallyLikeAnEgyptian/assets/minijuegos/minijuegoCroco/flechaCroco.png');
    this.load.image('sacamuelas', 'wallyLikeAnEgyptian/assets/minijuegos/minijuegoCroco/sacamuelas.png');
    this.load.image('balista', 'wallyLikeAnEgyptian/assets/minijuegos/minijuegoCroco/Ballista.png');
    // SlideBar:
    this.load.image('papiroBar', 'wallyLikeAnEgyptian/assets/sprites/papyrusBar.jpg');
    // FindLuigi: 
    this.load.image('npc1', 'wallyLikeAnEgyptian/assets/minijuegos/minijuegoFinal/npc1.png');
    this.load.image('npc2', 'wallyLikeAnEgyptian/assets/minijuegos/minijuegoFinal/npc2.png');
    this.load.image('npc3', 'wallyLikeAnEgyptian/assets/minijuegos/minijuegoFinal/npc3.png');
    this.load.image('wallyMinijuego', 'wallyLikeAnEgyptian/assets/minijuegos/minijuegoFinal/wallyMinijuego.png');
    this.load.image('fondoFinal', 'wallyLikeAnEgyptian/assets/minijuegos/minijuegoFinal/fondoFinal.jpg');

    //=== FONDOS/MENUS ===
    this.load.image('mainmenuBG', 'wallyLikeAnEgyptian/assets/ui/mainmenuBG.jpg');
    this.load.image('selectdiffBG', 'wallyLikeAnEgyptian/assets/ui/selectdiffBG.jpg');
    this.load.image('paredBG', 'wallyLikeAnEgyptian/assets/ui/paredBG.jpg');
    this.load.image('fondoBoton', 'wallyLikeAnEgyptian/assets/ui/boton.png');
    this.load.image('fondoIntro', 'wallyLikeAnEgyptian/assets/ui/IntroScenebg.png');
    this.load.image('creditsFondo', 'wallyLikeAnEgyptian/assets/ui/creditsBG.png');

    //=== SPRITES ===
    this.load.spritesheet('player', 'wallyLikeAnEgyptian/assets/sprites/playerSpriteSheet.png', {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet('egyptTiles', 'wallyLikeAnEgyptian/assets/sprites/egypt_tomb.png', {
      frameWidth: 32,
      frameHeight: 32
    }); 
    
    this.load.image("lock", "wallyLikeAnEgyptian/assets/ui/lock.png");
    this.load.image('caja', 'wallyLikeAnEgyptian/assets/sprites/caja.png'); 
    this.load.image('cafe', 'wallyLikeAnEgyptian/assets/sprites/cafe.png');
    this.load.image('mariano', 'wallyLikeAnEgyptian/assets/sprites/mariano.png');
    this.load.image('wallyy', 'wallyLikeAnEgyptian/assets/sprites/Wally.png');

    //=== MAPA ===
    this.load.image('tilesImg', 'wallyLikeAnEgyptian/assets/mapa/tileSetProp.png');
    this.load.tilemapTiledJSON('mapa', 'wallyLikeAnEgyptian/assets/mapa/mapaTiled.json');

    this.load.spritesheet('cofre', 'wallyLikeAnEgyptian/assets/sprites/cofreSpriteSheet.png', {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet('portalFinal', 'wallyLikeAnEgyptian/assets/sprites/portalFinal.png', {
      frameWidth: 250,
      frameHeight: 592
    });

    //=== JEROGLIFICOS ===
    this.load.image('uraeus', 'wallyLikeAnEgyptian/assets/jeroglificos/uraeus.png');
    this.load.image('ankh', 'wallyLikeAnEgyptian/assets/jeroglificos/ankh.png');
    this.load.image('scarab', 'wallyLikeAnEgyptian/assets/jeroglificos/scarab.png');
    this.load.image('sun', 'wallyLikeAnEgyptian/assets/jeroglificos/sun.png');
    this.load.image('ba', 'wallyLikeAnEgyptian/assets/jeroglificos/ba.png');
    this.load.image('djed', 'wallyLikeAnEgyptian/assets/jeroglificos/djed.png');
    this.load.image('lotus', 'wallyLikeAnEgyptian/assets/jeroglificos/lotus.png');
    this.load.image('cobra', 'wallyLikeAnEgyptian/assets/jeroglificos/cobra.png');
    this.load.image('reed', 'wallyLikeAnEgyptian/assets/jeroglificos/reed.png');
    this.load.image('owl', 'wallyLikeAnEgyptian/assets/jeroglificos/owl.png');
    this.load.image('water', 'wallyLikeAnEgyptian/assets/jeroglificos/water.png');
    this.load.image('bread', 'wallyLikeAnEgyptian/assets/jeroglificos/bread.png');
    this.load.image('rope', 'wallyLikeAnEgyptian/assets/jeroglificos/rope.png');
    this.load.image('hand', 'wallyLikeAnEgyptian/assets/jeroglificos/hand.png');
    this.load.image('foot', 'wallyLikeAnEgyptian/assets/jeroglificos/foot.png');

    //=== VICTORY SCENE ===
    this.load.image("gold_particle", "wallyLikeAnEgyptian/assets/minijuegos/particles.jpg");

    //=== SONIDOS ===
    this.load.audio('victory', 'wallyLikeAnEgyptian/assets/sounds/victory.mp3');
    this.load.audio('defeat', 'wallyLikeAnEgyptian/assets/sounds/defeat.mp3');
    this.load.audio('click', 'wallyLikeAnEgyptian/assets/sounds/click.wav');
    this.load.audio('locked', 'wallyLikeAnEgyptian/assets/sounds/locked.wav');
    this.load.audio('unlocked', 'wallyLikeAnEgyptian/assets/sounds/unlocked.wav');
    this.load.audio('start', 'wallyLikeAnEgyptian/assets/sounds/start.wav');
    this.load.audio('slideBarTheme', 'wallyLikeAnEgyptian/assets/sounds/slideBarTheme.mp3');
    this.load.audio('crocoshootTheme', 'wallyLikeAnEgyptian/assets/sounds/crocoshootTheme.mp3');
    this.load.audio('undertaleTheme', 'wallyLikeAnEgyptian/assets/sounds/undertaleTheme.mp3');
    this.load.audio('puzzleLightsTheme', 'wallyLikeAnEgyptian/assets/sounds/puzzleLightsTheme.mp3');
    this.load.audio('lockPickTheme', 'wallyLikeAnEgyptian/assets/sounds/lockPickTheme.mp3');
    this.load.audio('walkLikeAnEgyptian', 'wallyLikeAnEgyptian/assets/sounds/walkLikeAnEgyptian.mp3');
    this.load.audio('finalBossTheme', 'wallyLikeAnEgyptian/assets/sounds/finalBossTheme.mp3');
    this.load.audio('creditsMusic', 'wallyLikeAnEgyptian/assets/sounds/credits_sound.mp3');

  }

  create() {

    const soundManager = new SoundManager(this);
    // === ANIMACIONES ===
    
    //Player:
    this.anims.create({
      key: 'walk-down',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 6 }),
        frameRate: 10,
        repeat: -1
      });
      
      this.anims.create({
        key: 'walk-up',
        frames: this.anims.generateFrameNumbers('player', { start: 7, end: 13 }),
        frameRate: 10,
        repeat: -1
      });
      
      this.anims.create({
        key: 'walk-right',
        frames: this.anims.generateFrameNumbers('player', { start: 14, end: 20 }),
        frameRate: 10,
        repeat: -1
      });
      
      this.anims.create({
        key: 'walk-left',
        frames: this.anims.generateFrameNumbers('player', { start: 21, end: 27 }),
        frameRate: 10,
        repeat: -1
      });
      
      //Portal final:
      this.anims.create({
        key: 'portal_idle',
        frames: this.anims.generateFrameNumbers('portalFinal', { start: 0, end: 3 }),
        frameRate: 6,
        repeat: -1
      });
      
      //Undertale;
      this.anims.create({
        key: 'giragira',
        frames: this.anims.generateFrameNumbers('fase2obs', { start: 0, end: 1 }),
        frameRate: 12,
        repeat: -1
      });
      
      //Cofres:
      this.anims.create({
        key: 'cofre_open',
        frames: this.anims.generateFrameNumbers('cofre', { start: 0, end: 4 }),
        frameRate: 10,
        repeat: 0
      });
      
    this.registry.set('soundManager', soundManager);

    this.scene.start('MainMenu'); // escena principal de título o menú
  }
}
