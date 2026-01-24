/**
 * @file NotaJeroglificos.js
 * @description
 * Clase para representar notas con jeroglíficos en pantalla.
 * Cada letra del mensaje se muestra como un sprite oculto que se revela
 * cuando el jugador tiene el jeroglífico correspondiente.
 */

/**
 * Datos de configuración de la nota de jeroglíficos.
 * @typedef {Object} NotaJeroglificoData
 * @property {number} x - Posición X de la nota.
 * @property {number} y - Posición Y de la nota.
 * @property {string} mensaje - Texto del mensaje a mostrar en jeroglíficos.
 * @property {Object.<string, boolean>} playerInventory - Inventario del jugador con jeroglíficos obtenidos.
 */

/**
 * Clase que representa una nota con jeroglíficos.
 */
export default class NotaJeroglificos {
  /**
   * Crea una nota con jeroglíficos.
   * @param {Phaser.Scene} scene - Escena de Phaser donde se mostrará la nota.
   * @param {number} x - Posición X de la nota.
   * @param {number} y - Posición Y de la nota.
   * @param {string} mensaje - Mensaje que se representa en jeroglíficos.
   * @param {Object.<string, boolean>} playerInventory - Inventario del jugador con jeroglíficos obtenidos.
   */
  constructor(scene, x, y, mensaje, playerInventory) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.mensaje = mensaje.split('');
    this.playerInventory = playerInventory;

    /** @type {Array<{letra: string, sprite: Phaser.GameObjects.Sprite, revealed: boolean}>} */
    this.items = [];

    // Crear los sprites de cada letra (inicialmente ocultos)
    this.mensaje.forEach((letra, i) => {
      const jeroglificoKey = 'jerg_{letra}';
      const sprite = scene.add.sprite(x + i * 32, y, jeroglificoKey).setScale(0.5);
      this.items.push({ letra, sprite, revealed: false });
    });
  }

  /**
   * Actualiza la nota y revela los jeroglíficos correspondientes
   * según el inventario del jugador.
   */
  update() {
    this.items.forEach(item => {
      // Si el jugador tiene el jeroglífico, cambiamos el sprite por letra
      if (!item.revealed && this.playerInventory[item.letra]) {
        item.sprite.setTexture(item.letra); // textura de la letra cargada en preload
        item.revealed = true;
      }
    });
  }
}