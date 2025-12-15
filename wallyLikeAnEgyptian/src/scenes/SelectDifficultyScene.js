/**
 * JSDOC
 * YA
 * A
 */

import { playerInitialData } from '../config/PlayerData.js';
import { COSTES_DIFICULTAD, NOMBRES_MINIJUEGOS } from '../config/MinigameData.js';
import MenuBase from '../menus/MenuBase.js';

export default class SelectDifficultyScene extends MenuBase {

  constructor() {
    super('SelectDifficultyScene');
  }

  init(data) {
    this.minijuego = data.minijuego;
    this.nombreMinijuego = NOMBRES_MINIJUEGOS[this.minijuego];

    this.reintento = data.reintento || false;
    this.remainingTries = data.remainingTries ?? null;
  }

  create() {
    super.create();

    const centerX = this.cameras.main.centerX;
    const { width, height } = this.sys.game.config;

    // === Fondo ===
    const bg = this.add.image(width / 2, height / 2, 'selectdiffBG');
    bg.setDisplaySize(width, height);
    bg.setDepth(-10);

    // === Título ===
    this.add.text(centerX, 90, this.nombreMinijuego, {
      fontFamily: 'Filgaia',
      fontSize: '48px',
      color: '#634830ff',
    }).setOrigin(0.5);

    this.add.text(centerX / 2.25, 300, 'Selecciona la dificultad', {
      fontFamily: 'Filgaia',
      fontSize: '24px',
      color: '#ffd98d',
    }).setOrigin(0.5);

    // === Inventario jugador ===
    this.jeroglificosTexto = this.add.text(
      centerX / 2.25,
      350,
      `Tus jeroglíficos: S:${playerInitialData.glyphs.S}  A:${playerInitialData.glyphs.A}  B:${playerInitialData.glyphs.B}`,
      { fontFamily: 'Filgaia', fontSize: '20px', color: '#ffffff' }
    ).setOrigin(0.5);

    // === Botones de dificultad ===
    const dificultades = ['FACIL', 'MEDIA', 'DIFICIL'];

    dificultades.forEach((dif, i) => {
      const y = 240 + i * 120;

      // Img de candado
      if (dif === 'DIFICIL' && !playerInitialData.minijuegosCompletados[this.minijuego]) {
        // Img de candado
        const lock = this.add.image(650, y, 'lock').setDisplaySize(70, 70);   // tamaño del candado
      }

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
        () => {
          this.sound.play("click");
          this.seleccionarDificultad(dif);
        },
        {
          width: 200,
          height: 60,
          fontFamily: "Filgaia",
          fontSize: "25px",
          hoverTint: 0xffb679,
        },
        "fondoBoton"
      );

    });

    this.createVolverButton();
  }

  getCosteTexto(dif) {
    const esPrimeraVez = !playerInitialData.minijuegosCompletados[this.minijuego];
    const c = COSTES_DIFICULTAD[dif];

    // ➤ FACIL y MEDIA son gratis la primera vez
    if (esPrimeraVez && (dif === 'FACIL' || dif === 'MEDIA')) {
      return 'Gratis';
    }

    return `Coste: ${c.S} S , ${c.A} A , ${c.B} B`;
  }

  seleccionarDificultad(dif) {
    const esPrimeraVez = !playerInitialData.minijuegosCompletados[this.minijuego];
    const coste = COSTES_DIFICULTAD[dif];

    // ➤ DIFICIL prohibida primera vez
    if (esPrimeraVez && dif === 'DIFICIL') {
      this.sound.play("locked");

      // Fondo oscuro semitransparente
      const overlay = this.add.rectangle(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        this.cameras.main.width,
        this.cameras.main.height,
        0x000000,
        0.6 // alpha
      );
      overlay.setDepth(1000);

      // Texto del mensaje
      const mensajeText = this.add.text(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        'Modo difícil bloqueado',
        {
          fontFamily: "Filgaia",
          fontSize: "32px",
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 3
        }
      )
        .setOrigin(0.5)
        .setDepth(1001);

      // Desaparecer tras 2 segundos
      this.time.delayedCall(2000, () => {
        overlay.destroy();
        mensajeText.destroy();
      });

      return;
    }

    // ➤ FACIL y MEDIA gratis primera vez
    const dificultadEsGratis =
      esPrimeraVez &&
      (dif === 'FACIL' || dif === 'MEDIA');

    if (!dificultadEsGratis) {
      // Comprobar y pagar normalmente
      if (!this.tieneJeroglificos(coste)) {
        this.sound.play("locked");
        const overlay = this.add.rectangle(
          this.cameras.main.centerX,
          this.cameras.main.centerY,
          this.cameras.main.width,
          this.cameras.main.height,
          0x000000,
          0.6 // alpha
        );
        overlay.setDepth(1000);

        // Texto del mensaje
        const mensajeText = this.add.text(
          this.cameras.main.centerX,
          this.cameras.main.centerY,
          'No tienes suficientes jeroglificos.',
          {
            fontFamily: "Filgaia",
            fontSize: "32px",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 3
          }
        )
          .setOrigin(0.5)
          .setDepth(1001);

        // Desaparecer tras 2 segundos
        this.time.delayedCall(2000, () => {
          overlay.destroy();
          mensajeText.destroy();
        });

        return;
      }

      //Paga jeroglificos pertinentes 
      this.pagarJeroglificos(coste);

      this.jeroglificosTexto.setText(
        `Jeroglíficos: S:${playerInitialData.glyphs.S}  A:${playerInitialData.glyphs.A}  B:${playerInitialData.glyphs.B}`
      );
    }

    // Marcar minijuego como jugado
    playerInitialData.minijuegosCompletados[this.minijuego] = true;

    // Lanzar minijuego
    const params = {
      dificultad: dif,
      minijuego: this.minijuego
    };

    if (this.reintento && this.minijuego === 'SlideBar') {
      params.remainingTries = this.remainingTries;
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

  createVolverButton() {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    const btn = this.add.image(centerX - 350, centerY + 150, "fondoBoton")
      .setOrigin(0.5)
      .setScale(0.75)
      .setInteractive({ useHandCursor: true });

    const btnText = this.add.text(btn.x, btn.y, "Volver al mapa", {
      fontFamily: "Filgaia",
      fontSize: "20px",
      color: '#382f23ff'
    }).setOrigin(0.5);

    btn.on("pointerover", () => {
      btn.setScale(0.85);
      btnText.setColor("#ffffaa");
    });

    btn.on("pointerout", () => {
      btn.setScale(0.75);
      btnText.setColor('#382f23ff');
    });

    btn.on("pointerdown", () => {
      this.scene.start("MapScene");
    });
  }
}
