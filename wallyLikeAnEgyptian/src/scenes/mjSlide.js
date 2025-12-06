import { DIFICULTADES } from '../config/MinigameData.js';
import InputManager from '../core/InputManager.js';


export default class SlideBar extends Phaser.Scene{

    constructor(){
        super('SlideBar');
    }

    create(data){

        //==============INPUT===============
        this.inputManager = new InputManager(this);
        this.inputManager.configure({
            cursors: false,
            keys: ['ESC', 'SPACE']
        });
        
        

        
        //=======Parametros segun dificultad=======
        const config = DIFICULTADES[data.dificultad].minijuegos.SlideBar;

        this.tries = config.intentos;                    //num de intentos permitidos
        this.barSpeed = config.velocidadBarra;          //velocidad del target

        //======BARRA, ZONA VERDE Y CURSOR===========
        const w = this.scale.width;
        const h = this.scale.height;

        // Barra
        this.barWidth = 500;
        this.barHeight = 20;

        this.bar = this.add.rectangle(w/2, h/2, this.barWidth, this.barHeight, 0x444444);

        // Zona verde (acierto)
        this.greenWidth = 120;
        this.greenZone = this.add.rectangle(
            w/2,
            h/2,
            this.greenWidth,
            this.barHeight,
            0x00ff00
        );

        // Cursor
        this.cursor = this.add.rectangle(
            w/2 - this.barWidth/2,
            h/2,
            10,
            40,
            0xffffff
        );

        this.cursorSpeed = this.barSpeed; 
        this.direction = 1; // 1 = derecha, -1 = izquierda

        //==========HUD=============
        this.hud = this.add.text(20, 20, "", {
            fontSize: "24px",
            color: "#ffffff"
        });

        this.updateHUD();


        //INICIAR JUEGO
        this.startGame();
    }

    update(time, delta){

        this.inputManager.update();

        // Movimiento del cursor
        const dt = this.game.loop.delta / 1000;
        let nextX = this.cursor.x + this.direction * this.cursorSpeed * dt;
        const left = this.bar.x - this.barWidth/2;
        const right = this.bar.x + this.barWidth/2;

        if(nextX <= left || nextX >= right){
            this.direction *= -1; // cambia de dirección al llegar a los bordes
        } else {
            this.cursor.x = nextX;
        }

// Pulsar SPACE para comprobar acierto
if(this.inputManager.keys['SPACE'] && this.inputManager.keys['SPACE'].isDown){
    this.checkHit();
}
    }

    //=====INICIO DEL MINIJUEGO========
    startGame(){
        
        //TO DO: animaciones de entrada y sonidos

    }

    //=====COMPRUEBA ACIERTO=========
    checkHit(){
        const cursorBounds = this.cursor.getBounds();
        const greenBounds = this.greenZone.getBounds();

        const acierto = Phaser.Geom.Intersects.RectangleToRectangle(cursorBounds, greenBounds);

        if(acierto){
            console.log("¡ACIERTO!");
            this.endGame(true);
        } else {
            console.log("FALLASTE");
            this.tries--;
            if(this.tries <= 0){
                this.endGame(false);
            }
        }
    }

    //========SI FALLA==========
    intentoFallido(){
        this.tries--;

        if (this.tries <= 0) {
            this.endGame(false);
        } else {
            this.updateHUD();
        }

    }

    //======TERMINA MINIJUEGO=========
    endGame(victoria) {

        if(victoria){
            this.scene.stop(); // Detiene esta escena
            this.scene.launch('VictoryScene');
        }
        else{
            this.physics.pause(); // Detiene todas las físicas del juego
            this.time.delayedCall(1000, () => this.scene.restart(), [], this); // Reinicia escena después de 2 segundos
        }
    }

    updateHUD() {
        this.hud.setText(
            `Precisión del Escriba\nIntentos restantes: ${this.tries}`
        );
    }


}