export const playerInitialData = {

  /* TODO: 
      - Añadir pos initial y otras variables del Player aquí
      - Crear un Json para toda la info inicial desde donde se lea
  */
  posInicial: { x: 400, y: 300}, // pos en el mapa
  speed: 200, // vel player
  spriteName: 'playerSprite', // nombre del asset
  glyphs: { // Guardamos el progreso general del jugador
    S: 0,
    A: 0,
    B: 0
  },
  
  minijuegosCompletados: { // Control de si es la primera vez en los minijuegos
    puzzleLights: false,
    dodgeMissiles: false
  }
};
