/**
 * JSDOC
 * YA
 * A
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
//matriz de como se disponen los jeroglificos en la nota
export const JEROGLIFICOS_NOTA_DATA=[
  [0,0,0,1,5,0,0,0,0,15,6,5,2,4,2,1,0],
  [0,0,0,0,2,14,13,9,14,12,4,3,4,11,2,0,0],
  [10,4,5,11,2,4,9,0,0,0,0,1,6,7,2,0,0],
  [0,0,8,3,1,0,0,0,2,1,13,3,8,2,4,3,1]
];
//Busqueda de la letra por el id
export const MAPA_JEROGLIFICOS = Object.fromEntries(
  JEROGLIFICOS_DATA.map(j => [j.id, j])
);
