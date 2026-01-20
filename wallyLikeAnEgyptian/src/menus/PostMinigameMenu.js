/**
 * JSDOC
 * YA
 * A
 */

import MenuBase from './MenuBase.js';
import { JEROGLIFICOS_DATA } from '../config/JeroglificosData.js';
import { addJeroglifico, hasJeroglifico,deleteUltimoJeroglifico } from '../config/PlayerData.js';

/** 
 * ===IMPORTANTE===
 * PostMinigameMenu ahora funciona como escena de fin de minijuego
 * fusionando la antigua VictoryScene y el menu de botones.
 */

export default class PostMinigameMenu extends MenuBase {

  constructor() {
    super('PostMinigameMenu');
  }

  init(data) {
    //asumimos q nunca es secreta, si lo es se sobreescribe
    this.secreta=false;
    this.result = data?.result || 'defeat';
    this.difficulty = data?.difficulty || 'FACIL';
    this.minijuego = data?.minijuego;
    this.jeroglificoId = data?.jeroglificoId
    this.options = data?.options || {};
    this.secreta=data.secreta;
    // Para minijuegos con varios intentos, si vienen en data
    this.remainingTries = data?.remainingTries;
  }

  create() {
    console.log(">>> PostMinigameMenu dificultad =", this.difficulty);

    super.create(); // Inicializa InputManager y ESC

    const { width, height } = this.sys.game.config;

    // Fondo translucido
    this.add.rectangle(0, 0, width, height, 0x3D2A0F, 1).setOrigin(0);

    // Mensaje principal
    const titleText = this.result === 'victory' ? '¡Victoria!' : '¡Derrota!';
    const titleColor = this.result === 'victory' ? '#d8ad36ff' : '#f58c35ff';

    this.add.text(width / 2, height / 2 - 180, titleText, {
      fontFamily: 'Filgaia',
      fontSize: '36px',
      color: titleColor,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    //============RECOMPENSAS=================
    if (this.result === 'victory') {
      //Comprueba si es la sala secreta
      if(!this.secreta){
        //AÑADIR EL JEROGLÍFICO GANADO
        const esNuevo = addJeroglifico(this.jeroglificoId);

        //MOSTRAR EL JEROGLÍFICO OBTENIDO
        this.showJeroglifico(esNuevo);
      }
      else{
        let contadorAded=0;
        let contaJero=JEROGLIFICOS_DATA.length;
        const nuevos=[];
        while(contadorAded<3&&contaJero>0){
          if(!hasJeroglifico(contaJero)){
            addJeroglifico(contaJero);
            contadorAded=contadorAded+1;
          }
          contaJero=contaJero-1;
        }
      }

      // Sonido victoria
      this.sound.play ("victory");
    }

    if (this.result = 'defeat') {
      if(this.secreta){
        let contadorAded=0;
        let contaJero=1;
        const nuevos=[];
        while(contadorAded<5&&contaJero<JEROGLIFICOS_DATA.length){
          if(hasJeroglifico(contaJero)){
           deleteUltimoJeroglifico(contaJero);
            contadorAded=contadorAded+1;
          }
          contaJero=contaJero+11;
        }
      }
      
      //this.sound.play("defeat");
    }

    // Intentos restantes para minijuegos como SlideBar
    if (this.remainingTries !== undefined && this.remainingTries > 0 && this.result === 'defeat') {
      this.sound.play("defeat");
      this.add.text(width / 2, height / 2 - 100,
        `Intentos restantes: ${this.remainingTries}`,
        { fontFamily: 'Filgaia', fontSize: '22px', color: '#ffffff' }
      ).setOrigin(0.5);
    }

    //===========BOTONES==========
    this.createMenuButtons();
  }

  showJeroglifico(esNuevo) {
    const { width, height } = this.sys.game.config;

    // Buscar datos del jeroglífico
    const jero = JEROGLIFICOS_DATA.find(j => j.id === this.jeroglificoId);

    if (!jero) {
      console.error(`❌ Jeroglífico ${this.jeroglificoId} no encontrado`);
      return;
    }

    // Texto
    const texto = esNuevo ? '¡Nuevo jeroglífico obtenido!' : 'Jeroglífico obtenido';
    const color = esNuevo ? '#FFD700' : '#CCCCCC';

    this.add.text(width / 2, height / 2 - 80, texto, {
      fontFamily: 'Filgaia',
      fontSize: '24px',
      color: color,
      fontStyle: 'bold'
    }).setOrigin(0.5);

    if (!esNuevo) {
      this.add.text(width / 2, height / 2 - 50, '(Ya lo tenías)', {
        fontFamily: 'Filgaia',
        fontSize: '18px',
        color: '#999999'
      }).setOrigin(0.5);
    }

    // Imagen del jeroglífico
    this.add.image(width / 2, height / 2 + 20, jero.simbolo)
      .setScale(0.4);

    // Letra
    this.add.text(width / 2, height / 2 + 90, `"${jero.letra}"`, {
      fontFamily: 'Filgaia',
      fontSize: '28px',
      color: '#e6c480',
      fontStyle: 'bold'
    }).setOrigin(0.5);
  }

  createMenuButtons() {
    const { width, height } = this.sys.game.config;
    const centerY = height / 2 + 150;

    const entries = Object.entries(this.options);
    const spacing = 300;
    const totalWidth = (entries.length - 1) * spacing;
    const startX = width / 2 - totalWidth / 2;

    entries.forEach(([label, callback], i) => {
      const x = startX + i * spacing;
      this.createButton(
        label,
        x,
        centerY,
        () => {
          this.sound.play("click");
          callback();
        },
        { width: 250, height: 60, hoverTint: 0xffaa00, fontSize: '28px', fontFamily: 'Filgaia' },
        'fondoBoton'
      );
    });
  }

  onEscape() {
    this.scene.stop();
    this.scene.start('MapScene');
  }
}