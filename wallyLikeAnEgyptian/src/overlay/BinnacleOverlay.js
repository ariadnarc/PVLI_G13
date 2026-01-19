/**
 * JSDOC
 * YA
 * A
 */

import InputManager from "../core/InputManager.js";
import { JEROGLIFICOS_DATA } from "../config/JeroglificosData.js";
import { playerInitialData } from "../config/PlayerData.js";

export default class BinnacleOverlay extends Phaser.Scene {/*
  constructor() {
    super("BinnacleOverlay");
  }

  init(data) {
    this.parentScene = data?.parentScene || "MapScene";
  }

  create() {
    const { width, height } = this.sys.game.config;

    //=== INPUT ===
    this.inputManager = new InputManager(this);
    this.inputManager.configure({
      keyboard: true,
      keys: ["B"]
    });

    this.inputManager.on("keyDown", (key) => {
      if (key === "B") this.closeBinnacle();
    });

    //=== FONDO ===
    this.add.rectangle(0, 0, width, height, 0x000000, 0.85).setOrigin(0, 0);

    //=== TÍTULO ===
    this.add.text(width / 2, 60, "BITÁCORA", {
      fontFamily: "Filgaia",
      fontSize: "36px",
      color: "#e6c480",
      fontStyle: "bold"
    }).setOrigin(0.5);

    //=== CONTADOR ===
    const totalObtenidos = playerInitialData.jeroglificosObtenidos.length;
    this.add.text(width / 2, 90, `${totalObtenidos} / 15 jeroglíficos obtenidos`, {
      fontFamily: "Filgaia",
      fontSize: "22px",
      color: "#e6c480"
    }).setOrigin(0.5);

    //=== INSTRUCCIONES ===
    this.add.text(width / 2, height - 40, "Pulsa B para volver", {
      fontFamily: "Filgaia",
      fontSize: "18px",
      color: "#e6c480"
    }).setOrigin(0.5);

    //=== RENDERIZAR JEROGLÍFICOS ===
    this.renderJeroglificos();
  }

  
   // Dibuja las imágenes, nombres y cantidades de cada tier
   
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
  }*/
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

  
   // Dibuja las imágenes, nombres y cantidades de cada tier
   
  renderBinnacleContent() {
    const { width } = this.sys.game.config;
    
    // Configuración de la cuadrícula
    const cols = 5; // 5 columnas
    const rows = 3; // 3 filas (15 jeroglíficos)
    const startX = width / 2 - 360; // Centrado
    const startY = 160;
    const spacingX = 180;
    const spacingY = 160;

    JEROGLIFICOS_DATA.forEach((jero, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = startX + col * spacingX;
      const y = startY + row * spacingY;

      const obtenido = playerInitialData.jeroglificosObtenidos.includes(jero.id);

      // Contenedor para cada jeroglífico
      const container = this.add.container(x, y);

      // Imagen del jeroglífico
      const img = this.add.image(0, 0, jero.simbolo).setScale(0.5);

      if (!obtenido) {
        // Si NO lo tiene, oscurecer 
        img.setTint(0x444444);
        img.setAlpha(0.3);
      }

      container.add([img]);
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