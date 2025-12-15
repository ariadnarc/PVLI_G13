import GlyphTierData from '../config/GlyphTierData.js';
import BinnacleManager from '../core/BinnacleManager.js';

export default class VictoryScene extends Phaser.Scene {

  constructor() {
    super('VictoryScene');
  }

  init(data) {
    this.difficulty = data.difficulty || 'easy';
    this.minigameId = data.minigameId || 'unknown';
    this.perfectScore = data.perfectScore || false;
  }

  create() {
    const { width, height } = this.cameras.main;
    this.binnacle = BinnacleManager.getInstance();

    this.add.rectangle(0, 0, width, height, 0x000000, 0.5).setOrigin(0);

    this.add.text(width / 2, height / 2 - 180, '¡Victoria!', {
      fontSize: '36px',
      color: '#FFD700',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // RECOMPENSAS
    const rewards = this.calculateRewards();

    this.binnacle.addGlyph(rewards);
    this.showResults(rewards);

    // MENÚ FINAL
    this.scene.launch("PostMinigameMenu", {
      parentScene: this.scene.key,
      opciones: {
        "Reintentar": () => {
          this.sound.play("click");
          this.scene.stop("VictoryScene");
          this.scene.start("SelectDifficultyScene", { minijuego: this.minigameId });
        },
        "Salir al mapa": () => {
          this.sound.play("click");
          this.scene.stop("VictoryScene");
          this.scene.start("MapScene");
        }
      }
    });
  }

  // LÓGICA DE RECOMPENSAS TOTAL
  calculateRewards() {

    const total = { S: 0, A: 0, B: 0 };

    // 1. Base reward
    const base = GlyphTierData.baseRewards[this.difficulty];
    for (const tier in base) total[tier] += base[tier];

    // 2. Random reward (1 unidad)
    const randomTier = GlyphTierData.getRandomReward(this.difficulty);
    total[randomTier]++;

    // 3. BONUS por puntuación perfecta
    if (this.perfectScore) {
      const bonus = GlyphTierData.getBonusReward(this.difficulty);
      for (const tier in bonus) {
        total[tier] += bonus[tier];
      }
    }

    return total;
  }

  // Mostrar resultados
  showResults(rewards) {
    const { width, height } = this.cameras.main;
    const tierColors = { S: '#ffcc00', A: '#ff6666', B: '#66ccff' };

    this.add.text(width / 2, height / 2 - 50, 'Has conseguido:', {
      fontSize: '22px',
      color: '#fff'
    }).setOrigin(0.5);

    let offsetY = 0;

    for (const tier of ["S", "A", "B"]) {
      const count = rewards[tier];
      if (count > 0) {
        this.add.text(width / 2, height / 2 + 20 + offsetY,
          `x${count} Jeroglífico(s) Tier ${tier}`, {
            fontSize: '24px',
            color: tierColors[tier],
            fontStyle: 'bold'
          }
        ).setOrigin(0.5);

        offsetY += 40;
      }
    }

    if (this.perfectScore) {
      this.add.text(width / 2, height / 2 + 20 + offsetY + 20,
        '¡BONUS por puntación perfecta!', {
          fontSize: '20px',
          color: '#FFD700'
        }).setOrigin(0.5);
    }
  }
}
