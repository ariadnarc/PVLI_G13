import { objectInitialData } from '../config/ObjectsData.js';

export default class MovingObject {
  constructor(scene) {

    this.scene = scene;
    
    this.data=objectInitialData;

    this.sprite = scene.physics.add.sprite(this.data.posInicial.x, this.data.posInicial.y, this.data.spriteName);
    this.sprite.setScale(this.data.scale);

  }
    movimientoColision(player){
        const dirObjX=posX-player.posX;
        const dirObjY=posY-player.posY;
        const mag=Math.sqrt(dirObjX*dirObjX+dirObjY*dirObjY);
        if(mag==0) return;

        this.setVelocity((dirObjX/mag)*this.speed,(dirObjY/mag)*this.speed);

  }
}
