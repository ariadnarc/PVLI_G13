/**
 * JSDOC
 * YA
 * A
 */

export const playerInitialData = {

  posInicial: { x: 450, y: 610 }, // pos en el mapa
  speed: 200, // vel player
  spriteName: 'player', // nombre del asset
  scale: 1.25,
  glyphs: { // Guardamos el progreso general del jugador
    S: 0,
    A: 0,
    B: 0
  },

  minijuegosCompletados: { // Control de si es la primera vez en los minijuegos
    SlideBar: false,
    PuzzleLights: false,
    Undertale: false,
    CrocoShoot: false,
    LockPick: false,
  }
};
