/**
 * @file PuzzleLights.js
 * @class PuzzleLights
 * @extends Phaser.Scene
 * @description
 * Minijuego de memoria visual con jeroglíficos.
 * El jugador debe observar una secuencia de casillas que se iluminan
 * y repetirla en el orden correcto durante varias rondas, con vidas limitadas.
 */

import { DIFICULTADES } from '../config/MinigameData.js';
import InputManager from '../core/InputManager.js';

/**
 * Escena del minijuego "PuzzleLights".
 * Presenta una cuadrícula de jeroglíficos que se iluminan en secuencia.
 */
export default class PuzzleLights extends Phaser.Scene {

  /**
   * Crea la escena PuzzleLights.
   */
  constructor() {
    super('PuzzleLights');

    /**
     * Indica que esta escena se usa como minijuego.
     * @type {boolean}
     */
    this.isMinigame = true;

    /**
     * Identificador del minijuego.
     * @type {string|undefined}
     */
    this.minijuego = undefined;

    /**
     * Dificultad seleccionada para el minijuego.
     * @type {string}
     */
    this.difficulty = 'FACIL';

    /**
     * ID del jeroglífico asociado al minijuego.
     * @type {string|number|undefined}
     */
    this.jeroglificoId = undefined;

    /**
     * Gestor de entradas personalizado.
     * @type {InputManager|undefined}
     */
    this.inputManager = undefined;

    /**
     * Número de vidas actuales del jugador.
     * @type {number}
     */
    this.lives = 0;

    /**
     * Configuración de longitud de secuencia por ronda.
     * @type {number[]}
     */
    this.rounds = [];

    /**
     * Tiempo entre flasheos de casillas (ms).
     * @type {number}
     */
    this.delay = 0;

    /**
     * Tamaño de la cuadrícula (gridSize x gridSize).
     * @type {number}
     */
    this.gridSize = 3;

    /**
     * Tamaño de cada casilla en píxeles.
     * @type {number}
     */
    this.tileSize = 100;

    /**
     * Separación entre casillas en píxeles.
     * @type {number}
     */
    this.spacing = 20;

    /**
     * Índice de la ronda actual (0-based).
     * @type {number}
     */
    this.currentRound = 0;

    /**
     * Secuencia de índices de casillas a memorizar.
     * @type {number[]}
     */
    this.sequence = [];

    /**
     * Secuencia de índices pulsados por el jugador.
     * @type {number[]}
     */
    this.playerInput = [];

    /**
     * Indica si es el turno del jugador para introducir la secuencia.
     * @type {boolean}
     */
    this.isPlayerTurn = false;

    /**
     * Textos de interfaz: título, vidas, ronda, turno.
     * @type {Phaser.GameObjects.Text|undefined}
     */
    this.titleText = undefined;
    /** @type {Phaser.GameObjects.Text|undefined} */
    this.livesText = undefined;
    /** @type {Phaser.GameObjects.Text|undefined} */
    this.roundText = undefined;
    /** @type {Phaser.GameObjects.Text|undefined} */
    this.turnText = undefined;

    /**
     * Array de sprites de casillas (jeroglíficos) de la cuadrícula.
     * @type {Phaser.GameObjects.Image[]}
     */
    this.tiles = [];

    /**
     * Gestor de sonidos/música global.
     * @type {Object|undefined}
     */
    this.soundManager = undefined;
  }

  /**
   * Inicializa las propiedades del minijuego a partir de los datos recibidos.
   *
   * @param {Object} [data] - Datos pasados a la escena.
   * @param {string} [data.minijuego] - Identificador del minijuego.
   * @param {string} [data.dificultad='FACIL'] - Dificultad seleccionada.
   * @param {string|number} [data.jeroglificoId] - ID del jeroglífico asociado.
   */
  init(data) {
    this.isMinigame = true;
    this.minijuego = data?.minijuego; 
    this.difficulty = data?.dificultad || 'FACIL';
    this.jeroglificoId = data?.jeroglificoId; 
  }

  /**
   * Crea los elementos visuales, HUD, cuadrícula de jeroglíficos,
   * configura la dificultad y arranca la primera ronda.
   * @override
   */
  create() {

    // Configuración según dificultad
    const config = DIFICULTADES[this.difficulty].minijuegos.PuzzleLights;

    this.inputManager = new InputManager(this);

    // Fondo general
    this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'paredBG') // general

    // Parámetros definidos por dificultad
    this.lives = config.vidas;
    this.rounds = config.rondas;
    this.delay = config.velocidad; //ms entre flasheos de las casillas

    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // Parámetros de juego base
    this.gridSize = 3;
    this.tileSize = 100;
    this.spacing = 20;
    this.currentRound = 0;
    this.sequence = [];
    this.playerInput = [];
    this.isPlayerTurn = false;

    // Título y vidas
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

