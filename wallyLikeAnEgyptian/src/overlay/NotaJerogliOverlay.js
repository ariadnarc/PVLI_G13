/**
 * JSDOC
 * YA
 * A
 */

import InputManager from "../core/InputManager.js";
import { JEROGLIFICOS_NOTA_DATA } from "../config/JeroglificosData.js";
import { JEROGLIFICOS_DATA } from "../config/JeroglificosData.js";
import { playerInitialData } from "../config/PlayerData.js";
import { MAPA_JEROGLIFICOS} from "../config/JeroglificosData.js"

export default class NotaJerogliOverlay extends Phaser.Scene {
  constructor() {
    super("NotaJerogliOverlay");
  }
    init(data) {
      this.parentScene = data?.parentScene || "MapScene";
    }
  
    create() {
      //this.mensaje = "SI QUIERES ENCONTRARME PRIMERO SUBE LAS ESCALERAS";
      const { width, height } = this.sys.game.config;
  
      // --- INPUT ---
      this.inputManager = new InputManager(this);
      this.inputManager.configure({
        keyboard: true,
        keys: ["H"]
      });
  
      this.inputManager.on("keyDown", (key) => {
        if (key === "H") this.cierraNota();
      });
  
  
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
      this.add.text(width / 4, 60, "Pulsa H para volver", {
        fontFamily: "Filgaia",
        fontSize: "20px",
        color: "#e6c480"
      }).setOrigin(0.5);
  
      // --- CONTENIDO ---
      this.renderNota();
    }

    renderNota() {
      const W = this.scale.width;
      const H = this.scale.height;

      const margenSuperior = 60;
      const margenInterior = 4;

      const areaY = margenSuperior;
      const areaH = H - margenSuperior;

      const filas = 4;
      const columnas = 17;

      const anchoBloque = W / columnas;
      const altoBloque = areaH / filas;

      
      //Recorre la matriz de la nota
      for(let i=0;i<filas;i++){
        for(let j=0;j<columnas;j++){
            const jeroID=JEROGLIFICOS_NOTA_DATA[i,j];
          if(jeroID!=0){
              
              const obtenido=playerInitialData.jeroglificosObtenidos.includes(jeroID);
            if(obtenido){
              const x = j * anchoBloque + margenInterior;
              const y = areaY + i * altoBloque + margenInterior;

               const letra=this.getLetra(jeroID);
               this.add.text(x, y, letra, {
                fontFamily: "Filgaia",
                fontSize: `${altoBloque * 0.7}px`,
                color: "#e6c480"
                }).setOrigin(0.5);
  
            }
            else{
                const x = j * anchoBloque + anchoBloque / 2;
                const y = areaY + i * altoBloque + altoBloque / 2;
              const jero=this.getJero(jeroID);
              const img = this.add.image(x, y, jero).setScale(0.5);
            }
          }
        }
      }
    }
    getLetra(id) {
      return MAPA_JEROGLIFICOS[id]?.letra || null;
    }
    getJero(id){
      return MAPA_JEROGLIFICOS[id]?.simbolo || null;
    }

    update() {
      this.inputManager.update();
    }
  
    cierraNota() {
      this.scene.stop();
      this.scene.resume(this.parentScene);
    }
}
  