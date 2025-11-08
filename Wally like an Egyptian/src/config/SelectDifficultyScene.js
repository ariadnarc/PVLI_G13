import { playerData } from './PlayerData.js';
import { COSTES_DIFICULTAD } from './DifficultyConfig.js';

export default class SelectDifficultyScene extends Phaser.Scene {
  constructor() {
    super('SelectDifficultyScene');
  }

  init(data) {
    this.minijuego = data.minijuego; // ej: 'puzzleLights' o 'dodgeMissiles'
  }

  create() {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    this.add.text(centerX, 100, 'Selecciona la dificultad', {
      fontSize: '24px',
      color: '#ffff99'
    }).setOrigin(0.5);

    // Mostrar inventario actual
    this.add.text(centerX, 140, 
      `Jeroglíficos: S:${playerData.jeroglificos.S}  A:${playerData.jeroglificos.A}  B:${playerData.jeroglificos.B}`, 
      { fontSize: '16px', color: '#ffffff' }
    ).setOrigin(0.5);

    const dificultades = ['FACIL', 'MEDIA', 'DIFICIL'];
    const colores = [0x44ff44, 0xffff66, 0xff4444];

    dificultades.forEach((dif, i) => {
      const y = 220 + i * 100;
      const button = this.add.rectangle(centerX, y, 250, 60, colores[i])
        .setInteractive()
        .setOrigin(0.5);

      this.add.text(centerX, y, dif, { fontSize: '20px', color: '#000' }).setOrigin(0.5);

      // Mostrar coste si aplica
      const coste = COSTES_DIFICULTAD[dif];
      const costeTexto = this.getCosteTexto(dif);
      this.add.text(centerX, y + 35, costeTexto, { fontSize: '14px', color: '#ddd' }).setOrigin(0.5);

      button.on('pointerdown', () => this.seleccionarDificultad(dif));
    });

    this.mensaje = this.add.text(centerX, 500, '', { fontSize: '16px', color: '#ff9999' }).setOrigin(0.5);
  }

  getCosteTexto(dif) {
    const c = COSTES_DIFICULTAD[dif];
    if (c.S + c.A + c.B === 0) return 'Gratis';
    return `Coste: ${c.S} S | ${c.A} A | ${c.B} B`;
  }

  seleccionarDificultad(dif) {
    const esPrimeraVez = !playerData.minijuegosCompletados[this.minijuego];
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
    playerData.minijuegosCompletados[this.minijuego] = true;

    // Lanzar minijuego con la dificultad seleccionada
    this.scene.start(this.minijuego, { dificultad: dif });
  }

  tieneJeroglificos(coste) {
    return (
      playerData.jeroglificos.S >= coste.S &&
      playerData.jeroglificos.A >= coste.A &&
      playerData.jeroglificos.B >= coste.B
    );
  }

  pagarJeroglificos(coste) {
    playerData.jeroglificos.S -= coste.S;
    playerData.jeroglificos.A -= coste.A;
    playerData.jeroglificos.B -= coste.B;
  }
}
