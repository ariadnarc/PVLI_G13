/**
 * @file MinigameData.js
 * @description
 * Configuración global de los minijuegos del juego:
 * - Nombres visibles de cada minijuego
 * - Definición de dificultades
 * - Parámetros específicos por minijuego y dificultad
 */

/**
 * Nombres mostrados al jugador para cada minijuego.
 * La clave debe coincidir con el nombre interno del minijuego.
 * @type {Object.<string, string>}
 */
export const NOMBRES_MINIJUEGOS = {
  SlideBar: "Precision del Escriba",
  Undertale: "Furia del Desierto",
  PuzzleLights: "Memoria del Templo",
  LockPick: "Cerrajero Ancestral",
  CrocoShoot: "Cazador de Reptiles",
  FinalGame: "Buscando a Luigi"
}

/**
 * @typedef {Object} PuzzleLightsConfig
 * @property {number} vidas - Número de errores permitidos.
 * @property {number[]} rondas - Número de luces por ronda.
 * @property {number} velocidad - Tiempo en ms entre luces.
 */

/**
 * @typedef {Object} UndertaleConfig
 * @property {number} vidas - Golpes que el jugador puede recibir.
 */

/**
 * @typedef {Object} SlideBarConfig
 * @property {number} intentos - Intentos disponibles.
 * @property {number} velocidadBarra - Velocidad de movimiento del escarabajo.
 */

/**
 * @typedef {Object} LockPickConfig
 * @property {number} limiteSweet - Margen de error permitido (grados).
 * @property {number} limiteRotacion - Límite máximo de rotación del lockpick.
 * @property {number} tensionSube - Velocidad de aumento de tensión (0–1).
 * @property {number} tensionBaja - Velocidad de reducción de tensión (0–1).
 */

/**
 * @typedef {Object} CrocoShootConfig
 * @property {number} vidas - Intentos disponibles.
 * @property {number} cadencia - Tiempo mínimo entre disparos (ms).
 * @property {number} cantSacamuelas - Disparos necesarios para ganar.
 */

/**
 * @typedef {Object} MinijuegosConfig
 * @property {PuzzleLightsConfig} [PuzzleLights]
 * @property {UndertaleConfig} [Undertale]
 * @property {SlideBarConfig} [SlideBar]
 * @property {LockPickConfig} [LockPick]
 * @property {CrocoShootConfig} [CrocoShoot]
 */

/**
 * @typedef {Object} DificultadConfig
 * @property {string} nombre - Nombre mostrado al jugador.
 * @property {number} multiplicadorPuntuacion - Multiplicador global de puntuación.
 * @property {MinijuegosConfig} minijuegos - Configuración específica por minijuego.
 */

/**
 * Configuración de dificultades del juego.
 * Cada dificultad define parámetros específicos para cada minijuego.
 * 
 * @type {Object.<string, DificultadConfig>}
 */
export const DIFICULTADES = {
  FACIL: {
    nombre: "Iniciado del Templo",
    multiplicadorPuntuacion: 1.0,
    minijuegos: {
      PuzzleLights: {
        vidas: 3,
        rondas: [3, 3, 4],
        velocidad: 900, 
      },
      Undertale: {
        vidas: 4,
      },
      SlideBar: {
        intentos: 3,
        velocidadBarra: 200,
      },
      LockPick: {
        limiteSweet: 13, 
        limiteRotacion: 26, 
        tensionSube: 0.1, 
        tensionBaja: 0.04, 
      },
      CrocoShoot: {
        vidas: 3,
        cadencia: 1450,
        cantSacamuelas: 10,
      },
    },
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
        vidas: 2,
        cadencia: 1650,
        cantSacamuelas: 15,
      }
    },
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
        vidas: 1,
        cadencia: 1800,
        cantSacamuelas: 18,
      }
    },
  }
};

