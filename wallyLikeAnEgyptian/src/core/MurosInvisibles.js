 export default class MurosInvisibles{
    constructor(scene,x,y,requiredGlyphs,PlayerManager){
        this.scene=scene;
        this.x=x;
        this.y=y;
        this.requiredGlyphs=requiredGlyphs;
        this.PlayerManager=PlayerManager;

        this.wall=this.scene.physics.add.staticSprite(x,y,null);
        this.wall.setSize(60,10);
        this.wall.setVisible(false);
            
        // Collider con el jugador
        this.scene.physics.add.collider(this.PlayerManager.sprite, this.wall, (playerSprite, wallSprite) => {
            const glyphs = this.PlayerManager.data.glyphs;

            // Comprobar si tiene suficientes jeroglíficos
            const hasEnough = (!this.requiredGlyphs.S || glyphs.S >= this.requiredGlyphs.S) &&
                            (!this.requiredGlyphs.A || glyphs.A >= this.requiredGlyphs.A) &&
                            (!this.requiredGlyphs.B || glyphs.B >= this.requiredGlyphs.B);

            if (!hasEnough) {
                // Bloquear paso
                this.PlayerManager.sprite.setVelocity(0, 0);
                //escribimos texto con info
                /*const centerX = this.scene.cameras.main.centerX;
                const centerY = this.scene.cameras.main.centerY;
                this.infoText = this.scene.add.text(centerX, centerY+150, `No tienes jeroglíficos suficientes: ${JSON.stringify(this.requiredGlyphs)}`, {
                    fontFamily: 'Filgaia',
                    fontSize: '20px',
                    color: '#2d1a00ff'
            }).setOrigin(0.5);
                */
            } else {
                // Desactivar la pared para dejar pasar
                wallSprite.disableBody(true, false);
            }
    });
    }
    /*
    update(){
        if (!this.infoText) return; // nada que eliminar

        const playerRect = this.PlayerManager.sprite.getBounds();
        const wallRect = this.wall.getBounds();

        if (!Phaser.Geom.Intersects.RectangleToRectangle(playerRect, wallRect)){
            this.infoText.destroy();
            this.infoText = null;
            this.playerBlocked = false;
        }   
    }*/
    }