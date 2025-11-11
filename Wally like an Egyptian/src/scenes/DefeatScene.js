import PostMinigameBaseScene from '../core/PostMinigameBaseScene.js';
import DefeatUI from '../ui/DefeatUI.js';

export default class DefeatScene extends PostMinigameBaseScene {
  constructor() {
    super('DefeatScene');
  }

  create() {
    this.createBaseUI('Has sido derrotado...');

    this.showAnimation();
    this.showResults();

    this.createButtons(
      () => this.scene.start(this.minigameId),
      () => this.scene.start('MapScene')
    );
  }

  showAnimation() {
    // 🌪️ Idea: una tormenta de arena (efecto de derrota egipcio)
    const particles = this.add.particles('sand_particle');
    const emitter = particles.createEmitter({
      x: { min: 0, max: this.cameras.main.width },
      y: 0,
      speedY: { min: 200, max: 400 },
      lifespan: 1500,
      scale: { start: 0.4, end: 0 },
      blendMode: 'MULTIPLY',
      alpha: { start: 0.8, end: 0 }
    });
    this.time.delayedCall(3000, () => particles.destroy());
  }

  showResults() {
    new DefeatUI(this);
  }
}
