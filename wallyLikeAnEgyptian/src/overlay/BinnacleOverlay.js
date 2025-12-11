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
    // Escena padre (a la que volver)
    this.parentScene = data?.parentScene || "MapScene";
  }

  create() {
    const { width, height } = this.sys.game.config;

    // --- GESTIÓN DE INPUT ---
    this.inputManager = new InputManager(this);
    this.inputManager.configure({
      keyboard: true,
      keys: ["B"]
    });

    // Keyboard 
    this.inputManager.on("keyDown", (key) => {
      if (key === "B") {
        this.closeBinnacle();
      }
    });

    // --- INSTANCIA DE BITÁCORA ---
    this.binnacle = BinnacleManager.getInstance();

    // --- FONDO OSCURECIDO ---
    this.add.rectangle(0, 0, width, height, 0x000000, 0.85).setOrigin(0, 0);

    // --- TÍTULO ---
    this.add.text(width / 2, 60, "BITÁCORA", {
      fontFamily: 'Filgaia',
      fontSize: "36px",
      color: "#e6c480",
      fontStyle: "bold"
    }).setOrigin(0.5);

    // --- INSTRUCCIONES ---
    this.add.text(width / 2, height - 60, "Pulsa B para volver", {
      fontFamily: 'Filgaia',
      fontSize: "20px",
      color: "#e6c480"
    }).setOrigin(0.5);

    // --- CONTENIDO DE JEROGLÍFICOS ---
    this.renderBinnacleContent();
  }

  /**
   * Dibuja la información proporcionada por BinnacleManager con imágenes de los tiers
   */
  renderBinnacleContent() {
    const { width } = this.sys.game.config;

    const summary = this.binnacle.getSummary();

    this.tierData = GlyphTierConfig.TIER_DATA;

    const startX = width / 2 - 200; // Ajuste horizontal inicial
    const spacing = 200; // separación horizontal entre tiers
    const yImage = 160;
    const yText = yImage + 60; // debajo de la imagen

    this.tierData.forEach((data, index) => {
      const x = startX + index * spacing;

      // Imagen del tier
      this.add.image(x, yImage, data.img).setOrigin(0.5).setScale(0.6);

      // Cantidad de jeroglíficos
      const amount = summary[data.tier] || 0;
      this.add.text(x, yText, `x${amount}`, {
        fontFamily: 'Filgaia',
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
