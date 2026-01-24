/**
 * @file PlayerManager.js
 * @description
 * Clase que gestiona al jugador.
 * Controla el sprite, animaciones, velocidad y movimiento según un InputManager.
 * Incluye manejo de animaciones walk/idle y normalización de diagonales.
 */

 /**
  * Clase PlayerManager
  */
export default class PlayerManager {
  /**
   * Crea un PlayerManager.
   * @param {InputManager} inputManager - Instancia de InputManager configurada.
   * @param {Phaser.Scene} scene - Escena donde se añadirá el jugador.
   * @param {Object} data - Datos iniciales del jugador (posición, sprite, velocidad, escala).
   * @param {Phaser.Math.Vector2} data.posInicial - Posición inicial {x, y}.
   * @param {string} data.spriteName - Nombre del sprite en preload.
   * @param {number} [data.speed=200] - Velocidad de movimiento.
   * @param {number} [data.scale=1] - Escala del sprite.
   */
  constructor(inputManager, scene, data) {
    this.scene = scene;
    this.inputManager = inputManager; 
    this.data = data;

    // Crear el sprite del jugador
    this.sprite = scene.physics.add.sprite(
      this.data.posInicial.x,
      this.data.posInicial.y,
      this.data.spriteName,
      0 //frame inicial
    );

    this.sprite.setScale(this.data.scale); 
    this.speed = data.speed || 200;
    this.sprite.setCollideWorldBounds(false);

    // Ajustar el collider
    this.sprite.setSize(25, 32);
    this.sprite.setOffset(20, 12);

    // Estado para controlar animaciones 
    this.currentAnim = null;
    this.lastDirection = 'down';
  }

  /**
   * Actualiza la posición y animación del jugador.
   * Debe llamarse cada frame desde la escena.
   */
  update() {

    if (!this.sprite || !this.sprite.body) return;
    
    const dir = this.inputManager.getMovementVector();
    const body = this.sprite.body;

    // Normalizar diagonal
    if (dir.x !== 0 && dir.y !== 0) {
      const length = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
      dir.x /= length;
      dir.y /= length;
    }

    body.setVelocity(dir.x * this.speed, dir.y * this.speed);

    // Si no te mueves, idle
    if (dir.x === 0 && dir.y === 0) {
      this.playIdle();
      return;
    }

    // Movimiento horizontal
    if (Math.abs(dir.x) > Math.abs(dir.y)) {
      if (dir.x > 0) {
        this.lastDirection = 'right';
        this.playAnim('walk-right');
      } else {
        this.lastDirection = 'left';
        this.playAnim('walk-left');
      }
    }
    // Movimiento vertical
    else {
      if (dir.y > 0) {
        this.lastDirection = 'down';
        this.playAnim('walk-down');
      } else {
        this.lastDirection = 'up';
        this.playAnim('walk-up');
      }
    }
    console.log("Posicion del jugador:", this.sprite.x, this.sprite.y);
  }

  /**
   * Reproduce la animación si no es la misma que la actual.
   * @param {string} key - Clave de la animación ('walk-up', 'walk-down', etc.).
   */
  playAnim(key) {
    if (this.currentAnim !== key) {
      this.sprite.anims.play(key, true);
      this.currentAnim = key;
    }
  }

  /**
   * Reproduce el frame idle según la última dirección del jugador.
   */
  playIdle() {
    const idleFrames = {
      up: 7,
      down: 0,
      right: 14,
      left: 21,
    };

    const frame = idleFrames[this.lastDirection] ?? 0;

    this.sprite.setFrame(frame);
    this.currentAnim = null;
  }

  /**
   * Devuelve el sprite del jugador.
   * @returns {Phaser.GameObjects.Sprite}
   */
  getSprite() {
    return this.sprite;
  }
}
