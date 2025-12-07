import { playerInitialData } from '../config/PlayerData.js';
import { COSTES_DIFICULTAD, NOMBRES_MINIJUEGOS } from '../config/MinigameData.js';
import InputManager from '../core/InputManager.js';

export default class SelectDifficultyScene extends Phaser.Scene {

  constructor() {
    super('SelectDifficultyScene');
  }

  init(data) {

    // Minijuego que se va a jugar
    this.minijuego = data.minijuego;
    this.nombreMinijuego = NOMBRES_MINIJUEGOS[this.minijuego];
    
    // Flag para saber si venimos de reintento
    this.reintento = data.reintento || false;
  }

  create() {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    const { width, height } = this.sys.game.config;

    // === Instancia del InputManager ===
    this.inputManager = new InputManager(this);
    this.inputManager.configure({
        mouse: true,
        keys: ['ESC']
    });

    // === FONDO ===
    const bg = this.add.image(width / 2, height / 2, 'selectdiffBG');
    bg.setDisplaySize(width, height);
    bg.setDepth(-10);

    // === Título ===
    this.add.text(centerX / 2.25, 90, this.nombreMinijuego, {
      fontFamily: 'Comfortaa',
      fontSize: '48px',
      color: '#634830ff',
      align: 'left',
    }).setOrigin(0.5);

    this.add.text(centerX / 2.25, 150, 'Selecciona la dificultad', {
      fontFamily: 'Comfortaa',
      fontSize: '24px',
      color: '#ffd98d',
    }).setOrigin(0.5);

    // === Mostrar inventario actual ===
    this.jeroglificosTexto = this.add.text(
      centerX / 2.25,
      200,
      `Tus jeroglíficos: S:${playerInitialData.glyphs.S}  A:${playerInitialData.glyphs.A}  B:${playerInitialData.glyphs.B}`,
      { fontSize: '20px', color: '#ffffff' }
    ).setOrigin(0.5);

    // === Dificultades ===
    const dificultades = ['FACIL', 'MEDIA', 'DIFICIL'];
    const colores = [0xa46a3b, 0x8b5326, 0x774224];

    dificultades.forEach((dif, i) => {
      const y = 220 + i * 120;

      // Crear fondo del botón
      const rect = this.add.rectangle(0, 0, 250, 60, colores[i]).setOrigin(0.5);

      // Texto dentro del botón
      const txt = this.add.text(0, 0, dif, {
        fontSize: '22px',
        color: '#ddd',
        fontStyle: 'bold',
      }).setOrigin(0.5);

      // Crear un CONTENEDOR que será tu botón real
      const button = this.add.container(800, y, [rect, txt]);
      // Darle tamaño para interacciones
      button.setSize(250, 60);

      const hoverColor = 0xc88853;
      const defaultColor = colores[i];
      const hoverScale = 1.10;

      // Hover
      button.on('pointerover', () => {
        rect.setFillStyle(hoverColor);
        button.setScale(hoverScale);
      });

      button.on('pointerout', () => {
        rect.setFillStyle(defaultColor);
        button.setScale(1);
      });

      // Texto abajo (el coste)
      const costeTexto = this.getCosteTexto(dif);
      this.add.text(800, y + 50, costeTexto, {
        fontSize: '18px',
        color: '#ddd',
        fontStyle: 'bold',
      }).setOrigin(0.5);

      // Registrar SOLO el container como botón en el InputManager
      this.inputManager.registerButton(button, () => this.seleccionarDificultad(dif));
    });

  }

  getCosteTexto(dif) {
    const c = COSTES_DIFICULTAD[dif];
    if (c.S + c.A + c.B === 0) return 'Gratis';
    return `Coste: ${c.S} S | ${c.A} A | ${c.B} B`;
  }

  seleccionarDificultad(dif) {
    const esPrimeraVez = !playerInitialData.minijuegosCompletados[this.minijuego];

    // Bloquear difícil solo si es primera vez Y NO venimos de reintento
    if (!this.reintento && esPrimeraVez && dif === 'DIFICIL') {
        this.mensaje.setText('La dificultad difícil se desbloquea después de jugar una vez.');
        return;
    }

    const coste = COSTES_DIFICULTAD[dif];

    // Verificar si tiene recursos
    if (!this.tieneJeroglificos(coste)) {
      this.mensaje.setText('No tienes suficientes jeroglíficos.');
      return;
    }

    // Restar el coste
    this.pagarJeroglificos(coste);

    //Actualizar texto en pantalla
    this.jeroglificosTexto.setText(
      `Jeroglíficos: S:${playerInitialData.glyphs.S}  A:${playerInitialData.glyphs.A}  B:${playerInitialData.glyphs.B}`
    );

    // Marcar progreso solo si no es reintento
    if (!this.reintento) playerInitialData.minijuegosCompletados[this.minijuego] = true;

    // Lanzar minijuego con la dificultad seleccionada
    this.scene.start(this.minijuego, { dificultad: dif });
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
