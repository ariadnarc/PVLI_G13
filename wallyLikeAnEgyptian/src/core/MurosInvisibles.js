/**
 * JSDOC
 * YA
 * A
 */

export default class MurosInvisibles {
    constructor(scene, x, y, requiredGlyphs, PlayerManager,playerData) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.requiredGlyphs = requiredGlyphs;
        this.PlayerManager = PlayerManager;
        this.playerData=playerData;

        this.wall = this.scene.physics.add.staticSprite(x, y, null);
        this.wall.setSize(60, 10);
        this.wall.setVisible(false);

        // Collider con el jugador
        this.scene.physics.add.collider(this.PlayerManager.sprite, this.wall, (playerSprite, wallSprite) => {
            const jeroObtenidos=this.playerData.jeroglificosObtenidos.length;
            // Comprobar si tiene suficientes jeroglíficos
            const jeroRestantes=this.requiredGlyphs-jeroObtenidos;

            if (jeroRestantes>0) {
                // Bloquear paso
                this.PlayerManager.sprite.setVelocity(0, 0);
                //escribimos texto con info
                if(!this.infoText&&!this.infoTextJero){
                    this.infoText = this.scene.add.text(this.x, this.y + 100, `No tienes jeroglificos suficientes`, {
                    fontFamily: 'Filgaia',
                    fontSize: '20px',
                    color: '#d8af75ff',
                    fontStyle: 'bold',
                    stroke: '#33261bff',
                    strokeThickness: 4
                }).setOrigin(0.5);
                //texto con cantidad de jeroglificos que te faltan
                this.infoTextJero = this.scene.add.text(this.x, this.y + 150, `Te faltan `+ jeroRestantes, {
                    fontFamily: 'Filgaia',
                    fontSize: '15px',
                    color: '#d8af75ff',
                    fontStyle: 'bold',
                    stroke: '#33261bff',
                    strokeThickness: 4
                }).setOrigin(0.5);
                }
                
            } else {
                // Desactivar la pared para dejar pasar
                wallSprite.disableBody(true, false);
                this.infoText.destroy();
                this.infoTextJero.destroy();
            }
        });
    }
    
    update(){
         const distance = Phaser.Math.Distance.Between(
            this.PlayerManager.sprite.x,
            this.PlayerManager.sprite.y,
            this.x,
            this.y
        );

        if (distance >50) { // 50 px de tolerancia
            if (this.infoText&&this.infoTextJero) {
                this.infoText.destroy();
                this.infoTextJero.destroy();
                this.infoText = null;
                this.infoTextJero=null;
            }
        }
    }
}