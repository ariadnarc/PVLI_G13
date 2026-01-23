/**
 * @file objectsData.js
 * @description
 * Define la posición inicial de los objetos movibles del mapa.
 * Estos objetos actúan como cajas que el jugador puede empujar
 * para resolver pequeños obstáculos o puzzles de entorno.
 */

/**
 * @typedef {Object} MovableObjectData
 * @property {{ x: number, y: number }} posInicial - Posición inicial del objeto en el mapa.
 */

/**
 * Lista de objetos movibles del escenario.
 * Cada objeto se instancia como una caja física interactuable.
 * 
 * @type {MovableObjectData[]}
 */
export const objectsData = [
  { posInicial: { x: 320, y: 200 } },
  { posInicial: { x: 350, y: 200 } },
  { posInicial: { x: 1190, y: 90 } },
  { posInicial: { x: 1190, y: 130 } },
  { posInicial: { x: 1230, y: 130 } },
  { posInicial: { x: 1260, y: 130 } },
  { posInicial: { x: 1260, y: 90 } },
  { posInicial: { x: 890, y: 700 } }
]
  

