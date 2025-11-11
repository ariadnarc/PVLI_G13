export default class Boot extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {

    //TODO: Cambiar por los assets del juego (ESTO ES UN PLACEHOLDER CON ELEMENTOS INVENTADOSp)

    // === IMÁGENES Y SPRITES ===
    this.load.image('player', 'assets/player.png');
    this.load.image('mapTileset', 'assets/map/tileset.png');
    this.load.image('gold_particle', 'assets/particles/gold.png');
    this.load.image('sand_particle', 'assets/particles/sand.png');

    // === ICONOS JEROGLÍFICOS ===
    this.load.image('glyph_S', 'assets/glyphs/tierS.png');
    this.load.image('glyph_A', 'assets/glyphs/tierA.png');
    this.load.image('glyph_B', 'assets/glyphs/tierB.png');

    // === SONIDOS ===
    this.load.audio('victory', 'assets/sounds/victory.mp3');
    this.load.audio('defeat', 'assets/sounds/defeat.mp3');
    this.load.audio('click', 'assets/sounds/click.wav');
    this.load.audio('sandstorm', 'assets/sounds/sandstorm.mp3');

    // === OTROS ===
    this.load.image('background_pyramid', 'assets/backgrounds/pyramid.png');
  }

  create() {
    // Opcional: reproducir sonido de inicio o mostrar logo
    this.scene.start('GameTitle'); // escena principal de título o menú
  }
}
