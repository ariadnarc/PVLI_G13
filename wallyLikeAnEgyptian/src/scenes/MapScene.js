import PlayerManager from "../core/PlayerManager.js";
import InputManager from "../core/InputManager.js";
import MovingObject from "../core/MovingObject.js";
import { NOMBRES_MINIJUEGOS } from "../config/MinigameData.js";

export default class MapScene extends Phaser.Scene {
    constructor() {
        super('MapScene');
    }
ç
    create() {
        this.inputManager = new InputManager(this);

        // MapScene solo escucha movimiento y tecla ESC
        this.inputManager.configure({
            cursors: true,
            keys: ["ESC", "B"]
        });

        // Keyboard 
        this.inputManager.on("keyDown", (key) => {
            if (key === "ESC") { // Menu pausa
                this.openPauseMenu();
            }
            else if (key === "B") { // Diccionario
                this.openBinnacle();
            }
            
        });
        console.log(this.cache.tilemap.get('mapa'));

        //Creacion del mapa desde json
        const map=this.make.tilemap({key:'mapa'});
        
        const tilesets=map.addTilesetImage("tiles","tilesImg");


        //Creacion de las capas
        const suelo=map.createLayer("Suelo",tilesets);
        const pared=map.createLayer("Pared",tilesets);
        const objetos=map.createLayer("objetos",tilesets);
        const colisiones=map.createLayer("colision",tilesets);

        colisiones.setCollisionByExclusion([-1]);
        //crear jugador y añadir sus colisiones con el mapa
        this.PlayerManager = new PlayerManager(this.inputManager, this);
        this.physics.add.collider(this.PlayerManager.sprite, colisiones);

        //-------------------------MINIJUEGOS-------------------------
        
        //Minijuego Furia del Desierto--------------------------------
        //crear portal para llevar a los minijuegos
        this.portalUndertale = this.add.rectangle(500, 300, 60, 60, 0x00FF00);
        this.physics.add.existing(this.portalUndertale);

        //comprobamos colision con el portalMinijuegoEsquivar
        this.physics.add.overlap(this.PlayerManager.sprite, this.portalUndertale, () => {
            //si hay colision lo llevamos al minijuego
            this.portalUndertale.destroy();
            this.scene.pause();
            this.scene.start('SelectDifficultyScene', { minijuego: 'Undertale', nombre: NOMBRES_MINIJUEGOS.Undertale });
        });

        //Minijuego Memoria del Templo--------------------------------
        //crear portal para llevar a los minijuegos
        this.puzzleLightsPortal = this.add.rectangle(1000, 150, 60, 60, 0xFFFFFF);
        this.physics.add.existing(this.puzzleLightsPortal);

        //comprobamos colision con el portal de puzzle lights
        this.physics.add.overlap(this.PlayerManager.sprite, this.puzzleLightsPortal, () => {
            //si hay colision lo llevamos al minijuego
            this.puzzleLightsPortal.destroy();
            this.scene.pause();
            //this.scene.start('PuzzleLights');
            this.scene.start('SelectDifficultyScene', { minijuego: 'PuzzleLights', nombre: NOMBRES_MINIJUEGOS.PuzzleLights });
        });

        //Minijuego Precision del escriba-----------------------------
        //Crear portal para llevar al minijuego
        this.portalMinijuegoBarrita = this.add.rectangle(400, 100, 60, 60, 0xD12F0F);
        this.physics.add.existing(this.portalMinijuegoBarrita);

        //Comprobamos colision con el portal al minijuego
        this.physics.add.overlap(this.PlayerManager.sprite, this.portalMinijuegoBarrita, () => {
            //si hay colision lo llevamos al minijuego
            this.portalMinijuegoBarrita.destroy();
            this.scene.pause();
            //this.scene.start('SlideScene');
            this.scene.start('SelectDifficultyScene', { minijuego: 'SlideBar', nombre: NOMBRES_MINIJUEGOS.SlideBar });
        });

        //-------Objetos mapa-----------
        this.movingObject1 = new MovingObject(this,this.PlayerManager,this.bloques);

        // portal para el mensaje final
        this.finalMsgPortal = this.add.rectangle(200, 300, 60, 60, 0x000000);
        this.physics.add.existing(this.finalMsgPortal);

        //comprobamos colision con el portalMinijuegoEsquivar
        this.physics.add.overlap(this.PlayerManager.sprite, this.finalMsgPortal, () => {
            //si hay colision lo llevamos al mensaje, idealmente en la
            // versión final será una exclamación, no un overlapeo
            this.finalMsgPortal.destroy();
            this.scene.launch('FinalMessage');
        });

        //camara sigue jugador
        this.cameras.main.startFollow(this.PlayerManager.getSprite());
        this.cameras.main.setZoom(1.5);

    }

    update() {
        // input
        this.inputManager.update();
        // jugador
        this.PlayerManager.update();
        //objetos movibles
        this.movingObject1.update();
    }

    openPauseMenu() {
        this.scene.pause();
        this.scene.launch("PauseMenuGame", { parentScene: this.scene.key });
    }

    openBinnacle(){
        this.scene.pause();
        this.scene.launch("BinnacleOverlay", { parentScene: this.scene.key });
    }

   
}