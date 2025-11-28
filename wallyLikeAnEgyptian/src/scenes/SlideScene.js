import { DIFICULTADES } from '../config/MinigameData.js';
import InputManager from '../core/InputManager.js';
import PlayerManager from '../core/PlayerManager.js';


export default class SlideScene extends Phaser.scene{

    constructor(){
        super('SlideScene');
    }

    create(data){

        const config = DIFICULTADES[data.dificultad].minijuegos.slideBar;

        this.inputManager = new InputManager(this);
        this.inputManager.configure({
            cursors: false,
            keys: ['ESC', 'SPACE']
        });

        //TO DO: parámetros de dificultad (settear en minigamedata)

        //JUGADOR (en un principio no se va a mover)
        this.playerManager = new PlayerManager(this.inputManager, this);
        this.player = this.playerManager.getSprite();
        this.player.body.setColliderWorldBounds(true);




        //INICIAR JUEGO
        this.startGame();


    }

    update(){
        this.inputManager.update();
        this.playerManager.update();
    }

    startGame(){
        //TO DO: que se inicie el juego

    }




}