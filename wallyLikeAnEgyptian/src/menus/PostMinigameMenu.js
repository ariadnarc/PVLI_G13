/**
 * @file PostMinigameMenu.js
 * @class PostMinigameMenu
 * @extends MenuBase
 * @description
 * Menú de fin de minijuego.
 * Funciona como escena final unificada que reemplaza a la antigua VictoryScene
 * y al menú de botones posterior.
 * Muestra el resultado (victoria o derrota), gestiona recompensas o penalizaciones
 * de jeroglíficos y presenta las opciones de navegación posteriores.
 */

import MenuBase from './MenuBase.js';
import { JEROGLIFICOS_DATA } from '../config/JeroglificosData.js';
import { addJeroglifico, hasJeroglifico, deleteUltimoJeroglifico } from '../config/PlayerData.js';

/**
 * Escena de post-minijuego.
 * Gestiona el resultado del minijuego, recompensas, penalizaciones
 * y las opciones disponibles tras finalizarlo.
 */
export default class PostMinigameMenu extends MenuBase {

  /**
   * Crea la escena del menú post-minijuego.
   */
  constructor() {
    super('PostMinigameMenu');
  }

  /**
   * Inicializa los datos del menú según el resultado del minijuego.
   * @param {Object} data
   * @param {'victory'|'defeat'} data.result - Resultado del minijuego
   * @param {string} data.difficulty - Dificultad del minijuego
   * @param {string} data.minijuego - Nombre del minijuego
   * @param {number} data.jeroglificoId - ID del jeroglífico asociado al minijuego
   * @param {Object} data.options - Opciones de botones del menú
   * @param {boolean} data.secreta - Indica si el minijuego pertenece a la sala secreta
   * @param {number} [data.remainingTries] - Intentos restantes (si aplica)
   */
  init(data) {
    this.menuConfig = data || {};
    this.secreta=false;

    this.result = data?.result || 'defeat';
    this.difficulty = data?.difficulty || 'FACIL';
    this.minijuego = data?.minijuego;
    this.jeroglificoId = data?.jeroglificoId
    this.options = data?.options || {};
    this.secreta=data.secreta;

    // Para minijuegos con múltiples intentos
    this.remainingTries = data?.remainingTries;
  }

  /**
   * Crea la escena visual del menú post-minijuego,
   * muestra el resultado, aplica recompensas o penalizaciones
   * y genera los botones disponibles.
   */
  create() {
    super.create(); // Inicializa InputManager y ESC

    this.soundManager = this.registry.get('soundManager');

    const { width, height } = this.sys.game.config;

    // Fondo 
    this.add.rectangle(0, 0, width, height, 0x3D2A0F, 1).setOrigin(0);

    // Título
    const titleText = this.result === 'victory' ? '¡Victoria!' : '¡Derrota!';
    const titleColor = this.result === 'victory' ? '#d8ad36ff' : '#f58c35ff';

    this.add.text(width / 2, height / 2 - 180, titleText, {
      fontFamily: 'Filgaia',
      fontSize: '36px',
      color: titleColor,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    //=== RECOMPENSAS / PENALIZACIONES ===
    if (this.result === 'victory') {

      if(!this.secreta){
        // Añadir jeroglífico individual
        const esNuevo = addJeroglifico(this.jeroglificoId);
        this.showJeroglifico(esNuevo);
      } else {
        // Sala secreta: añadir varios jeroglíficos
        let contadorAded=0;
        let contaJero=JEROGLIFICOS_DATA.length;
        const nuevos=[];

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

      this.soundManager.play('victory');
    }

    else if (this.result === 'defeat') {

      if(this.secreta){
        // Sala secreta: eliminar jeroglíficos
        let contadorAded=0;
        let contaJero=1;
        const eliminados=[];
        
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

    // Intentos restantes
    if (
      this.remainingTries !== undefined && 
      this.remainingTries > 0 && 
      this.result === 'defeat'
    ) {
      this.soundManager.play('defeat');
      this.add.text(width / 2, height / 2 - 120,
        `Intentos restantes: ${this.remainingTries}`,
        { fontFamily: 'Filgaia', fontSize: '22px', color: '#ffffff' }
      ).setOrigin(0.5);
    }

    // Botones
    this.createMenuButtons();
  }

  /**
   * Muestra un único jeroglífico obtenido tras un minijuego.
   * @param {boolean} esNuevo - Indica si el jeroglífico es nuevo
   */
  showJeroglifico(esNuevo) {
    const { width, height } = this.sys.game.config;

    if (!this.jeroglificoId) {
      console.error(`PostMinigameMenu: no hay jeroglificoId para mostrar`);
      return;
    }

    const jero = JEROGLIFICOS_DATA.find(j => j.id === this.jeroglificoId);

    if (!jero) {
      console.error(`Jeroglífico ${this.jeroglificoId} no encontrado`);
      return;
    }

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

    this.add.image(width / 2, height / 2 + 20, jero.simbolo)
      .setScale(0.4);

    this.add.text(width / 2, height / 2 + 90, `"${jero.letra}"`, {
      fontFamily: 'Filgaia',
      fontSize: '28px',
      color: '#e6c480',
      fontStyle: 'bold'
    }).setOrigin(0.5);
  }
  
  /**
   * Muestra múltiples jeroglíficos ganados o perdidos
   * en el contexto de la sala secreta.
   * @param {number[]} jeros - IDs de los jeroglíficos
   */
  showJeroglificos(jeros){
    const { width, height } = this.sys.game.config;

    if (!Array.isArray(jeros) || jeros.length === 0) return;

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

  /**
   * Crea los botones del menú post-minijuego
   * según las opciones proporcionadas.
   */
  createMenuButtons() {
    const { width, height } = this.sys.game.config;
    const centerY = height / 2 + 150;

    this.soundManager = this.registry.get('soundManager');

    const entries = Object.entries(this.options);
    const spacing = 300;
    const totalWidth = entries.length > 0 ? (entries.length - 1) * spacing : 0;
    const startX = width / 2 - totalWidth / 2;

    if (entries.length === 0) {
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

  /**
   * Maneja la pulsación de ESC.
   * Si existe escena padre, vuelve a ella;
   * en caso contrario, regresa al mapa.
   */
  onEscape() {
    if (this.menuConfig?.parentScene) {
      super.onEscape();
    } else {
      this.scene.stop();
      this.scene.start('MapScene');
  }
}
}