/**
 * JSDOC
 * YA
 * A
 */

export default class MurosInvisibles {
    constructor(scene, x, y, requiredGlyphs, PlayerManager) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.requiredGlyphs = requiredGlyphs;
        this.PlayerManager = PlayerManager;

        this.wall = this.scene.physics.add.staticSprite(x, y, null);
        this.wall.setSize(60, 10);
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
                if(!this.infoText){
                    this.infoText = this.scene.add.text(this.x, this.y + 100, `No tienes jeroglificos suficientes`, {
                    fontFamily: 'Filgaia',
                    fontSize: '20px',
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
            if (this.infoText) {
                this.infoText.destroy();
                this.infoText = null;
            }
        }
    }
}