

export default class MovingObject {
  constructor(scene,player,colisiones,data) {
    
    this.scene = scene;
    
    this.sprite = scene.physics.add.sprite(data.posInicial.x, data.posInicial.y, data.spriteName);
    this.sprite.setScale(data.scale);

    this.speed = data.speed;
    this.colisiones=colisiones;
    this.player=player;

    this.dirX = 0;
    this.dirY = 0;
    this.colliding=false;
    this.pared=false;
    this.sprite.body.slideFactor.set(1, 1);
    this.sprite.setDrag(1500, 1500); 
    this.sprite.setMaxVelocity(60, 60);

    this.sprite.body.setImmovable(false); 
    this.sprite.body.pushable = true;
    this.isPushed=false;
    this.colPared=false;
    //colisiones
    scene.physics.add.collider(player.sprite, this.sprite, ()=> {
            this.isPushed=true;
        });
    
     scene.physics.add.collider(colisiones, this.sprite, ()=> {
          this.colPared=true;
        });
  }

   update(){
  
    if(this.isPushed&&!this.colPared){
      this.sprite.body.velocity.x += this.player.sprite.body.velocity.x * this.speed;
      this.sprite.body.velocity.y += this.player.sprite.body.velocity.y * this.speed;

     }
      const mx = this.sprite.body.maxVelocity ? this.sprite.body.maxVelocity.x : 50;
      const my = this.sprite.body.maxVelocity ? this.sprite.body.maxVelocity.y : 50;

      if (Math.abs(this.sprite.body.velocity.x) > mx) {
        this.sprite.body.velocity.x = mx * Math.sign(this.sprite.body.velocity.x);
      }
      if (Math.abs(this.sprite.body.velocity.y) > my) {
        this.sprite.body.velocity.y = my * Math.sign(this.sprite.body.velocity.y);
      }
      

  }
}