    // Indicador de turno
    this.turnText = this.add.text(centerX, centerY + this.gridSize * this.tileSize / 2 + 80, '', {
      fontFamily: 'Filgaia',
      fontSize: '30px',
      color: '#dfd581ff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Lista de claves de jeroglíficos disponibles
    const glyphKeys = [
      'scarab', 'lotus', 'rope', 'ankh', 'ba', 
      'cobra', 'water', 'hand', 'reed', 'owl', 
      'foot', 'sun', 'uraeus', 'bread', 'djed'
    ];

    // MATRIZ DE JEROGLÍFICOS
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

    // Música
    this.soundManager = this.registry.get('soundManager');
    this.soundManager.playMusic('puzzleLightsTheme');

    // Iniciar primera ronda
    this.startRound();
  }

  /**
   * Inicia o reinicia la ronda actual:
   * resetea la entrada del jugador, genera una nueva secuencia
   * y lanza el mostrado de la misma.
   */
  startRound() {
    this.roundText.setText(`Ronda ${this.currentRound + 1} de 3`);
    this.playerInput = [];
    this.isPlayerTurn = false;

    // Generar secuencia aleatoria según la co figuración de rondas
    const seqLength = this.rounds[this.currentRound];
    this.sequence = [];
    for (let i = 0; i < seqLength; i++) {
      this.sequence.push(Phaser.Math.Between(0, 8));
    }

    // Aviso previo
    this.turnText.setText('Prepárate…');

    this.time.delayedCall(1200, () => {
      this.showSequence();
    });
  }

  /**
   * Muestra la secuencia de casillas iluminándose una a una.
   * Al terminar, habilita el turno del jugador.
   */
  async showSequence() {
    this.isPlayerTurn = false;
    this.turnText.setText('Observa la secuencia'); 

    for (let i = 0; i < this.sequence.length; i++) {
      const tileIndex = this.sequence[i];
      const tile = this.tiles[tileIndex];
      await this.flashTile(tile, this.delay);
      await this.wait(150);
    }

    this.isPlayerTurn = true;
    this.turnText.setText('¡Tu turno!');
  }

  /**
   * Devuelve una promesa que se resuelve tras un tiempo dado.
   * @param {number} ms - Milisegundos a esperar.
   * @returns {Promise<void>} Promesa resuelta tras el retraso.
   */
  wait(ms) {
    return new Promise(resolve => {
      this.time.delayedCall(ms, resolve);
    });
  }

  /**
   * Destaca temporalmente una casilla (tint + tween de alpha)
   * y luego la restaura.
   *
   * @param {Phaser.GameObjects.Image} tile - Casilla a iluminar.
   * @param {number} duration - Duración del parpadeo en milisegundos.
   * @returns {Promise<void>} Promesa resuelta al finalizar el efecto.
   */
  flashTile(tile, duration) {
    return new Promise((resolve) => {
      tile.setTint(0xffff00);
      this.tweens.add({
        targets: tile,
        alpha: { from: 1, to: 0.2 }, 
        yoyo: true,
        duration: duration,
        onComplete: () => {
          tile.clearTint();            
          tile.setAlpha(1);           
          resolve();
        }
      });
    });
  }

  /**
   * Maneja el click del jugador sobre una casilla:
   * añade el índice a la secuencia del jugador, comprueba si coincide
   * con la secuencia objetivo y gestiona fallo/éxito de la ronda.
   *
   * @param {Phaser.GameObjects.Image} tile - Casilla pulsada.
   * @param {number} index - Índice de la casilla en el array de tiles.
   */
  handlePlayerClick(tile, index) {
    if (!this.isPlayerTurn) return;

    this.playerInput.push(index);
    this.flashTile(tile, 200);

    const currentStep = this.playerInput.length - 1;

    if (this.sequence[currentStep] !== index) {
      this.failRound();
      return;
    }

    // Si completa la secuencia correctamente
    if (this.playerInput.length === this.sequence.length) {
      this.time.delayedCall(500, () => this.completeRound());
    }
  }

  /**
   * Gestiona el fallo en la ronda:
   * reduce vidas, comprueba derrota o reinicia la ronda.
   */
  failRound() {
    this.lives--;
    this.livesText.setText(`Vidas: ${this.lives}`);
    this.isPlayerTurn = false;

    if (this.lives <= 0) {
      this.endGame('defeat');
      return;
    }

    // Repetir la misma ronda con nueva secuencia
    this.time.delayedCall(800, () => { this.startRound(); });
  }

  /**
   * Gestiona el éxito en la ronda:
   * avanza de ronda o, si no quedan más, termina con victoria.
   */
  completeRound() {
    this.isPlayerTurn = false;

    this.currentRound++;
    if (this.currentRound >= this.rounds.length) {
      this.endGame('victory');
      return;
    }

    this.time.delayedCall(800, () => { this.startRound(); });
  }

  /**
   * Termina el minijuego con resultado dado, detiene la música
   * y lanza el PostMinigameMenu con las opciones correspondientes.
   *
   * @param {'victory'|'defeat'} result - Resultado del minijuego.
   */
  endGame(result) {
    this.soundManager.stopMusic();
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

  /**
   * Devuelve las opciones del menú de post-minijuego en función del resultado.
   *
   * @param {'victory'|'defeat'} result - Resultado del minijuego.
   * @returns {Object<string, Function>} Mapa de texto de opción → callback.
   */
  getMenuOptions(result) {
    if (result === 'victory') {
      return {
        'Salir': () => {
          this.scene.stop('PostMinigameMenu');
          this.scene.start('MapScene');
        }
      };
    } else { 
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

  /**
   * Actualiza el gestor de entrada (si existe).
   * @override
   */
  update() {
    if (this.inputManager) this.inputManager.update();
  }

}
