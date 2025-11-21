export const NOMBRES_MINIJUEGOS = {
  Undertale: "Furia del Desierto",
  puzzleLights: "Memoria del Templo"
}

export const DIFICULTADES = {
  FACIL: {
    nombre: "Iniciado del Templo",
    multiplicadorPuntuacion: 1.0,
    minijuegos: {
      // minijuego de patrones
      puzzleLights: {
        vidas: 3,
        rondas: [3, 3, 4],
        velocidad: 900, // ms entre luces
      },
      // minijuego de esquivar
      Undertale: {
        tiempo: 5,
        delayMisiles: 1000,
        velocidadMisiles: { min: 80, max: 150 },
      }
    },
    probJeroglificos: { S: 0.05, A: 0.15, B: 0.80 }
  },

  MEDIA: {
    nombre: "Aspirante a Escriba",
    multiplicadorPuntuacion: 1.5,
    minijuegos: {
      puzzleLights: {
        vidas: 2,
        rondas: [3, 4, 5],
        velocidad: 700,
      },
      Undertale: {
        tiempo: 8,
        delayMisiles: 700,
        velocidadMisiles: { min: 120, max: 180 },
      }
    },
    probJeroglificos: { S: 0.10, A: 0.25, B: 0.65 }
  },

  DIFICIL: {
    nombre: "Guardían de los Secretos",
    multiplicadorPuntuacion: 2.0,
    minijuegos: {
      puzzleLights: {
        vidas: 1,
        rondas: [4, 5, 6],
        velocidad: 500,
      },
      Undertale: {
        tiempo: 10,
        delayMisiles: 500,
        velocidadMisiles: { min: 150, max: 220 },
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
    easy: { count: 1 },
    medium: { count: 2 },
    hard: { count: 3 }
  }
};

