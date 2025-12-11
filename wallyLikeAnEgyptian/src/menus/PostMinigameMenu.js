import { MINIGAME_REWARDS } from '../config/MinigameData.js';
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
    this.result = data?.result || 'defeat';
    this.difficulty = data?.difficulty || 'FACIL';
    this.minijuego = data?.minijuego;
    this.options = data?.options || {};
    // Para minijuegos con varios intentos, si vienen en data
    this.remainingTries = data?.remainingTries;
  }

  create() {
    console.log(">>> PostMinigameMenu dificultad =", this.difficulty);

    super.create(); // Inicializa InputManager y ESC

    const { width, height } = this.sys.game.config;

    // Fondo translucido
    this.add.rectangle(0, 0, width, height, 0x000000, 0.5).setOrigin(0);

    // Mensaje principal
    const titleText = this.result === 'victory' ? '¡Victoria!' : '¡Derrota!';
    const titleColor = this.result === 'victory' ? '#FFD700' : '#FF4444';

    this.add.text(width / 2, height / 2 - 180, titleText, {
      fontFamily: 'Filgaia',
      fontSize: '36px',
      color: titleColor,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    //============RECOMPENSAS=================
    if (this.result === 'victory') {
      // Elegimos el count de recompensas segun la dificultad

      let rewardKey = this.difficulty; // FACIL / MEDIA / DIFICIL

      const rewardCount = MINIGAME_REWARDS.rewardSettings[rewardKey].count;

      const rewards = GlyphTierData.getMultipleRewards(this.difficulty, rewardCount);

      // Registrar en bitacora
      this.binnacle = BinnacleManager.getInstance();
      this.binnacle.addGlyph(rewards);

      // Mostrar en pantalla
      this.showResults(rewards);
    }

    // Intentos restantes para minijuegos como SlideBar
    if (this.remainingTries !== undefined && this.remainingTries > 0 && this.result === 'defeat') {
      this.add.text(width / 2, height / 2 - 100,
        `Intentos restantes: ${this.remainingTries}`,
        { fontFamily: 'Filgaia', fontSize: '22px', color: '#ffffff' }
      ).setOrigin(0.5);
    }

    //===========BOTONES==========
    this.createMenuButtons();
  }

  showResults(rewards) {

    const { width, height } = this.sys.game.config;
    const tierColors = { S: '#ffcc00', A: '#ff6666', B: '#66ccff' };

    this.add.text(width / 2, height / 2 - 50, 'Has conseguido:', {
      fontFamily: 'Filgaia',
      fontSize: '22px',
      color: '#fff',
    }).setOrigin(0.5);

    let offsetY = 0;

    for (const [tier, count] of Object.entries(rewards)) {
      this.add.text(width / 2, height / 2 + 20 + offsetY,
        `x${count} Jeroglífico(s) Tier ${tier}`,
        {
          fontFamily: 'Filgaia',
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

    const entries = Object.entries(this.options);
    const spacing = 300;
    const totalWidth = (entries.length - 1) * spacing;
    const startX = width / 2 - totalWidth / 2;

    entries.forEach(([label, callback], i) => {
      const x = startX + i * spacing;
      this.createButton(
        label,
        x,
        centerY,
        () => callback(),
        { width: 250, height: 60, hoverTint: 0xffaa00, fontSize: '28px', fontFamily: 'Filgaia' },
        'fondoBoton'
      );
    });
  }

  onEscape() {

    this.scene.stop();
    this.scene.start('MapScene');
  }
}
