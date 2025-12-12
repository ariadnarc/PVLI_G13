/**
 * JSDOC
 * YA
 * A
 */

/*
export function resetPlayerGlyphs() { // función del reseteo
  playerInitialData.glyphs.S = 0;
  playerInitialData.glyphs.A = 0;
  playerInitialData.glyphs.B = 0;
}// esto va a ser muy útil, se puede emplear para los minijuegos
*/
export const playerInitialData = {

  /* TODO: 
      - Añadir pos initial y otras variables del Player aquí
      - Crear un Json para toda la info inicial desde donde se lea
  */
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
