/**
 * @file jeroglificosData.js
 * @description
 * Contiene la información de los jeroglíficos del juego:
 * - Relación entre símbolo visual, letra y ID
 * - Disposición de los jeroglíficos en la nota
 * - Mapa de acceso rápido por ID
 */

/**
 * @typedef {Object} Jeroglifico
 * @property {number} id - Identificador único del jeroglífico.
 * @property {string} simbolo - Nombre del sprite del jeroglífico.
 * @property {string} letra - Letra que representa en la traducción.
 */

/**
 * Lista principal de jeroglíficos disponibles en el juego.
 * Cada jeroglífico representa una letra usada para descifrar la nota.
 * @type {Jeroglifico[]}
 */

export const JEROGLIFICOS_DATA = [
  { id: 1, simbolo: 'uraeus', letra: 'S' },
  { id: 2, simbolo: 'ankh', letra: 'E' },
  { id: 3, simbolo: 'scarab', letra: 'A' },
  { id: 4, simbolo: 'sun', letra: 'R' },
  { id: 5, simbolo: 'ba', letra: 'I' },

  { id: 6, simbolo: 'djed', letra: 'U' },
  { id: 7, simbolo: 'lotus', letra: 'B' },
  { id: 8, simbolo: 'cobra', letra: 'L' },
  { id: 9, simbolo: 'reed', letra: 'O' },
  { id: 10, simbolo: 'owl', letra: 'P' },
  
  { id: 11, simbolo: 'water', letra: 'M' },
  { id: 12, simbolo: 'bread', letra: 'T' },
  { id: 13, simbolo: 'rope', letra: 'C' },
  { id: 14, simbolo: 'hand', letra: 'N' },
  { id: 15, simbolo: 'foot', letra: 'Q' },
];

/**
 * Matriz que define la disposición de los jeroglíficos en la nota del juego.
 * 
 * - Cada número corresponde al ID de un jeroglífico.
 * - El valor 0 representa un espacio vacío.
 * - Se recorre por filas para construir visualmente la nota.
 * 
 * @type {number[][]}
 */
export const JEROGLIFICOS_NOTA_DATA=[
  [0,0,0,1,5,0,0,0,0,15,6,5,2,4,2,1,0],
  [0,0,0,0,2,14,13,9,14,12,4,3,4,11,2,0,0],
  [10,4,5,11,2,4,9,0,0,0,0,1,6,7,2,0,0],
  [0,0,8,3,1,0,0,0,2,1,13,3,8,2,4,3,1]
];

/**
 * Mapa de acceso rápido a los jeroglíficos usando su ID como clave.
 * Evita recorrer el array completo al buscar un jeroglífico concreto.
 * 
 * @type {Object.<number, Jeroglifico>}
 */
export const MAPA_JEROGLIFICOS = Object.fromEntries(
  JEROGLIFICOS_DATA.map(j => [j.id, j])
);
