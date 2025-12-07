import MenuBase from './MenuBase.js';
import GlyphTierData from '../config/GlyphTierData.js';
import BinnacleManager from '../core/BinnacleManager.js';

/** 
 * ===IMPORTANTE===
 * PostMinigameMenu ahora funciona como escena de fin de minijuego
 * fusionando la antigua VictoryScene y el menu de botones.
 */

export default class PostMinigameMenu extends MenuBase {

  constructor() {
    super('PostMinigameMenu');
  }

  init(data) {
    // Estado del minijuego: 'victory' o 'defeat'
    this.result = data.result || 'defeat';
    this.difficulty = data.difficulty || 'easy';
    this.minigameId = data.minigameId || 'unknown';
    this.options = data.options || {}; // botones del menu     
  }

  create() {

    super.create(); // Inicializa InputManager y ESC

    const { width, height } = this.sys.game.config;

    // Fondo translucido
    this.add.rectangle(0, 0, width, height, 0x000000, 0.5).setOrigin(0);

    // Mensaje principal
    const titleText = this.result === 'victory' ? '¡Victoria!' : '¡Derrota!';
    const titleColor = this.result === 'victory' ? '#FFD700' : '#FF4444';

    this.add.text(width / 2, height / 2 - 180, titleText, {
      fontSize: '36px',
      color: titleColor,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Si es victoria, mostrar recompensas
    if (this.result === 'victory') {
      let rewards;
            try {
                rewards = GlyphTierData.getMultipleRewards(this.difficulty, 1);
            } catch (e) {
                console.warn(`Error al obtener recompensas para dificultad ${this.difficulty}, usando "easy" por defecto.`);
                rewards = GlyphTierData.getMultipleRewards('easy', 1);
            }

            // Guardar en la bitácora
            this.binnacle = BinnacleManager.getInstance();
            this.binnacle.addGlyph(rewards);

            this.showResults(rewards);
    }

    // Crear botones usando createButton() de MenuBase
    this.createMenuButtons();
  }

  showResults(rewards) {

    const { width, height } = this.sys.game.config;
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

  createMenuButtons() {
    const { width, height } = this.sys.game.config;
    const centerY = height / 2 + 150;

    const btnStyle = {
      fontSize: '22px',
      backgroundColor: '#ddd',
      color: '#000',
      padding: { x: 15, y: 8 },
    };

    const entries = Object.entries(this.options);
    const spacing = 220;
    const totalWidth = (entries.length - 1) * spacing;
    const startX = width / 2 - totalWidth / 2;

    entries.forEach(([label, callback], i) => {
      const x = startX + i * spacing;
      // Usamos createButton() de MenuBase
      this.createButton(label, x, centerY, callback, btnStyle);
    });
  }

  onEscape() {
    
    this.scene.stop();
    this.scene.start('MapScene');
  }
}
