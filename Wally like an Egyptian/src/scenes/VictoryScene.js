import GlyphTierConfig from '../config/GlyphTierConfig.js';
import PlayerData from '../config/PlayerData.js';

export default class VictoryScene extends Phaser.Scene {
  constructor() {
    super('VictoryScene');
  }

  /**
   * Recibe datos desde el minijuego:
   * - difficulty: 'easy' | 'medium' | 'hard'
   * - minigameId: identificador del minijuego (opcional)
   */
  init(data) {
    this.difficulty = data.difficulty || 'easy';
    this.minigameId = data.minigameId || 'unknown';
  }

  create() {
    // === FONDO ===
    const overlay = this.add.rectangle(
      0, 0,
      this.cameras.main.width,
      this.cameras.main.height,
      0x000000,
      0.6
    ).setOrigin(0);

    const panel = this.add.rectangle(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      450, 320,
      0xffffff
    ).setStrokeStyle(4, 0x000000);

    // === LÓGICA DE RECOMPENSA ===
    const reward = GlyphTierConfig.getRewardForDifficulty(this.difficulty);
    PlayerData.addGlyph(reward);

    // === TEXTO PRINCIPAL ===
    this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY - 100,
      '¡Has completado el desafío!',
      { fontSize: '24px', color: '#000', fontStyle: 'bold' }
    ).setOrigin(0.5);

    this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY - 50,
      'Has conseguido un jeroglífico:',
      { fontSize: '18px', color: '#000' }
    ).setOrigin(0.5);

    // === VISUAL DEL JEROGLÍFICO ===
    const glyphImage = this.add.image(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 10,
      reward.imageKey
    ).setDisplaySize(80, 80);

    const tierColors = {
      S: '#ffcc00',
      A: '#ff6666',
      B: '#66ccff'
    };

    this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 80,
      `Tier ${reward.tier}`,
      { fontSize: '22px', color: tierColors[reward.tier] || '#000' }
    ).setOrigin(0.5);

    // === BOTÓN CONTINUAR ===
    const btnContinuar = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 130,
      'Continuar',
      { fontSize: '24px', color: '#000', backgroundColor: '#cccccc', padding: { x: 10, y: 5 } }
    ).setOrigin(0.5).setInteractive();

    btnContinuar.on('pointerover', () => btnContinuar.setStyle({ backgroundColor: '#aaaaaa' }));
    btnContinuar.on('pointerout', () => btnContinuar.setStyle({ backgroundColor: '#cccccc' }));
    btnContinuar.on('pointerdown', () => {
      this.scene.stop();
      this.scene.start('MapScene'); // vuelve al mapa principal
    });
  }
}
