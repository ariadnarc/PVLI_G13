import MapaLaberinto from "../../assets/mapa/mapaLaberinto.js";
import PlayerManager from "../core/PlayerManager.js";
import InputManager from "../core/InputManager.js"
import { NOMBRES_MINIJUEGOS } from "../config/MinigameData.js";

export default class MapScene extends Phaser.Scene {
    constructor() {
        super('MapScene');
    }

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

        //crea mapa desde la clase mapa (con la info del mapa)
        this.mapa = new MapaLaberinto();
        this.mapa.render(this);

        // Crea las colisiones teniendo en cuenta la matriz booleana de MapaLaberinto
        this.bloques = this.physics.add.staticGroup();
        for (let y = 0; y < this.mapa.alto; y++) {
            for (let x = 0; x < this.mapa.ancho; x++) {
                if (this.mapa.colisiones[y][x]) {
                    //crear un bloque transparente para colisiones
                    const bloque = this.add.rectangle(
                        x * this.mapa.tileSize + this.mapa.tileSize / 2,
                        y * this.mapa.tileSize + this.mapa.tileSize / 2,
                        this.mapa.tileSize,
                        this.mapa.tileSize,
                        0xff0000,
                        0
                    ).setOrigin(0, 0);
                    this.physics.add.existing(bloque, true);
                    this.bloques.add(bloque);
                }
            }
        }

        //crear jugador y añadir sus colisiones con el mapa
        this.PlayerManager = new PlayerManager(this.inputManager, this);
        this.physics.add.collider(this.PlayerManager.sprite, this.bloques);

        //-------------------------MINIJUEGOS-------------------------
        /*
        //Minijuego Furia del Desierto--------------------------------
        //crear portal para llevar a los minijuegos
        this.portalMinijuegoEsquivar = this.add.rectangle(500, 300, 60, 60, 0x00FF00);
        this.physics.add.existing(this.portalMinijuegoEsquivar);

        //comprobamos colision con el portalMinijuegoEsquivar
        this.physics.add.overlap(this.PlayerManager.sprite, this.portalMinijuegoEsquivar, () => {
            //si hay colision lo llevamos al minijuego
            this.portalMinijuegoEsquivar.destroy();
            this.scene.pause();
            //this.scene.start('DodgeMissilesScene');
            this.scene.start('SelectDifficultyScene', { minijuego: 'DodgeMissilesScene', nombre: NOMBRES_MINIJUEGOS.dodgeMissiles });
        });*/

        //Minijuego Memoria del Templo--------------------------------
        //crear portal para llevar a los minijuegos
        this.puzzleLightsPortal = this.add.rectangle(1000, 150, 60, 60, 0xFFFFFF);
        this.physics.add.existing(this.puzzleLightsPortal);

        //comprobamos colision con el portalMinijuegoEsquivar
        this.physics.add.overlap(this.PlayerManager.sprite, this.puzzleLightsPortal, () => {
            //si hay colision lo llevamos al minijuego
            this.puzzleLightsPortal.destroy();
            this.scene.pause();
            //this.scene.start('PuzzleLightsScene');
            this.scene.start('SelectDifficultyScene', { minijuego: 'PuzzleLightsScene', nombre: NOMBRES_MINIJUEGOS.puzzleLights });
        });

        //Minijuego Precision del escriba-----------------------------
        //Crear portal para llevar al minijuego
        this.portalMinijuegoBarrita = this.add.rectangle(300, 100, 60, 60, 0x00FF00);
        this.physics.add.existing(this.portalMinijuegoBarrita);

        //Comprobamos colision con el portal al minijuego
        this.physics.add.overlap(this.PlayerManager.sprite, this.puzzleLightsPortal, () => {
            //si hay colision lo llevamos al minijuego
            this.portalMinijuegoBarrita.destroy();
            this.scene.pause();
            //this.scene.start('SlideScene');
            this.scene.start('SelectDifficultyScene', { minijuego: 'SlideScene', nombre: NOMBRES_MINIJUEGOS.slideBar });
        });



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