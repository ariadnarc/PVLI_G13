import PostMinigameBaseScene from '../core/PostMinigameBaseScene.js';
import GlyphTierConfig from '../config/GlyphTierConfig.js';
import BinnacleManager from '../core/BinnacleManager.js';
import VictoryUI from '../ui/VictoryUI.js';

export default class VictoryScene extends PostMinigameBaseScene {
  constructor() {
    super('VictoryScene');
  }

  create() {
    this.createBaseUI('¡Victoria!');

    // Animación de fondo (ejemplo: haces de luz dorada)
    this.showAnimation();

    // Lógica de recompensa
    const reward = GlyphTierConfig.getRewardForDifficulty(this.difficulty);
    BinnacleManager.addGlyph(reward);

    // Mostrar resultados visualmente
    this.showResults(reward);

    // Botones
    this.createButtons(
      () => this.scene.start(this.minigameId), // reintentar
      () => this.scene.start('MapScene')       // volver al mapa
    );
  }

  showAnimation() {
    // Un brillo o partículas doradas subiendo
    const particles = this.add.particles('gold_particle');
    const emitter = particles.createEmitter({
      x: this.cameras.main.centerX,
      y: this.cameras.main.centerY + 50,
      speed: { min: -100, max: 100 },
      scale: { start: 0.5, end: 0 },
      blendMode: 'ADD',
      lifespan: 1200
    });
    this.time.delayedCall(2500, () => particles.destroy());
  }

  showResults(reward) {
    new VictoryUI(this, reward);
  }
}
