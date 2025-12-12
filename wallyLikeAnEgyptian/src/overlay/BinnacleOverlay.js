/**
 * JSDOC
 * YA
 * A
 */

import InputManager from "../core/InputManager.js";
import BinnacleManager from "../core/BinnacleManager.js";
import GlyphTierConfig from "../config/GlyphTierData.js"

export default class BinnacleOverlay extends Phaser.Scene {
  constructor() {
    super("BinnacleOverlay");
  }

  init(data) {
    this.parentScene = data?.parentScene || "MapScene";
  }

  create() {
    const { width, height } = this.sys.game.config;

    // --- INPUT ---
    this.inputManager = new InputManager(this);
    this.inputManager.configure({
      keyboard: true,
      keys: ["B"]
    });

    this.inputManager.on("keyDown", (key) => {
      if (key === "B") this.closeBinnacle();
    });

    // --- INSTANCIA DE BITÁCORA ---
    this.binnacle = BinnacleManager.getInstance();

    // --- FONDO ---
    this.add.rectangle(0, 0, width, height, 0x000000, 0.85).setOrigin(0, 0);

    // --- TÍTULO ---
    this.add.text(width / 2, 60, "BITÁCORA", {
      fontFamily: "Filgaia",
      fontSize: "36px",
      color: "#e6c480",
      fontStyle: "bold"
    }).setOrigin(0.5);

    // --- INSTRUCCIONES ---
    this.add.text(width / 2, height - 60, "Pulsa B para volver", {
      fontFamily: "Filgaia",
      fontSize: "20px",
      color: "#e6c480"
    }).setOrigin(0.5);

    // --- CONTENIDO ---
    this.renderBinnacleContent();
  }

  /**
   * Dibuja las imágenes, nombres y cantidades de cada tier
   */
  renderBinnacleContent() {
    const { width } = this.sys.game.config;

    const summary = this.binnacle.getSummary();
    const tierData = GlyphTierConfig.TIER_DATA;

    const startX = width / 2 - 200;
    const spacing = 200;

    const yName = 160;      // Nombre + Tier
    const yImage = 260;     // Imagen
    const yCount = 360;     // Cantidad

    tierData.forEach((data, index) => {
      const x = startX + index * spacing;

      // --- TÍTULO DEL SÍMBOLO ---
      this.add.text(x, yName, `${data.img.toUpperCase()} (Tier ${data.tier})`, {
        fontFamily: "Filgaia",
        fontSize: "18px",
        color: "#e6c480",
      }).setOrigin(0.5);

      // --- IMAGEN DEL TIER ---
      this.add.image(x, yImage, data.img)
        .setOrigin(0.5)
        .setScale(0.6);

      // --- CANTIDAD DEL INVENTARIO ---
      const amount = summary[data.tier] || 0;

      this.add.text(x, yCount, `x${amount}`, {
        fontFamily: "Filgaia",
        fontSize: "22px",
        color: "#e6c480",
        fontStyle: "bold"
      }).setOrigin(0.5);
    });
  }

  update() {
    this.inputManager.update();
  }

  closeBinnacle() {
    this.scene.stop();
    this.scene.resume(this.parentScene);
  }
}
