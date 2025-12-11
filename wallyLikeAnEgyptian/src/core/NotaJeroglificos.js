/**
 * JSDOC
 * YA
 * A
 */

export default class NotaJeroglificos {
  constructor(scene, x, y, mensaje, playerInventory) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.mensaje = mensaje.split('');
    this.playerInventory = playerInventory;
    this.items = [];

    this.mensaje.forEach((letra, i) => {
      const jeroglificoKey = 'jerg_{letra}';
      const sprite = scene.add.sprite(x + i * 32, y, jeroglificoKey).setScale(0.5);
      this.items.push({ letra, sprite, revealed: false });
    });
  }
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