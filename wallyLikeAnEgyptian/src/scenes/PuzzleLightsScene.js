import { playerInitialData } from '../config/PlayerData.js';
import { DIFICULTADES } from '../config/MinigameData.js';
import InputManager from '../core/InputManager.js';

export default class PuzzleLightsScene extends Phaser.Scene {
  constructor() {
    super('PuzzleLightsScene');
  }

  create(data) {
    // cogemos los parametros del minijuegos en base a la dificultad elegida por el player
    const config = DIFICULTADES[data.dificultad].minijuegos.puzzleLights;

    this.inputManager = InputManager.getInstance(this);
    this.inputManager.configure({
        mouse: true,
        keys: ['ESC']
    });

    // Parametros definidos por Dificultad elegida
    this.lives = config.vidas;
    this.rounds = config.rondas;
    this.delay = config.velocidad; //ms entre flasheos de las casillas

    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // PARÁMETROS DE JUEGO
    this.gridSize = 3;
    this.tileSize = 100;
    this.spacing = 20;
    this.currentRound = 0;
    this.sequence = [];
    this.playerInput = [];
    this.isPlayerTurn = false;

    // TÍTULOS Y VIDA
    this.titleText = this.add.text(centerX, 40, 'Memoria de Luces', {
      fontSize: '22px',
      color: '#ffff66',
    }).setOrigin(0.5);

    this.livesText = this.add.text(centerX, 70, `Vidas: ${this.lives}`, {
      fontSize: '18px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.roundText = this.add.text(centerX, 100, `Ronda 1 de 3`, {
      fontSize: '18px',
      color: '#66ff99'
    }).setOrigin(0.5);

    // MATRIZ DE JEROGLÍFICOS
    this.tiles = [];
    const startX = centerX - (this.gridSize * (this.tileSize + this.spacing)) / 2 + this.tileSize / 2;
    const startY = centerY - (this.gridSize * (this.tileSize + this.spacing)) / 2 + this.tileSize / 2;

    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        const x = startX + col * (this.tileSize + this.spacing);
        const y = startY + row * (this.tileSize + this.spacing);
        const tile = this.add.image(x, y, `jero${this.tiles.length + 1}`).setDisplaySize(this.tileSize, this.tileSize);
        tile.setInteractive();
        tile.originalTint = 0xffffff;
        // índice real del array
        const index = this.tiles.length;
        tile.on('pointerdown', () => this.handlePlayerClick(tile, index));
        this.tiles.push(tile);
      }
    }

    // INICIAR PRIMERA RONDA
    this.startRound();
  }

  update(){
    this.inputManager.handleExit('Minigame');
  }

  startRound() {
    this.roundText.setText(`Ronda ${this.currentRound + 1} de 3`);
    this.playerInput = [];
    this.isPlayerTurn = false;

    // Generar secuencia aleatoria
    const seqLength = this.rounds[this.currentRound];
    this.sequence = [];
    for (let i = 0; i < seqLength; i++) {
      this.sequence.push(Phaser.Math.Between(0, 8));
    }

    // Mostrar secuencia al jugador
    this.showSequence();
  }

  async showSequence() {
    this.isPlayerTurn = false;

    for (let i = 0; i < this.sequence.length; i++) {
      const tileIndex = this.sequence[i];
      const tile = this.tiles[tileIndex];
      await this.flashTile(tile, this.delay);
    }

    this.isPlayerTurn = true;
  }

  flashTile(tile, duration) {
    return new Promise((resolve) => {
      this.tweens.add({
        targets: tile,
        alpha: { from: 1, to: 0.3 },
        yoyo: true,
        duration: duration,
        onComplete: resolve
      });
    });
  }

  handlePlayerClick(tile, index) {
    if (!this.isPlayerTurn) return;

    this.playerInput.push(index);
    this.flashTile(tile, 200);

    const currentStep = this.playerInput.length - 1;

    // Verificar paso actual
    if (this.sequence[currentStep] !== index) {
      this.failRound();
      return;
    }

    // Si completó la secuencia correctamente
    if (this.playerInput.length === this.sequence.length) {
      this.time.delayedCall(500, () => this.completeRound());
    }
  }

  failRound() {
    this.lives--;
    this.livesText.setText(`Vidas: ${this.lives}`);
    this.isPlayerTurn = false;

    if (this.lives <= 0) {
      this.loseGame();
      return;
    }

    // Repetir la misma ronda con nueva secuencia
    this.time.delayedCall(800, () => {
      this.startRound();
    });
  }

  completeRound() {
    this.isPlayerTurn = false;

    this.currentRound++;
    if (this.currentRound >= this.rounds.length) {
      this.winGame();
      return;
    }

    // Próxima ronda
    this.time.delayedCall(800, () => {
      this.startRound();
    });
  }

  winGame() {
    this.isPlayerTurn = false;
    this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 200, '¡Victoria!', {
      fontSize: '28px',
      color: '#00ff00'
    }).setOrigin(0.5);

    this.time.delayedCall(1500, () => {
      this.scene.stop('PuzzleLightsScene');
      this.scene.launch('VictoryScene');
    });
  }

  loseGame() {
    this.isPlayerTurn = false;
    this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 200, 'Derrota', {
      fontSize: '28px',
      color: '#ff4444'
    }).setOrigin(0.5);

    this.time.delayedCall(2000, () => {
      this.scene.stop('PuzzleLightsScene');
      this.scene.start('MapScene');
    });
  }
}
