import { DIFICULTADES } from '../config/MinigameData.js';
import InputManager from '../core/InputManager.js';


export default class SlideBar extends Phaser.Scene{

    constructor(){
        super('SlideBar');
    }

    init(data){
        // Guardamos el minijuego y la dificultad que vienen del menu
        this.minijuego = data.minijuego || 'SlideBar';
        // Dificultad elegida por el jugador
        this.difficulty = data.dificultad || 'FACIL';
    }

    create(){

        //==============INPUT===============
        this.inputManager = new InputManager(this);
        this.inputManager.configure({
            cursors: false,
            keys: ['ESC', 'SPACE']
        });
        
        //=======Parametros segun dificultad=======
        const config = DIFICULTADES[this.difficulty].minijuegos.SlideBar;
        this.tries = config.intentos;
        this.barSpeed = config.velocidadBarra;

        //======BARRA, ZONA VERDE Y CURSOR===========
        const w = this.scale.width;
        const h = this.scale.height;

        // Barra
        this.barWidth = 500;
        this.barHeight = 20;
        this.bar = this.add.rectangle(w/2, h/2, this.barWidth, this.barHeight, 0x444444);

        // Zona verde (acierto)
        this.greenWidth = 120;
        this.greenZone = this.add.rectangle(w/2, h/2, this.greenWidth, this.barHeight, 0x00ff00);

        // Cursor
        this.cursor = this.add.rectangle(w/2 - this.barWidth/2, h/2, 10, 40, 0xffffff );
        this.cursorSpeed = this.barSpeed; 
        this.direction = 1; // 1 = derecha, -1 = izquierda

        //==========HUD=============
        this.hud = this.add.text(20, 20, "", {
            fontSize: "24px",
            color: "#ffffff"
        });

        this.updateHUD();
    }

    update(){

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
        if(this.inputManager.keys['SPACE'] && this.inputManager.keys['SPACE'].isDown)
        {
            this.checkHit();
        }
    }

    //=====COMPRUEBA ACIERTO=========
    checkHit(){
        const cursorBounds = this.cursor.getBounds();
        const greenBounds = this.greenZone.getBounds();

        const acierto = Phaser.Geom.Intersects.RectangleToRectangle(cursorBounds, greenBounds);

        if(acierto){
            console.log("¡ACIERTO!");
            this.endGame(true); // termina el juego con victoria
        } else {
            console.log("FALLASTE");
            this.tries--;
            if(this.tries <= 0){
                this.endGame(false); // termina el juego con derrota
            } else{
                this.updateHUD(); // actualizamos los intentos restantes
            }
        }
    }


    updateHUD() {
        this.hud.setText(
            `Precisión del Escriba\nIntentos restantes: ${this.tries}`
        );
    }

    //======TERMINA MINIJUEGO=========
    endGame(victoria) {

        const menuOptions = {
        'Reintentar': () => {
            //Al reintentar vamos a selectdifficultyscene
            this.scene.stop('PostMinigameMenu');
            this.scene.stop();
            this.scene.stop('SelectDifficultyScene'); 

            this.scene.start('SelectDifficultyScene', { minijuego: this.minijuego, reintento: true });
        },
        'Salir al mapa': () => {
            this.scene.stop('PostMinigameMenu');
            this.scene.stop();
            this.scene.start('MapScene');
        }
        };

        this.scene.start('PostMinigameMenu', {
            result: victoria ? 'victory' : 'defeat', // si ganó o perdió
            difficulty: this.difficulty,            // dificultad actual
            minigameId: this.minijuego,                 // id del minijuego
            options: menuOptions                     // botones del menú
        });
    };


}