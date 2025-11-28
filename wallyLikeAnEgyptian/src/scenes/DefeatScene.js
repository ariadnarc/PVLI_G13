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

    // Título
    this.add.text(width / 2, height / 2 - 180, 'Derrota...', {
      fontSize: '36px',
      color: '#ff5555',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Animación temática
    this.showAnimation();

    // Mensaje motivacional
    this.showResults();

    // -----------------------------
    //     LANZAR MENÚ FINAL
    // -----------------------------
    this.scene.launch("PostMinigameMenu", {
      parentScene: this.scene.key,
      opciones: {
        "Reintentar": () => {
          this.scene.stop("DefeatScene");
          this.scene.stop("SelectDifficultyScene");
          this.scene.start("SelectDifficultyScene", { minijuego: this.minigameId });
        },
        "Salir al mapa": () => {
          this.scene.stop("DefeatScene");
          this.scene.stop("SelectDifficultyScene");
          this.scene.start("MapScene");
        }
      }
    });
  }

  showAnimation() {
    const particles = this.add.particles('gold_particle');
    particles.createEmitter({
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

  showResults() {
    const { width, height } = this.cameras.main;

    this.add.text(width / 2, height / 2,
      '¡No te rindas, camarero!',
      {
        fontSize: '22px',
        color: '#fff',
        fontStyle: 'italic',
      }
    ).setOrigin(0.5);
  }
}
