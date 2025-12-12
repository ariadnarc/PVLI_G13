/**
 * JSDOC
 * YA
 * A
 */

export const NOMBRES_MINIJUEGOS = {
  SlideBar: "Precision del Escriba",
  Undertale: "Furia del Desierto",
  PuzzleLights: "Memoria del Templo",
  LockPick: "Cerrajero Ancestral",
  CrocoShoot: "Cazador de Reptiles",
}

export const DIFICULTADES = {
  FACIL: {
    nombre: "Iniciado del Templo",
    multiplicadorPuntuacion: 1.0,
    minijuegos: {
      // minijuego de patrones
      PuzzleLights: {
        vidas: 3,
        rondas: [3, 3, 4],
        velocidad: 900, // ms entre luces
      },
      // minijuego de esquivar
      Undertale: {
        vidas: 4,
      },
      //minijuego de barrita
      SlideBar: {
        intentos: 3,
        velocidadBarra: 200,
      },
      // minijuego cerradura
      LockPick: {
        limiteSweet: 13, // Min.: 1, Máx.: 90 (ya que solo hay 180 grados)
        limiteRotacion: 26, // Siempre > que limiteSweet
        tensionSube: 0.1, // 0 - 1
        tensionBaja: 0.04, // 0 - 1
      },
      // minijuego disparar
      CrocoShoot: {
      },
      // minijuego final
    },
    probJeroglificos: { S: 0.05, A: 0.15, B: 0.80 }
  },

  MEDIA: {
    nombre: "Aspirante a Escriba",
    multiplicadorPuntuacion: 1.5,
    minijuegos: {
      PuzzleLights: {
        vidas: 2,
        rondas: [3, 4, 5],
        velocidad: 700,
      },
      Undertale: {
        vidas: 3,
      },
      SlideBar: {
        intentos: 2,
        velocidadBarra: 300,
      },
      LockPick: {
        limiteSweet: 10,
        limiteRotacion: 20,
        tensionSube: 0.25,
        tensionBaja: 0.07,
      },
      CrocoShoot: {
      }
    },
    probJeroglificos: { S: 0.10, A: 0.25, B: 0.65 }
  },

  DIFICIL: {
    nombre: "Guardián de los Secretos",
    multiplicadorPuntuacion: 2.0,
    minijuegos: {
      PuzzleLights: {
        vidas: 1,
        rondas: [4, 5, 6],
        velocidad: 500,
      },
      Undertale: {
        vidas: 2,
      },
      SlideBar: {
        intentos: 1,
        velocidadBarra: 370,
      },
      LockPick: {
        limiteSweet: 6,
        limiteRotacion: 12,
        tensionSube: 0.4,
        tensionBaja: 0.1,
      },
      CrocoShoot: {
      }
    },
    probJeroglificos: { S: 0.25, A: 0.40, B: 0.35 }
  }
};

// determina el coste en jeroglíficos por reintentar minijuegos ya jugados
export const COSTES_DIFICULTAD = {
  FACIL: { S: 0, A: 0, B: 0 },
  MEDIA: { S: 0, A: 1, B: 3 },
  DIFICIL: { S: 1, A: 2, B: 5 }
};

// recompensas minijuegos
export const MINIGAME_REWARDS = {
  rewardSettings: {
    FACIL: { count: 1 },
    MEDIA: { count: 2 },
    DIFICIL: { count: 3 }
  }
};

