/**
 * JSDOC
 * YA
 * A
 */

//import PlayerData from "../config/PlayerData";

export default class NotaJerogliOverlay extends Phaser.Scene {

  constructor() {
    super("NotaJerogliOverlay");
     this.scene = scene;
  }
  create() {
    this.mensaje = "SI QUIERES ENCONTRARME PRIMERO SUBE LAS ESCALERAS";

    this.startX = scene.cameras.main.centerX - (this.mensaje.length * 16);
    this.startY = 300;
    this.spacing = 32;

    this.items = [];
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
      keys: ["H"]
    });

    this.inputManager.on("keyDown", (key) => {
      if (key === "H") this.closeBinnacle();
    });

    this.jeroglificosNota=PlayerData.jeroglificosNota;

    // --- FONDO ---
    this.add.rectangle(0, 0, width, height, 0x000000, 0.85).setOrigin(0, 0);

    // --- TÍTULO ---
    this.add.text(width / 2, 60, "NOTA", {
      fontFamily: "Filgaia",
      fontSize: "36px",
      color: "#e6c480",
      fontStyle: "bold"
    }).setOrigin(0.5);

    // --- INSTRUCCIONES ---
    this.add.text(width / 2, height - 60, "Pulsa H para volver", {
      fontFamily: "Filgaia",
      fontSize: "20px",
      color: "#e6c480"
    }).setOrigin(0.5);

    // --- CONTENIDO ---
    this.render();
  }

  
   // Dibuja la nota
   
  render() {
    const { width } = this.sys.game.config;

    const summary = this.binnacle.getSummary();
    const image = GlyphTierConfig.TIER_DATA;

    const startX = width / 2 - 200;
    const spacing = 200;

    const yName = 160;      // Nombre + Tier
    const yImage = 260;     // Imagen
    const yCount = 360;     // Cantidad
    this.jeroglificosNota.forEach(()=>{
      if(this.jeroglificosNota[i]==true){
        this.add.text(this.jeroglificosNota[i],{
        fontFamily: "Filgaia",
        fontSize: "22px",
        color: "#e6c480",
        fontStyle: "bold"
        }).setOrigin(0.5);
      }
      else{
        this.add.image(x, yImage, )
        .setOrigin(0.5)
        .setScale(0.6);
      }
    });

    

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