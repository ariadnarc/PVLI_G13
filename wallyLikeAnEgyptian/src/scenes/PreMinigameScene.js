/**
 * JSDOC
 * YA
 * A
 */

import MenuBase from '../menus/MenuBase.js';
import { JEROGLIFICOS_DATA } from '../config/JeroglificosData.js';
import { NOMBRES_MINIJUEGOS } from '../config/MinigameData.js';

export default class PreMinigameScene extends MenuBase {

  constructor() {
    super('PreMinigameScene');
  }

  init(data) {
    super.init(data);

    this.minijuego = data.minijuego;
    this.dificultad = data.dificultad;
    this.jeroglificoId = data.jeroglificoId;
    this.controles = data.controles || [];
    this.parentScene = data.parentScene;

    this.nombreMinijuego = NOMBRES_MINIJUEGOS[this.minijuego];
    this.jeroglifico = JEROGLIFICOS_DATA.find(j => j.id === this.jeroglificoId);
  }

  create() {
    super.create();

    const centerX = this.cameras.main.centerX;
    const { width, height } = this.sys.game.config;

    // === Fondo ===
    const bg = this.add.image(width / 2, height / 2, 'selectdiffBG');
    bg.setDisplaySize(width, height);
    bg.setDepth(-10);

    // === Título Minijuego ===
    this.add.text(centerX, 90, this.nombreMinijuego, {
      fontFamily: 'Filgaia',
      fontSize: '48px',
      color: '#634830ff',
    }).setOrigin(0.5);

    // === Jeroglífico ===
    if (this.jeroglifico) {
      this.add.text(centerX, 150, 'Jeroglífico que obtendrás', {
        fontFamily: 'Filgaia',
        fontSize: '26px',
        color: '#ffd98d',
      }).setOrigin(0.5);

      this.add.image(centerX, 225, this.jeroglifico.simbolo)
        .setScale(0.6);

      this.add.text(centerX, 300, this.jeroglifico.letra, {
        fontFamily: 'Filgaia',
        fontSize: '18px',
        color: '#ffffff',
      }).setOrigin(0.5);
    }

    // === Dificultad ===
    this.add.text(centerX, 360, `Dificultad: ${this.dificultad}`, {
      fontFamily: 'Filgaia',
      fontSize: '24px',
      color: '#ffffff',
    }).setOrigin(0.5);

    // === Controles ===
    this.add.text(centerX, 400, 'Controles:', {
      fontFamily: 'Filgaia',
      fontSize: '24px',
      color: '#ffd98d',
    }).setOrigin(0.5);

    const controlesTexto = this.controles.join('\n');
    this.add.text(centerX, 450, controlesTexto, { // ajustado Y para que quede debajo del título
      fontFamily: 'Filgaia',
      fontSize: '20px',
      color: '#ffffff',
      align: 'center',
      lineSpacing: 8,
      wordWrap: { width: 600 }
    }).setOrigin(0.5);

    // === Botón JUGAR ===
    this.createOptButton('JUGAR', centerX + (centerX / 2), height - 70, () => {
      this.scene.stop('PreMinigameScene'); // Cerrar este menú
      this.scene.stop('MapScene'); // Cerrar el mapa
      this.scene.start(this.minijuego, { // Iniciar el minijuego
        dificultad: this.dificultad,
        jeroglificoId: this.jeroglificoId
      });
    });
    

    // === Botón VOLVER ===
    this.createOptButton('VOLVER', centerX - (centerX / 2), height - 70, () => {
      this.scene.stop('PreMinigameScene'); // Cerrar este menú
      this.scene.stop('MapScene'); // Cerrar el mapa
      this.scene.start('MapScene');
    });
  }

  createOptButton(texto, x, y, callback){

    const btn = this.add.image(x, y, "fondoBoton")
      .setInteractive({ useHandCursor: true });

    this.add.text(btn.x, btn.y, texto, {
      fontFamily: "Filgaia",
      fontSize: "20px",
      color: '#382f23ff'
    }).setOrigin(0.5);

    btn.once("pointerdown", callback);
    return btn;  
  }

  shutdown() {
  super.shutdown(); // Limpiar todo lo de MenuBase
}

}
