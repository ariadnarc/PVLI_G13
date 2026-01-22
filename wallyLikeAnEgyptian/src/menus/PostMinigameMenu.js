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
    this.menuConfig = data || {};
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

    this.soundManager = this.registry.get('soundManager');

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
        //busca 3 jeroglificos de mayor tier q el player no tenga
        //y los añade
        while(contadorAded<3&&contaJero>0){
          if(!hasJeroglifico(contaJero)){
            addJeroglifico(contaJero);
            contadorAded++;
            nuevos.push(contaJero);
          }
          contaJero--;
        }
        this.showJeroglificos(nuevos);
      }

      // Sonido victoria
      this.soundManager.play('victory');
    }

    else if (this.result === 'defeat') {
      if(this.secreta){
        let contadorAded=0;
        let contaJero=1;
        const eliminados=[];
        //busca 5 jeroglificos de menor tier en los q tiene el player 
        //y los elimina
        while(contadorAded<5&&contaJero<JEROGLIFICOS_DATA.length){
          if(hasJeroglifico(contaJero)){
           deleteUltimoJeroglifico(contaJero);
           eliminados.push(contaJero);
            contadorAded=contadorAded+1;
          }
          contaJero += 11;
        }
        this.showJeroglificos(eliminados);
      }      
      this.soundManager.play('defeat');
    }

    // Intentos restantes para minijuegos como SlideBar
    if (this.remainingTries !== undefined && this.remainingTries > 0 && this.result === 'defeat') {
      this.soundManager.play('defeat');
      this.add.text(width / 2, height / 2 - 120,
        `Intentos restantes: ${this.remainingTries}`,
        { fontFamily: 'Filgaia', fontSize: '22px', color: '#ffffff' }
      ).setOrigin(0.5);
    }

    //===========BOTONES==========
    this.createMenuButtons();
  }

  showJeroglifico(esNuevo) {
    const { width, height } = this.sys.game.config;

    if (!this.jeroglificoId) {
      console.error(`PostMinigameMenu: no hay jeroglificoId para mostrar`);
      return;
    }

    // Buscar datos del jeroglífico
    const jero = JEROGLIFICOS_DATA.find(j => j.id === this.jeroglificoId);

    if (!jero) {
      console.error(`Jeroglífico ${this.jeroglificoId} no encontrado`);
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
  //enseña los jeroglificos (perdidos o ganados) en la sala secreta
  showJeroglificos(jeros){
    const { width, height } = this.sys.game.config;
    if (!Array.isArray(jeros) || jeros.length === 0) {
      // nada que mostrar
      return;
    }

    // Texto
    const texto = this.result == 'victory' ? '¡Nuevos jeroglíficos obtenidos!' : 'Jeroglíficos quitados T_T';
    const color = this.result == 'victory' ? '#FFD700' : '#440000ff';

    this.add.text(width / 2, height / 2 - 80, texto, {
      fontFamily: 'Filgaia',
      fontSize: '24px',
      color: color,
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const cols = Math.min(3, jeros.length);
    const spacingX = 160;
    const spacingY = 140;
    const startX = width / 2 - ((cols - 1) * spacingX) / 2;
    const startY = height / 2 - 10;

    jeros.forEach((jeroglificoId, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);

      const x = startX + col * spacingX;
      const y = startY + row * spacingY;

      const data = JEROGLIFICOS_DATA.find(j => j.id === jeroglificoId);
      if (!data) {
        console.warn(`Jeroglífico ${jeroglificoId} no encontrado`);
        return;
      }

      this.add.image(x, y, data.simbolo).setScale(0.5);
      this.add.text(x, y + 60, `"${data.letra}"`, {
        fontFamily: 'Filgaia',
        fontSize: '22px',
        color: '#e6c480',
        fontStyle: 'bold'
      }).setOrigin(0.5);
    });

  }
  createMenuButtons() {
    const { width, height } = this.sys.game.config;
    const centerY = height / 2 + 150;

    this.soundManager = this.registry.get('soundManager');

    const entries = Object.entries(this.options);
    const spacing = 300;
    const totalWidth = entries.length > 0 ? (entries.length - 1) * spacing : 0;
    const startX = width / 2 - totalWidth / 2;

    if (entries.length === 0) {
      // Si no hay opciones pasadas, ponemos una opción por defecto: "Volver al mapa"
      this.createButton('Volver', width / 2, centerY, () => {
        this.soundManager?.play('click');
        this.scene.start('MapScene');
      }, { width: 300, height: 60, hoverTint: 0xffaa00, fontSize: '26px' }, 'fondoBoton');
      return;
    }

    entries.forEach(([label, callback], i) => {
      const x = startX + i * spacing;
      this.createButton(
        label,
        x,
        centerY,
        () => {
          this.soundManager.play("click");
          callback();
        },
        { width: 250, height: 60, hoverTint: 0xffaa00, fontSize: '28px', fontFamily: 'Filgaia' },
        'fondoBoton'
      );
    });
  }

  onEscape() {
    if (this.menuConfig?.parentScene) {
      super.onEscape();
    } else {
      // por defecto volver al mapa
      this.scene.stop();
      this.scene.start('MapScene');
  }
}
}