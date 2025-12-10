import { objectInitialData } from '../config/ObjectsData.js';

export default class MovingObject {
  constructor(scene,player,colisiones) {
    
    this.scene = scene;
    
    this.data=objectInitialData;

    this.sprite = scene.physics.add.sprite(this.data.posInicial.x, this.data.posInicial.y, this.data.spriteName);
    this.sprite.setScale(this.data.scale);

    this.sprite.setCollideWorldBounds(true);
    this.speed = this.data.speed || 200;
    this.colisiones=colisiones;
    this.player=player;

    this.dirX = 0;
    this.dirY = 0;
    this.colliding=false;
    this.pared=false;
    this.sprite.body.slideFactor.set(0, 0);

    this.sprite.body.setImmovable(false); 
    this.sprite.body.pushable = true;
    //colisiones
    scene.physics.add.collider(player.sprite, this.sprite, ()=> {
            this.colliding= true;
        });
    
     scene.physics.add.collider(colisiones, this.sprite, ()=> {
            this.setVelocity(0,0);
        });
  }

/*  update(){
  
    const pared=this.scene.physics.add.overlap(this.sprite,this.colisiones);
    const empujado=this.scene.physics.overlap(this.sprite,this.player.sprite);
    if(empujado){
      //da valor de direccion del player o 0 para evitar undefined
      this.dirX=this.player.dirX ||0;
      this.dirY=this.player.dirY ||0;
      body.setVelocity( this.dirX*this.speed,this.dirY*this.speed);
      console.log("IF");
     }
    else if(pared){
      body.setVelocity(0,0);
       console.log("ELSE");
    }
    else{

    }
      
    console.log("colision pared:",this.pared);
    console.log("colision player:",this.colliding);
  }
    */
}



