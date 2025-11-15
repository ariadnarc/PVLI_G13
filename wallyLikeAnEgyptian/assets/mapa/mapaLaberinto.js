export default class MapaLaberinto {
  constructor() {
    this.ancho = 50;
    this.alto = 50;
    this.tileSize = 32;
    this.tiles = [
[43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43],
[43,4,5,6,4,5,6,4,5,6,4,5,6,4,5,6,4,5,6,6,43,43,43,9,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,4,5,6,4,43],
[43,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,43,43,43,22,8,43,43,43,43,43,43,43,43,1,2,3,7,8,9,1,2,3,7,8,9,22,22,22,22,43],
[43,22,22,22,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,6,22,22,3,8,9,7,1,2,3,43,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,43],
[43,22,22,22,7,8,9,7,8,9,7,8,9,7,8,9,7,8,9,7,8,9,22,22,22,22,22,22,22,22,22,22,2,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,43],
[43,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,43,43,43],
[43,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,43,43,43,43,43,22,22,22,22,43,43,43],
[43,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,1,43,43,43,43,43,43,43,43,43,43,43],
[43,43,43,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,43,43,43,43,22,22,7,8,9,43,43,43,43,43,43,43,43],
[43,43,43,43,43,43,43,43,43,43,22,22,22,22,22,22,43,22,22,22,22,22,22,22,43,43,43,43,43,22,22,22,22,1,43,43,43,22,22,22,22,22,1,7,8,9,7,8,9,43],
[43,7,8,9,7,8,9,8,9,43,43,43,22,22,22,22,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,22,22,22,43,43,43,43,22,22,22,22,22,22,22,22,22,22,22,43],
[43,22,22,22,22,22,22,22,22,43,43,43,22,22,22,22,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,22,22,22,43,43,43,43,22,22,22,22,22,22,22,22,22,22,22,43],
[43,22,22,22,22,22,22,22,22,9,43,43,22,22,22,22,43,43,43,43,43,43,43,43,43,43,43,43,43,43,8,22,22,22,7,43,43,43,22,22,43,43,22,22,22,22,22,22,22,43],
[43,43,22,22,43,43,43,22,22,22,43,43,22,22,22,22,43,43,43,4,5,6,4,5,6,5,6,43,43,8,22,22,22,22,22,8,43,6,22,22,43,43,43,43,43,43,43,43,43,43],
[43,43,43,22,43,43,43,22,22,22,9,43,22,22,22,22,43,43,43,22,22,22,22,22,22,22,22,2,3,22,22,22,22,22,22,22,7,22,22,43,43,43,43,43,43,43,43,43,43,43],
[43,43,43,43,43,43,43,22,22,22,22,43,22,22,22,22,43,43,43,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,43,43,43,43,7,8,9,1,2,3,43],
[43,43,43,43,1,2,3,22,22,22,22,43,22,22,22,22,43,43,43,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,6,43,43,43,22,22,22,22,22,22,43],
[43,43,43,6,22,22,22,22,22,22,22,43,22,22,22,22,43,43,8,22,22,43,43,22,22,22,43,43,22,22,22,22,22,22,22,22,22,22,22,22,1,43,43,43,22,22,22,22,22,43],
[43,43,6,22,22,22,22,22,22,22,22,43,22,22,22,22,43,43,22,22,22,43,43,43,22,22,43,43,22,22,22,22,22,22,22,22,43,43,43,22,22,43,43,2,22,22,22,22,22,43],
[43,43,22,22,22,43,43,43,43,22,22,6,22,22,22,22,8,43,22,22,22,43,43,43,22,22,43,43,43,22,22,22,22,22,22,43,43,43,43,43,43,43,7,22,22,22,22,43,43,43],
[43,43,22,22,22,43,43,43,43,22,22,22,22,22,22,22,22,43,43,22,22,3,43,43,22,22,43,43,43,22,22,22,22,22,43,43,43,43,43,2,3,4,22,22,43,43,43,43,43,43],
[43,43,22,22,22,43,43,43,43,22,22,22,22,22,22,22,22,8,43,22,22,22,43,43,22,22,43,43,43,43,22,22,43,43,43,43,43,43,6,22,22,22,22,22,43,43,43,43,43,43],
[43,43,22,22,22,43,43,43,43,22,22,22,43,43,22,22,22,22,43,22,22,22,43,43,22,22,3,43,43,43,43,43,43,43,43,43,43,43,22,22,22,22,22,22,9,2,1,2,43,43],
[43,43,22,22,22,43,43,43,43,43,43,43,43,43,43,22,22,22,43,22,22,22,43,43,22,22,22,3,43,43,43,43,43,43,43,43,43,43,22,22,22,22,22,22,22,22,22,22,7,43],
[43,43,22,22,22,43,43,43,43,43,43,43,43,43,43,22,22,22,43,43,22,22,43,43,22,22,22,22,43,43,7,8,9,9,1,2,1,43,43,22,22,22,22,22,43,43,22,22,22,43],
[43,43,22,22,22,43,43,8,43,43,43,43,43,43,6,22,22,22,43,43,22,22,43,43,22,22,22,43,43,22,22,22,22,22,22,22,22,6,43,22,22,22,22,22,43,43,22,22,22,43],
[43,6,22,22,22,43,43,22,1,2,3,7,8,9,22,22,22,22,43,43,22,22,43,43,22,22,22,43,43,22,22,43,43,43,43,22,22,43,43,43,43,43,22,22,43,43,22,22,22,43],
[43,22,22,22,22,43,43,22,22,22,22,22,22,22,22,22,22,43,43,43,22,22,5,6,22,22,22,43,43,22,22,43,43,7,8,22,22,3,4,1,6,43,22,22,6,43,22,22,43,43],
[43,22,22,22,22,1,2,22,22,22,22,22,22,22,22,43,43,43,8,7,22,22,22,22,22,22,22,43,43,22,22,6,43,22,22,22,22,22,22,22,22,43,22,22,22,43,22,22,43,43],
[43,22,22,22,22,22,22,22,22,22,22,43,43,43,43,43,7,22,22,22,22,22,22,22,22,22,43,43,43,22,22,22,43,22,22,22,22,22,22,22,22,43,22,22,22,43,22,22,43,43],
[43,22,22,22,22,22,22,22,22,22,22,43,43,1,2,3,22,22,22,22,22,22,22,22,22,22,4,5,6,22,22,22,43,22,22,22,22,22,22,22,22,43,43,22,22,43,43,22,43,43],
[43,22,22,22,43,22,22,22,22,22,22,43,43,22,22,22,22,22,22,43,43,43,43,43,22,22,22,22,22,22,22,43,43,22,22,22,22,22,22,22,22,1,43,22,22,43,43,22,43,43],
[43,22,22,22,43,43,22,22,22,22,22,8,7,22,22,43,43,43,43,43,43,43,43,43,43,43,43,22,22,22,22,43,43,22,22,22,22,22,22,22,22,43,43,22,22,43,43,22,43,43],
[43,22,22,22,43,43,22,22,22,22,22,22,22,22,22,5,43,43,43,43,43,43,43,43,43,43,43,43,22,22,22,2,43,43,43,43,22,22,22,22,22,43,6,22,22,43,43,22,43,43],
[43,22,22,22,43,43,22,22,22,22,22,22,22,22,22,22,1,43,43,43,43,43,43,43,43,8,9,43,43,22,22,22,43,43,6,43,43,43,43,43,43,43,22,22,22,43,43,22,43,43],
[43,22,22,43,43,43,43,43,22,22,22,22,22,22,22,22,22,43,43,43,43,43,7,8,9,22,22,43,43,22,22,22,43,6,22,9,3,1,2,6,7,8,22,22,22,43,7,22,43,43],
[43,22,22,43,43,43,43,43,22,22,22,22,22,22,22,22,22,43,43,43,43,43,22,22,22,22,22,2,43,22,22,22,1,22,22,22,22,22,22,22,22,22,22,22,43,43,22,22,7,43],
[43,22,22,43,43,43,8,9,22,22,22,22,22,22,22,22,22,43,4,5,6,4,22,22,22,22,22,22,2,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,43,43,22,22,22,43],
[43,22,22,43,43,43,22,22,22,22,22,22,22,22,22,22,22,43,22,22,22,22,22,22,22,22,22,22,22,22,43,43,43,22,22,22,22,22,22,22,22,22,22,22,43,43,22,22,22,43],
[43,22,22,5,43,43,43,22,22,22,22,22,22,22,22,22,43,43,43,22,22,22,22,43,43,43,43,43,22,22,43,43,43,22,22,22,22,22,43,43,43,43,43,43,43,43,43,22,22,43],
[43,22,22,22,5,43,43,22,22,22,22,43,43,43,43,43,5,43,43,22,22,22,22,43,43,43,43,43,43,43,43,43,43,43,43,22,22,22,4,43,43,43,43,43,43,43,43,22,22,43],
[43,22,22,22,22,43,43,22,22,22,22,43,43,43,43,43,22,43,43,22,22,22,22,43,43,43,9,2,1,1,7,8,43,43,43,22,22,22,22,4,43,43,43,43,43,43,43,22,22,43],
[43,43,43,43,43,43,43,43,22,22,22,43,7,8,9,7,22,43,43,22,22,22,22,43,43,43,22,22,22,22,22,22,7,8,6,22,22,22,22,22,43,43,1,2,3,4,43,22,22,43],
[43,43,43,43,43,43,43,43,22,22,43,43,22,22,22,22,22,43,43,22,22,22,43,43,43,43,43,43,43,22,22,22,22,22,22,22,22,22,22,22,7,43,22,22,22,43,43,22,22,43],
[43,43,43,43,43,43,43,43,22,22,43,43,22,22,43,43,43,43,43,22,22,22,43,43,43,43,43,43,43,43,22,22,22,22,22,22,22,22,22,22,22,43,22,22,22,43,43,22,22,43],
[43,43,43,43,43,43,43,43,22,22,43,43,22,22,43,43,43,43,43,22,22,22,43,43,9,1,2,2,7,8,22,22,22,22,22,43,43,22,22,22,22,7,22,22,22,4,43,22,22,43],
[43,43,8,9,8,7,8,9,22,22,43,43,43,22,1,2,3,8,9,22,22,22,5,6,22,22,22,22,22,22,22,22,22,43,43,43,43,22,22,22,22,22,22,22,22,22,7,22,22,43],
[43,43,22,22,22,22,22,22,22,22,5,43,43,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,43,43,43,43,22,22,22,22,22,22,22,22,22,22,22,22,43],
[43,43,22,22,22,22,22,22,22,22,22,43,43,22,22,43,43,43,43,43,43,43,43,22,22,22,22,22,43,43,43,43,43,43,43,43,43,43,22,22,22,43,43,43,43,43,43,43,43,43],
[43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43]
];
    this.colisiones = [
[true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
[true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,true],
[true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false,false,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true],
[true,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true],
[true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true],
[true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true],
[true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,false,false,false,false,true,true,true],
[true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true],
[true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,false,false,false,false,false,true,true,true,true,true,true,true,true],
[true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,true,false,false,false,false,false,false,false,true,true,true,true,true,false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,true],
[true,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,true],
[true,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,true],
[true,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,true,true,true,false,false,true,true,false,false,false,false,false,false,false,true],
[true,true,false,false,true,true,true,false,false,false,true,true,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,true,false,false,false,true,true,true,true,true,true,true,true,true,true],
[true,true,true,false,true,true,true,false,false,false,false,true,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true],
[true,true,true,true,true,true,true,false,false,false,false,true,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,false,false,false,false,false,false,true],
[true,true,true,true,false,false,false,false,false,false,false,true,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,false,true],
[true,true,true,false,false,false,false,false,false,false,false,true,false,false,false,false,true,true,false,false,false,true,true,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,true],
[true,true,false,false,false,false,false,false,false,false,false,true,false,false,false,false,true,true,false,false,false,true,true,true,false,false,true,true,false,false,false,false,false,false,false,false,true,true,true,false,false,true,true,false,false,false,false,false,false,true],
[true,true,false,false,false,true,true,true,true,false,false,false,false,false,false,false,false,true,false,false,false,true,true,true,false,false,true,true,false,false,false,false,false,false,false,true,true,true,true,true,true,true,false,false,false,false,false,true,true,true],
[true,true,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,true,true,false,false,false,true,true,false,false,true,true,false,false,false,false,false,false,true,true,true,true,true,false,false,false,false,false,true,true,true,true,true,true],
[true,true,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,true,false,false,false,true,true,false,false,true,true,true,false,false,false,true,true,true,true,true,true,false,false,false,false,false,false,true,true,true,true,true,true],
[true,true,false,false,false,true,true,true,false,false,false,false,true,true,false,false,false,false,true,false,false,false,true,true,false,false,false,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,true,true],
[true,true,false,false,false,true,true,true,true,true,true,true,true,true,true,false,false,false,true,false,false,false,true,true,false,false,false,false,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,true],
[true,true,false,false,false,true,true,true,true,true,true,true,true,true,true,false,false,false,true,true,false,false,true,true,false,false,false,false,true,true,false,false,false,false,false,false,false,false,true,false,false,false,false,false,true,true,false,false,false,true],
[true,true,false,false,false,true,true,false,true,true,true,true,true,true,false,false,false,false,true,true,false,false,true,true,false,false,false,true,true,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,true,true,false,false,false,true],
[true,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,true,true,false,false,false,true,true,false,false,true,true,true,true,false,false,true,true,true,true,true,false,false,true,true,false,false,false,true],
[true,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,true,true,false,false,true,true,false,false,false,false,false,false,false,false,true,false,false,false,true,false,false,true,true],
[true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,true,true,false,false,false,true,false,false,false,false,false,false,false,false,true,false,false,false,true,false,false,true,true],
[true,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,true,false,false,false,false,false,false,false,false,true,false,false,false,true,false,false,true,true],
[true,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,true,true,false,false,true,true,false,true,true],
[true,false,false,false,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,true,true,true,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,true,false,false,true,true,false,true,true],
[true,false,false,false,true,true,false,false,false,false,false,false,false,false,false,true,true,false,true,true,true,true,true,true,true,true,true,false,false,false,false,true,true,false,false,false,false,false,false,false,false,true,true,false,false,true,true,false,true,true],
[true,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,false,true,false,false,false,true,true,false,true,true],
[true,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,false,false,true,true,false,false,false,true,true,false,true,true,true,true,true,true,true,false,false,false,true,true,false,true,true],
[true,false,false,true,true,true,true,true,false,false,false,false,false,false,false,false,false,true,true,true,true,true,false,false,false,false,false,true,true,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,true,true],
[true,false,false,true,true,true,true,true,false,false,false,false,false,false,false,false,false,true,true,true,true,true,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,true],
[true,false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,true],
[true,false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,true],
[true,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,true,true,true,true,true,false,false,true,true,true,false,false,false,false,false,true,true,true,true,true,true,true,true,true,false,false,true],
[true,false,false,false,false,true,true,false,false,false,false,true,true,true,true,true,false,true,true,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,true,true,true,true,true,true,true,true,false,false,true],
[true,false,false,false,false,true,true,false,false,false,false,true,true,true,true,true,false,true,true,false,false,false,false,true,true,true,false,false,false,false,false,false,true,true,true,false,false,false,false,false,true,true,true,true,true,true,true,false,false,true],
[true,true,true,true,true,true,true,true,false,false,false,true,false,false,false,false,false,true,true,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,true,false,false,true],
[true,true,true,true,true,true,true,true,false,false,true,true,false,false,false,false,false,true,true,false,false,false,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,true,true,false,false,true],
[true,true,true,true,true,true,true,true,false,false,true,true,false,false,true,true,true,true,true,false,false,false,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,true,true,false,false,true],
[true,true,true,true,true,true,true,true,false,false,true,true,false,false,true,true,true,true,true,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,true,false,false,true],
[true,true,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,true],
[true,true,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,true],
[true,true,false,false,false,false,false,false,false,false,false,true,true,false,false,true,true,true,true,true,true,true,true,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,false,false,false,true,true,true,true,true,true,true,true,true],
[true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true]
];
  }

  render(scene) {
    for (let y = 0; y < this.alto; y++) {
      for (let x = 0; x < this.ancho; x++) {
        const valor = this.tiles[y][x];
        if (valor > 0) {
            let textureKey;

        // --- Determinar el tipo según el valor ---
        if (valor >= 1 && valor <= 9) textureKey = 'pared_' + valor;
        else if (valor === 22) textureKey = 'suelo_22';
        else if (valor === 43) textureKey = 'techo_43';
        else continue;
          scene.add.image(
            x * this.tileSize + this.tileSize / 2,
            y * this.tileSize + this.tileSize / 2,
            textureKey
          ).setOrigin(0,0);
        }
      }
    }
  }

  hayColision(x, y) {
    if (y < 0 || y >= this.alto || x < 0 || x >= this.ancho) return true;
    return this.colisiones[y][x];
  }
}
