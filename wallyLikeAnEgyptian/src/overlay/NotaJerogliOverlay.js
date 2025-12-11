/**
 * JSDOC
 * YA
 * A
 */

import BinnacleManager from "../core/BinnacleManager";

export default class NotaJerogliOverlay {
  constructor(scene) {
    this.scene = scene;

    this.mensaje = "SI QUIERES ENCONTRARME PRIMERO SUBE LAS ESCALERAS";

    this.letraJerogMap = {
      A: "S", E: "S", N: "S", S: "S",
      I: "A", U: "A", C: "A", T: "A", R: "A",
      Q: "B", M: "B", P: "B", O: "B", B: "B", L: "B"
    };
    this.startX = scene.cameras.main.centerX - (this.mensaje.length * 16);
    this.startY = 300;
    this.spacing = 32;

    this.binnacle = BinnacleManager.getInstance();

    this.items = [];
    this.#drawInitialGlyphs();
  }
  #drawInitialGlyphs() {
    this.mensaje.forEach((letra, i) => {
      const tier = this.letraJerogMap[letra];

      // ¿El jugador tiene el jeroglífico necesario?
      const unlocked = this.binnacle.hasGlyphs(tier, 1);

      // Selección de textura (letra o jeroglífico)
      const spriteKey = unlocked ? letra : `jerog_${letra}`;

      const sprite = this.scene.add
        .sprite(this.startX + i * this.spacing, this.startY, spriteKey)
        .setScale(0.5)
        .setOrigin(0.5);

      this.items.push({
        letra,
        tier,
        sprite,
        revealed: unlocked
      });
    });
  }
  update() {
    this.items.forEach(item => {
      if (!item.revealed && this.binnacle.hasGlyphs(item.tier, 1)) {
        // Cambiar sprite a la letra real
        item.sprite.setTexture(item.letra);
        item.revealed = true;
      }
    });
  }
}