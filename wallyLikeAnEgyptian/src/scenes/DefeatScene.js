import PostMinigameMenu from '../menus/PostMinigameMenu.js';
import InputManager from '../core/InputManager.js';

export default class DefeatScene extends Phaser.Scene {
  constructor() {
    super('DefeatScene');
  }

  init(data) {
    this.minigameId = data.minigameId || 'unknown';
    this.difficulty = data.difficulty || 'easy';
  }

  create() {
    const { width, height } = this.cameras.main;

    // Fondo translúcido
    this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0);

    const input = InputManager.getInstance(this);
    input.disableMouse();

    // Título
    this.add.text(width / 2, height / 2 - 180, 'Derrota...', {
      fontSize: '36px',
      color: '#ff5555',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Animación temática
    this.showAnimation();

    // Mostrar resultado (sin recompensa)
    this.showResults();

    // === BOTONES ===
    this.menu = new PostMinigameMenu(this, {
      "Reintentar": () => {
        this.scene.stop();
        this.scene.start('SelectDifficultyScene', { minijuego: this.minigameId });
      },
      "Salir al mapa": () => {
        this.scene.stop();
        this.scene.start('MapScene');
      },
    });
  }

  /** Tormenta de arena descendente (efecto egipcio de derrota) */
  showAnimation() {
    const particles = this.add.particles('sand_particle');
    const emitter = particles.createEmitter({
      x: { min: 0, max: this.cameras.main.width },
      y: 0,
      speedY: { min: 200, max: 400 },
      lifespan: 1500,
      scale: { start: 0.5, end: 0 },
      blendMode: 'MULTIPLY',
      alpha: { start: 0.8, end: 0 },
    });
    this.time.delayedCall(3000, () => particles.destroy());
  }

  /** Mensaje simple de ánimo */
  showResults() {
    const { width, height } = this.cameras.main;

    this.add.text(width / 2, height / 2, '¡No te rindas, camarero!', {
      fontSize: '22px',
      color: '#fff',
      fontStyle: 'italic',
    }).setOrigin(0.5);
  }
}
