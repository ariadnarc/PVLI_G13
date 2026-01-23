/**
 * @file PlayerData.js
 * @description
 * Gestiona el estado global del jugador, su configuración inicial
 * y las funciones auxiliares relacionadas con el progreso
 * (jeroglíficos y minijuegos).
 */

/**
 * Estado global del juego.
 * Se guarda en window para que sea accesible entre escenas.
 */
if (!window.gameState) {
  window.gameState = {
    playerPos: { x: 450, y: 610 },

    /** @type {number[]} IDs de jeroglíficos obtenidos */
    jeroglificosObtenidos: [], 

    /**
     * Controla si cada minijuego ha sido completado al menos una vez
     * @type {Object.<string, boolean>}
     */
    minijuegosCompletados: {
      SlideBar: false,
      PuzzleLights: false,
      Undertale: false,
      CrocoShoot: false,
      LockPick: false,
    }
  };
}

/**
 * @typedef {Object} PlayerInitialData
 * @property {{ x: number, y: number }} posInicial - Posición inicial del jugador.
 * @property {number} speed - Velocidad de movimiento.
 * @property {string} spriteName - Nombre del sprite del jugador.
 * @property {number} scale - Escala visual del sprite.
 * @property {number[]} jeroglificosObtenidos - Jeroglíficos conseguidos (getter).
 * @property {Object.<string, boolean>} minijuegosCompletados - Estado de minijuegos.
 */

/**
 * Configuración inicial del jugador.
 * Parte de los datos se sincronizan con el estado global del juego.
 * 
 * @type {PlayerInitialData}
 */
export const playerInitialData = {
  posInicial: { x: 450, y: 610 },
  speed: 200,
  spriteName: 'player',
  scale: 1.25,
  
  /**
   * Devuelve la lista actual de jeroglíficos obtenidos.
   * @returns {number[]}
   */
  get jeroglificosObtenidos() {
    return window.gameState.jeroglificosObtenidos;
  },

  minijuegosCompletados: { 
    SlideBar: false,
    PuzzleLights: false,
    Undertale: false,
    CrocoShoot: false,
    LockPick: false,
  }
};

/**
 * Añade un jeroglífico al progreso del jugador si no lo tenía.
 * 
 * @param {number} jeroglificoId - ID del jeroglífico.
 * @returns {boolean} True si se añadió, false si ya existía.
 */
export function addJeroglifico(jeroglificoId) {
  if (!window.gameState.jeroglificosObtenidos.includes(jeroglificoId)) {
    window.gameState.jeroglificosObtenidos.push(jeroglificoId);
    console.log(`Jeroglífico ${jeroglificoId} añadido. Total: ${window.gameState.jeroglificosObtenidos.length}/15`);
    return true; 
  }
  return false; 
}

/**
 * Comprueba si el jugador posee un jeroglífico concreto.
 * 
 * @param {number} jeroglificoId - ID del jeroglífico.
 * @returns {boolean}
 */
export function hasJeroglifico(jeroglificoId) {
  return window.gameState.jeroglificosObtenidos.includes(jeroglificoId);
}

/**
 * Resetea todos los jeroglíficos obtenidos.
 * Útil para testing o reinicios de partida.
 */
export function resetJeroglificos() {
  window.gameState.jeroglificosObtenidos = [];
  console.log('Jeroglíficos reseteados');
}

/**
 * Elimina el último jeroglífico obtenido (rollback simple).
 * 
 * @param {number} jeroglificoId - ID esperado a eliminar.
 * @returns {boolean} True si se eliminó, false si no estaba.
 */
export function deleteUltimoJeroglifico(jeroglificoId) {
  if (window.gameState.jeroglificosObtenidos.includes(jeroglificoId)) {
    window.gameState.jeroglificosObtenidos.pop(jeroglificoId);
    console.log(`Jeroglífico ${jeroglificoId} eliminado. Total: ${window.gameState.jeroglificosObtenidos.length}/15`);
    return true; 
  }
  return false;
}

