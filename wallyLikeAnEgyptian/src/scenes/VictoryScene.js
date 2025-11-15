import { MINIGAME_REWARDS } from '../config/MinigameData.js';
import GlyphTierConfig from '../config/GlyphTierData.js';
import BinnacleManager from '../core/BinnacleManager.js';
import PostMinigameMenu from '../menus/PostMinigameMenu.js';
import InputManager from '../core/InputManager.js';

export default class VictoryScene extends Phaser.Scene {
  constructor() {
    super('VictoryScene');
  }

  init(data) {
    this.difficulty = data.difficulty || 'easy';
    this.minigameId = data.minigameId || 'unknown';
  }

  create() {
    // Fondo translúcido (sin destruir la escena anterior)
    const { width, height } = this.cameras.main;
    this.add.rectangle(0, 0, width, height, 0x000000, 0.5).setOrigin(0);

    const input = InputManager.getInstance(this);
    input.disableMouse();

    // === TÍTULO ===
    this.add.text(width / 2, height / 2 - 180, '¡Victoria!', {
      fontSize: '36px',
      color: '#FFD700',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // === ANIMACIÓN DE FONDO ===
    //this.showAnimation();

    // === RECOMPENSAS ===
    const rewardCount = MINIGAME_REWARDS.rewardSettings[this.difficulty].count || 1;
    const rewards = GlyphTierConfig.getMultipleRewards(this.difficulty, rewardCount);
    this.binnnacleManager = new BinnacleManager();
    this.binnnacleManager.addGlyph(rewards); // ahora admite objetos de varios tiers

    // === MOSTRAR RESULTADOS ===
    this.showResults(rewards);

    // Lanzamos escena postminijuego
    this.scene.launch('PostMinigameMenu', {
      parent: this.scene.key,
      opciones: {
        "Reintentar": () => {
          this.scene.stop();
          this.scene.start('SelectDifficultyScene', { minijuego: this.minigameId });
        },
        "Salir al mapa": () => {
          this.scene.stop();
          this.scene.start('MapScene');
        },
      }
    });
  }

  /** Partículas doradas ascendentes */
  showAnimation() {
    this.scene.sound?.play('victory');
    const particles = this.add.particles('gold_particle');
    const emitter = particles.createEmitter({
      x: this.cameras.main.centerX,
      y: this.cameras.main.centerY + 50,
      speed: { min: -100, max: 100 },
      scale: { start: 0.5, end: 0 },
      blendMode: 'ADD',
      lifespan: 1200,
    });
    this.time.delayedCall(2500, () => particles.destroy());
  }

  /** Muestra los jeroglíficos obtenidos */
  showResults(rewards) {
    const { width, height } = this.cameras.main;
    const tierColors = { S: '#ffcc00', A: '#ff6666', B: '#66ccff' };

    this.add.text(width / 2, height / 2 - 50, 'Has conseguido:', {
      fontSize: '22px',
      color: '#fff',
    }).setOrigin(0.5);

    let offsetY = 0;
    for (const [tier, count] of Object.entries(rewards)) {
      this.add.text(width / 2, height / 2 + 20 + offsetY, `x${count} Jeroglífico(s) Tier ${tier}`, {
        fontSize: '24px',
        color: tierColors[tier] || '#fff',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      offsetY += 40;
    }
  }
}
