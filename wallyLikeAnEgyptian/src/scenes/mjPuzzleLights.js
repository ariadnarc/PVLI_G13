/**
 * JSDOC
 * YA
 * A
 */

import { DIFICULTADES } from '../config/MinigameData.js';
import InputManager from '../core/InputManager.js';

export default class PuzzleLights extends Phaser.Scene {
  constructor() {
    super('PuzzleLights');
  }

  init(data) {
    this.isMinigame = true;
    this.minijuego = data?.minijuego; 
    this.difficulty = data?.dificultad || 'FACIL';
    this.jeroglificoId = data?.jeroglificoId; 
  }

  create() {

    //cogemos los parametros del minijuegos en base a la dificultad elegida por el player
    const config = DIFICULTADES[this.difficulty].minijuegos.PuzzleLights;

    this.inputManager = new InputManager(this);

    //fondo
    this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'paredBG') // general

    //parametros definidos por dificultad elegida
    this.lives = config.vidas;
    this.rounds = config.rondas;
    this.delay = config.velocidad; //ms entre flasheos de las casillas

    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    //PARAMETROS DE JUEGO
    this.gridSize = 3;
    this.tileSize = 100;
    this.spacing = 20;
    this.currentRound = 0;
    this.sequence = [];
    this.playerInput = [];
    this.isPlayerTurn = false;

    //TITULOS Y VIDA
    this.titleText = this.add.text(centerX / 3, 40, 'Memoria de Luces', {
      fontFamily: 'Filgaia',
      fontSize: '32px',
      color: '#382f23ff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.livesText = this.add.text(centerX, 40, `Vidas: ${this.lives}`, {
      fontFamily: 'Filgaia',
      fontSize: '30px',
      color: '#382f23ff'
    }).setOrigin(0.5);

    this.roundText = this.add.text(centerX, 90, `Ronda 1 de 3`, {
      fontFamily: 'Filgaia',
      fontSize: '30px',
      color: '#382f23ff'
    }).setOrigin(0.5);

    //indicador de turno
    this.turnText = this.add.text(centerX, centerY + this.gridSize * this.tileSize / 2 + 80, '', {
      fontFamily: 'Filgaia',
      fontSize: '30px',
      color: '#dfd581ff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Lista de claves de jeroglíficos disponibles
    const glyphKeys = ['A', 'B', 'C', 'E', 'I', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U'];

    // MATRIZ DE JEROGLIFICOS
    this.tiles = [];
    const startX = centerX - (this.gridSize * (this.tileSize + this.spacing)) / 2 + this.tileSize / 2;
    const startY = centerY - (this.gridSize * (this.tileSize + this.spacing)) / 2 + this.tileSize / 2;

    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        const x = startX + col * (this.tileSize + this.spacing);
        const y = startY + row * (this.tileSize + this.spacing);

        // Escoger un jeroglífico aleatorio
        const randomKey = glyphKeys[Math.floor(Math.random() * glyphKeys.length)];

        const tile = this.add.image(x, y, randomKey)
          .setDisplaySize(this.tileSize, this.tileSize);

        tile.setInteractive();
        tile.originalTint = 0xffffff;

        const index = this.tiles.length;
        tile.on('pointerdown', () => this.handlePlayerClick(tile, index));

        this.tiles.push(tile);
      }
    }

    this.bgMusic = this.sound.add('minigame-music');
    this.bgMusic.play();

    //INICIAR PRIMERA RONDA
    this.startRound();
  }

  startRound() {
    this.roundText.setText(`Ronda ${this.currentRound + 1} de 3`);
    this.playerInput = [];
    this.isPlayerTurn = false;

    //generar secuencia aleatoria
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
    this.turnText.setText('Observa la secuencia'); // Texto para la secuencia

    for (let i = 0; i < this.sequence.length; i++) {
      const tileIndex = this.sequence[i];
      const tile = this.tiles[tileIndex];
      await this.flashTile(tile, this.delay);
    }

    this.isPlayerTurn = true;
    this.turnText.setText('¡Tu turno!');
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

    //verificar paso actual
    if (this.sequence[currentStep] !== index) {
      this.failRound();
      return;
    }

    //si completa la secuencia correctamente
    if (this.playerInput.length === this.sequence.length) {
      this.time.delayedCall(500, () => this.completeRound());
    }
  }

  failRound() {
    this.lives--;
    this.livesText.setText(`Vidas: ${this.lives}`);
    this.isPlayerTurn = false;

    if (this.lives <= 0) {
      this.endGame('defeat');
      return;
    }

    //repetir la misma ronda con nueva secuencia
    this.time.delayedCall(800, () => { this.startRound(); });
  }

  completeRound() {
    this.isPlayerTurn = false;

    this.currentRound++;
    if (this.currentRound >= this.rounds.length) {
      this.endGame('victory');
      return;
    }

    //proxima ronda
    this.time.delayedCall(800, () => { this.startRound(); });
  }

  endGame(result) {
    this.bgMusic.stop();
    this.isPlayerTurn = false;

    this.time.delayedCall(1500, () => {
      this.scene.stop(this.scene.key);
      this.scene.launch('PostMinigameMenu', {
        result: result,
        difficulty: this.difficulty,
        minijuego: 'PuzzleLights',
        jeroglificoId: this.jeroglificoId, 
        options: this.getMenuOptions(result)
      });
    });
  }

  getMenuOptions(result) {
    if (result === 'victory') {
      return {
        'Volver al mapa': () => {
          this.scene.stop('PostMinigameMenu');
          this.scene.start('MapScene');
        }
      };
    } else { // derrota
      return {
        'Reintentar': () => {
          this.scene.stop('PostMinigameMenu');
          this.scene.restart({
            minijuego: this.minijuego,
            dificultad: this.difficulty,
            jeroglificoId: this.jeroglificoId 
          });
        },
        'Salir': () => {
          this.scene.stop('PostMinigameMenu');
          this.scene.start('MapScene');
        }
      };
    }
  }

  update() {
    if (this.inputManager) this.inputManager.update();
  }

}
