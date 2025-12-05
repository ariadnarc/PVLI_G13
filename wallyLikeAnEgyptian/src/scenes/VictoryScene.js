import { MINIGAME_REWARDS } from '../config/MinigameData.js';
import GlyphTierConfig from '../config/GlyphTierData.js';
import BinnacleManager from '../core/BinnacleManager.js';

export default class VictoryScene extends Phaser.Scene {
  constructor() {
    super('VictoryScene');
  }

  init(data) {
    this.difficulty = data.difficulty || 'easy';
    this.minigameId = data.minigameId || 'unknown';
  }

  create() {
    const { width, height } = this.cameras.main;

    // Fondo translúcido
    this.add.rectangle(0, 0, width, height, 0x000000, 0.5).setOrigin(0);

    // Título
    this.add.text(width / 2, height / 2 - 180, '¡Victoria!', {
      fontSize: '36px',
      color: '#FFD700',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // ---------------------------
    //       RECOMPENSAS
    // ---------------------------
    const rewardCount = MINIGAME_REWARDS.rewardSettings[this.difficulty].count || 1;
    const rewards = GlyphTierConfig.getMultipleRewards(this.difficulty, rewardCount);

    // Registrar recompensas en la bitácora
    this.binnacle = new BinnacleManager();
    this.binnacle.addGlyph(rewards);

    // Mostrar en pantalla
    this.showResults(rewards);

    // -----------------------------
    //     LANZAR MENÚ FINAL
    // -----------------------------
  
    this.scene.launch("PostMinigameMenu", {
      parentScene: this.scene.key,
      opciones: {
        "Reintentar": () => {
          this.scene.stop("VictoryScene");
          this.scene.stop("SelectDifficultyScene");
          this.scene.start("SelectDifficultyScene", { minijuego: this.minigameId });
        },
        "Salir al mapa": () => {
          this.scene.stop("VictoryScene");
          this.scene.stop("SelectDifficultyScene");
          this.scene.start("MapScene");
        }
      }
    });
  }

  showResults(rewards) {
    const { width, height } = this.cameras.main;
    const tierColors = { S: '#ffcc00', A: '#ff6666', B: '#66ccff' };

    this.add.text(width / 2, height / 2 - 50, 'Has conseguido:', {
      fontSize: '22px',
      color: '#fff',
    }).setOrigin(0.5);

    let offsetY = 0;

    for (const [tier, count] of Object.entries(rewards)) {
      this.add.text(width / 2, height / 2 + 20 + offsetY,
        `x${count} Jeroglífico(s) Tier ${tier}`,
        {
          fontSize: '24px',
          color: tierColors[tier] || '#fff',
          fontStyle: 'bold',
        }
      ).setOrigin(0.5);

      offsetY += 40;
    }
  }
}
