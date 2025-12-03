import { objectInitialData } from '../config/ObjectsData.js';

export default class MovingObject {
  constructor(scene,player) {

    this.scene = scene;
    
    this.data=objectInitialData;

    this.sprite = scene.physics.add.sprite(this.data.posInicial.x, this.data.posInicial.y, this.data.spriteName);
    this.sprite.setScale(this.data.scale);

    this.player=player;
  }
   
  hayCollisionObject(){
        this.physics.add.collider(this.PlayerManager, this.sprite, ()=> {
            return true;
        });
        return false;
  }
  update(){
    if(this.hayCollisionObject){
      const dirObjX=posX-player.posX;
      const dirObjY=posY-player.posY;
      body.setVelocity(dir.x * this.speed, dir.y * this.speed);
    }
    else{
      body.setVelocity(0,0);
    }
  }
}

