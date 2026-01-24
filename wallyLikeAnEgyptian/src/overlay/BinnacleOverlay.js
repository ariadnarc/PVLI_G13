/**
 * @file BinnacleOverlay.js
 * @class BinnacleOverlay
 * @extends Phaser.Scene
 * @description Overlay de bitácora que muestra todos los jeroglíficos del juego.
 * Los jeroglíficos obtenidos se muestran visibles, mientras que los no obtenidos
 * aparecen oscurecidos. Se puede cerrar pulsando la tecla B.
 */
import InputManager from "../core/InputManager.js";
import { JEROGLIFICOS_DATA } from "../config/JeroglificosData.js";
import { playerInitialData } from "../config/PlayerData.js";

export default class BinnacleOverlay extends Phaser.Scene {

 constructor() {
    super("BinnacleOverlay");
    this.isOverlay = true;
  }

  /**
   * Inicializa el overlay.
   * @param {Object} data - Datos opcionales.
   * @param {string} data.parentScene - Escena que se reanuda al cerrar la bitácora.
   */
  init(data) {
    this.parentScene = data?.parentScene || "MapScene";
  }

  /**
   * Crea la interfaz visual de la bitácora:
   * fondo oscuro, título, instrucciones y contenido.
   */
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

    //=== INSTRUCCIONES ===
    this.add.text(width / 2, height - 60, "Pulsa B para volver", {
      fontFamily: "Filgaia",
      fontSize: "20px",
      color: "#e6c480"
    }).setOrigin(0.5);

    //=== CONTENIDO ===
    this.renderBinnacleContent();
  }
  
  /**
   * Dibuja la cuadrícula de jeroglíficos.
   * Los jeroglíficos no obtenidos se muestran oscurecidos.
   */
  renderBinnacleContent() {
    const { width } = this.sys.game.config;
    
    // Configuración de la cuadrícula
    const cols = 5;
    const rows = 3; // (15 jeroglíficos)
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
        // Oscurecer si no se ha obtenido 
        img.setTint(0x444444);
        img.setAlpha(0.3);
      }

      container.add([img]);
    });
  }

  /**
   * Actualiza el InputManager.
   */
  update() {
    this.inputManager.update();
  }

  /**
   * Cierra la bitácora y reanuda la escena padre.
   */
  closeBinnacle() {
    this.scene.stop();
    this.scene.resume(this.parentScene);
  }
}