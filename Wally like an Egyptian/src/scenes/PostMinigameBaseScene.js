import InputManager from '../core/InputManager.js';

export default class PostMinigameBaseScene extends Phaser.Scene {
  constructor(key) {
    super(key);
  }

  init(data) {
    this.difficulty = data.difficulty || 'easy';
    this.minigameId = data.minigameId || 'unknown';
    this.inputManager = new InputManager(this);
  }

  createBaseUI(titleText) {
    // Fondo
    this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.6).setOrigin(0);

    // Panel principal
    this.panel = this.add.rectangle(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      500, 350, 0xffffff
    ).setStrokeStyle(3, 0x000000);

    // Título
    this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY - 130,
      titleText,
      { fontSize: '26px', color: '#000', fontStyle: 'bold' }
    ).setOrigin(0.5);
  }

  createButtons(onRetry, onExit) {
    const btnRetry = this.add.text(
      this.cameras.main.centerX - 100,
      this.cameras.main.centerY + 130,
      'Reintentar',
      { fontSize: '22px', color: '#000', backgroundColor: '#cccccc', padding: { x: 10, y: 5 } }
    ).setOrigin(0.5).setInteractive();

    const btnExit = this.add.text(
      this.cameras.main.centerX + 100,
      this.cameras.main.centerY + 130,
      'Volver al mapa',
      { fontSize: '22px', color: '#000', backgroundColor: '#cccccc', padding: { x: 10, y: 5 } }
    ).setOrigin(0.5).setInteractive();

    [btnRetry, btnExit].forEach(btn => {
      btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#aaaaaa' }));
      btn.on('pointerout', () => btn.setStyle({ backgroundColor: '#cccccc' }));
    });

    btnRetry.on('pointerdown', onRetry);
    btnExit.on('pointerdown', onExit);
  }

  // Métodos que las subclases deben sobreescribir:
  showAnimation() {}
  showResults() {}
}
