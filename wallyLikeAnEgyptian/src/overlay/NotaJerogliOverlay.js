/**
 * @file NotaJerogliOverlay.js
 * @class NotaJerogliOverlay
 * @extends Phaser.Scene
 * @description Overlay que muestra una nota compuesta por jeroglíficos.
 * Si el jugador ha obtenido un jeroglífico, se muestra su letra traducida;
 * si no, se muestra el símbolo original como pista visual.
 * Se cierra pulsando la tecla N.
 */

import InputManager from "../core/InputManager.js";
import { JEROGLIFICOS_NOTA_DATA } from "../config/JeroglificosData.js";
import { JEROGLIFICOS_DATA } from "../config/JeroglificosData.js";
import { playerInitialData } from "../config/PlayerData.js";
import { MAPA_JEROGLIFICOS} from "../config/JeroglificosData.js"

export default class NotaJerogliOverlay extends Phaser.Scene {

  constructor() {
    super("NotaJerogliOverlay");
    this.isOverlay = true;
  }

  /**
   * Inicializa el overlay.
   * @param {Object} data - Datos opcionales.
   * @param {string} data.parentScene - Escena que se reanuda al cerrar la nota.
   */
  init(data) {
    this.parentScene = data?.parentScene || "MapScene";
  }
  
  /**
   * Crea la interfaz visual de la nota:
   * fondo oscuro, título, instrucciones y contenido jeroglífico.
   */
  create() {
    const { width, height } = this.sys.game.config;

    //=== INPUT ===
    this.inputManager = new InputManager(this);
    this.inputManager.configure({
      keyboard: true,
      keys: ["N"]
    });

    this.inputManager.on("keyDown", (key) => {
      if (key === "N") this.cierraNota();
    });

    //=== FONDO ===
    this.add.rectangle(0, 0, width, height, 0x000000, 0.85).setOrigin(0, 0);

    //=== TÍTULO ===
    this.add.text(width / 2, 60, "NOTA", {
      fontFamily: "Filgaia",
      fontSize: "36px",
      color: "#e6c480",
      fontStyle: "bold"
    }).setOrigin(0.5);

    //=== INSTRUCCIONES ===
    this.add.text(width / 4, 60, "Pulsa N para volver", {
      fontFamily: "Filgaia",
      fontSize: "20px",
      color: "#e6c480"
    }).setOrigin(0.5);

    //=== CONTENIDO ===
    this.renderNota();
  }

  /**
   * Renderiza la nota jeroglífica como una cuadrícula.
   * Si el jugador ha obtenido un jeroglífico, se muestra su letra;
   * en caso contrario, se muestra el símbolo correspondiente.
   */
  renderNota() {
    const W = this.scale.width;
    const H = this.scale.height;

    const margenSuperior = 100;
    const margenInterior = 60;

    const areaY = margenSuperior;
    const areaH = H - margenSuperior;

    const filas = 4;
    const columnas = 17;

    const anchoBloque = W / columnas;
    const altoBloque = areaH / filas;
    
    //Recorre la matriz de la nota
    for(let i=0;i<filas;i++){
      for(let j=0;j<columnas;j++){

        const jeroID=JEROGLIFICOS_NOTA_DATA[i][j];

        if(jeroID!=0) {
            
          const obtenido = playerInitialData.jeroglificosObtenidos.includes(jeroID);

          if(obtenido) {
            // Mostrar letra traducida
            const x = j * anchoBloque + margenInterior-20;
            const y = areaY + i * altoBloque + margenInterior;

            const letra = this.getLetra(jeroID);

            this.add.text(x, y, letra, {
              fontFamily: "Filgaia",
              fontSize: `${altoBloque * 0.35}px`,
              color: "#e6c480"
            }).setOrigin(0.5);

          } else {
            // Mostrar símbolo del jeroglífico
            const x = j * anchoBloque + anchoBloque / 2;
            const y = areaY + i * altoBloque + altoBloque / 2;

            const jero=this.getJero(jeroID);
            this.add.image(x, y, jero).setScale(0.35);
          }
        }
      }
    }
  }

  /**
   * Obtiene la letra asociada a un jeroglífico.
   * @param {number} id - ID del jeroglífico.
   * @returns {string|null} Letra traducida o null si no existe.
   */
  getLetra(id) {
    return MAPA_JEROGLIFICOS[id]?.letra || null;
  }

  /**
   * Obtiene el sprite del símbolo de un jeroglífico.
   * @param {number} id - ID del jeroglífico.
   * @returns {string|null} Clave del sprite o null si no existe.
   */
  getJero(id){
    return MAPA_JEROGLIFICOS[id]?.simbolo || null;
  }

  /**
   * Actualiza el InputManager.
   */
  update() {
    this.inputManager.update();
  }

  /**
   * Cierra la nota y reanuda la escena padre.
   */
  cierraNota() {
    this.scene.stop();
    this.scene.resume(this.parentScene);
  }
}
  