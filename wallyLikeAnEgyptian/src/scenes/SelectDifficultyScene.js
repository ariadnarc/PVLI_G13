import { playerInitialData } from '../config/PlayerData.js';
import { COSTES_DIFICULTAD } from '../config/MinigameData.js';
import InputManager from '../core/InputManager.js';

export default class SelectDifficultyScene extends Phaser.Scene {
  constructor() {
    super('SelectDifficultyScene');
  }

  init(data) {
    this.minijuego = data.minijuego; // ej: 'puzzleLights' o 'dodgeMissiles'
    this.nombreMinijuego = data.nombreMinijuego;
  }

  create() {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // === Instancia del InputManager ===
    this.inputManager = InputManager.getInstance(this);
    this.inputManager.configureInputs({
        mouse: true,
        keys: ['ESC']
    });

    // === Título ===
    this.add.text(centerX, 100, this.nombreMinijuego, {
      fontSize: '48px',
      color: '#b07b0fff',
    }).setOrigin(0.5);

    this.add.text(centerX, 200, 'Selecciona la dificultad', {
      fontSize: '24px',
      color: '#ffff99',
    }).setOrigin(0.5);

    // === Mostrar inventario actual ===
    this.add.text(
      centerX,
      240,
      `Jeroglíficos: S:${playerInitialData.jeroglificos.S}  A:${playerInitialData.jeroglificos.A}  B:${playerInitialData.jeroglificos.B}`,
      { fontSize: '16px', color: '#ffffff' }
    ).setOrigin(0.5);

    // === Dificultades ===
    const dificultades = ['FACIL', 'MEDIA', 'DIFICIL'];
    const colores = [0x44ff44, 0xffff66, 0xff4444];

    dificultades.forEach((dif, i) => {
      const y = 320 + i * 100;

      // Crear fondo del botón
      const rect = this.add.rectangle(0, 0, 250, 60, colores[i]).setOrigin(0.5);

      // Texto dentro del botón
      const txt = this.add.text(0, 0, dif, {
        fontSize: '20px',
        color: '#000'
      }).setOrigin(0.5);

      // Crear un CONTENEDOR que será tu botón real
      const button = this.add.container(centerX, y, [rect, txt]);

      // Darle tamaño para interacciones
      button.setSize(250, 60);

      const hoverColor = 0xf5e29a;
      const defaultColor = colores[i];
      const hoverScale = 1.12;

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
      this.add.text(centerX, y + 50, costeTexto, {
        fontSize: '14px',
        color: '#ddd'
      }).setOrigin(0.5);

      // Registrar SOLO el container como botón
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
    const coste = COSTES_DIFICULTAD[dif];

    // Si es primera vez, solo permite fácil o media sin coste
    if (esPrimeraVez && dif === 'DIFICIL') {
      this.mensaje.setText('La dificultad difícil se desbloquea después de jugar una vez.');
      return;
    }

    // Verificar si tiene recursos
    if (!this.tieneJeroglificos(coste)) {
      this.mensaje.setText('No tienes suficientes jeroglíficos.');
      return;
    }

    // Restar el coste
    this.pagarJeroglificos(coste);

    // Marcar progreso
    playerInitialData.minijuegosCompletados[this.minijuego] = true;

    // Lanzar minijuego con la dificultad seleccionada
    this.scene.start(this.minijuego, { dificultad: dif });
  }

  tieneJeroglificos(coste) {
    return (
      playerInitialData.jeroglificos.S >= coste.S &&
      playerInitialData.jeroglificos.A >= coste.A &&
      playerInitialData.jeroglificos.B >= coste.B
    );
  }

  pagarJeroglificos(coste) {
    playerInitialData.jeroglificos.S -= coste.S;
    playerInitialData.jeroglificos.A -= coste.A;
    playerInitialData.jeroglificos.B -= coste.B;
  }
}
