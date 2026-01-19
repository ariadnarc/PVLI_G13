/**
 * JSDOC
 * YA
 * A
 */

// Inicializar estado global
if (!window.gameState) {
  window.gameState = {
    playerPos: { x: 450, y: 610 },
    jeroglificosObtenidos: [], // Array de IDs: [1, 3, 5, ...]
    minijuegosCompletados: {
      SlideBar: false,
      PuzzleLights: false,
      Undertale: false,
      CrocoShoot: false,
      LockPick: false,
    }
  };
}

export const playerInitialData = {
  posInicial: { x: 450, y: 610 },
  speed: 200,
  spriteName: 'player',
  scale: 1.25,
  
  get jeroglificosObtenidos() {
    return window.gameState.jeroglificosObtenidos;
  },
  //Guardamos que jeroglificos tiene el jugador
  jeroglificosNota:{
      A:false, 
      E: false, 
      N: false, 
      S: false,
      I: false, 
      U: false, 
      C: false, 
      T: false, 
      R: false,
      Q: false, 
      M: false, 
      P: false, 
      O: false, 
      B: false, 
      L: false

  },

  minijuegosCompletados: { // Control de si es la primera vez en los minijuegos
    SlideBar: false,
    PuzzleLights: false,
    Undertale: false,
    CrocoShoot: false,
    LockPick: false,
  }
};

// Función para añadir un jeroglífico
export function addJeroglifico(jeroglificoId) {
  if (!window.gameState.jeroglificosObtenidos.includes(jeroglificoId)) {
    window.gameState.jeroglificosObtenidos.push(jeroglificoId);
    console.log(`Jeroglífico ${jeroglificoId} añadido. Total: ${window.gameState.jeroglificosObtenidos.length}/15`);
    return true; // Devuelve true si es nuevo
  }
  return false; 
}

//Función para verificar si tienes un jeroglífico
export function hasJeroglifico(jeroglificoId) {
  return window.gameState.jeroglificosObtenidos.includes(jeroglificoId);
}

//Función para resetear (útil para testing)
export function resetJeroglificos() {
  window.gameState.jeroglificosObtenidos = [];
  console.log('Jeroglíficos reseteados');
}
