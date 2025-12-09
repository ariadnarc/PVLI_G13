import { playerInitialData } from '../config/PlayerData.js';
import { COSTES_DIFICULTAD, NOMBRES_MINIJUEGOS, DIFICULTADES } from '../config/MinigameData.js';
import InputManager from '../core/InputManager.js';
import MenuBase from '../menus/MenuBase.js';

export default class SelectDifficultyScene extends MenuBase {

  constructor() {
    super('SelectDifficultyScene');
  }

  init(data) {

    // Minijuego que se va a jugar
    this.minijuego = data.minijuego;
    this.nombreMinijuego = NOMBRES_MINIJUEGOS[this.minijuego];
    
    // Flag para saber si venimos de reintento (en principio solo pal slide)
    this.reintento = data.reintento || false;
    this.remainingTries = data.remainingTries ?? null; // null si no hay valor
  }

  create() {
    super.create(); //esto es lo q inicializa el input por heredar de menubase

    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    const { width, height } = this.sys.game.config;

    // === FONDO ===
    const bg = this.add.image(width / 2, height / 2, 'selectdiffBG');
    bg.setDisplaySize(width, height);
    bg.setDepth(-10);

    // === Título ===
    this.add.text(centerX, 90, this.nombreMinijuego, {
      fontFamily: 'Filgaia',
      fontSize: '48px',
      color: '#634830ff',
      align: 'left',
    }).setOrigin(0.5);

    this.add.text(centerX / 2.25, 300, 'Selecciona la dificultad', {
      fontFamily: 'Filgaia',
      fontSize: '24px',
      color: '#ffd98d',
    }).setOrigin(0.5);

    // === Mostrar inventario actual ===
    this.jeroglificosTexto = this.add.text(
      centerX / 2.25,
      350,
      `Tus jeroglíficos: S:${playerInitialData.glyphs.S}  A:${playerInitialData.glyphs.A}  B:${playerInitialData.glyphs.B}`,
      { fontFamily: 'Filgaia',fontSize: '20px', color: '#ffffff' }
    ).setOrigin(0.5);

    // === Dificultades ===
    const dificultades = ['FACIL', 'MEDIA', 'DIFICIL'];
    const colores = [0xa46a3b, 0x8b5326, 0x774224];

    dificultades.forEach((dif, i) => {
      const y = 240 + i * 120;

      //coste de cada dificultad
      const costeTexto = this.getCosteTexto(dif);
      this.add.text(800, y + 45, costeTexto, {
        fontFamily: "Filgaia",
        fontSize: "18px",
        color: "#ddd",
      }).setOrigin(0.5);
      
      this.createButton(
        dif,
        800,
        y,
        () => this.seleccionarDificultad(dif),
        {
          width: 200,
          height: 60,
          fontFamily: "Filgaia",
          fontSize: "25px",
          hoverTint: 0xffb679,
        }, 'fondoBoton'
      );
    });

  }

  getCosteTexto(dif) {
    const c = COSTES_DIFICULTAD[dif];
    if (c.S + c.A + c.B === 0) return 'Gratis';
    return `Coste: ${c.S} S , ${c.A} A , ${c.B} B`;
  }

  seleccionarDificultad(dif) {
    const esPrimeraVez = !playerInitialData.minijuegosCompletados[this.minijuego];
    const coste = COSTES_DIFICULTAD[dif];

    // Restriccion dificultad dificil la primera vez
    if (esPrimeraVez && dif === 'DIFICIL') {
      this.mensaje.setText('La dificultad difícil se desbloquea después de jugar una vez.');
      return;
    }

    // Verificar jeroglificos
    if (!this.tieneJeroglificos(coste)) {
      this.mensaje.setText('No tienes suficientes jeroglíficos.');
      return;
    }

    this.pagarJeroglificos(coste);
    this.jeroglificosTexto.setText(
      `Jeroglíficos: S:${playerInitialData.glyphs.S}  A:${playerInitialData.glyphs.A}  B:${playerInitialData.glyphs.B}`
    );

    playerInitialData.minijuegosCompletados[this.minijuego] = true;

    // Lanzar minijuego
    // Si venimos de reintento y es SlideBar, pasamos remainingTries
    const params = {
      dificultad: dif,
      minijuego: this.minijuego
    };

    if (this.reintento && this.minijuego === 'SlideBar') {
      params.remainingTries = this.remainingTries; // mantenemos los intentos restantes
    }

    this.scene.start(this.minijuego, params);
  }

  tieneJeroglificos(coste) {
    return (
      playerInitialData.glyphs.S >= coste.S &&
      playerInitialData.glyphs.A >= coste.A &&
      playerInitialData.glyphs.B >= coste.B
    );
  }

  pagarJeroglificos(coste) {
    playerInitialData.glyphs.S -= coste.S;
    playerInitialData.glyphs.A -= coste.A;
    playerInitialData.glyphs.B -= coste.B;
  }
}
