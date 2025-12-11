import PlayerManager from "../core/PlayerManager.js";
import InputManager from "../core/InputManager.js";
import MovingObject from "../core/MovingObject.js";
import { NOMBRES_MINIJUEGOS } from "../config/MinigameData.js";
import { objectsData } from '../config/ObjectsData.js';
import { playerInitialData } from '../config/PlayerData.js';


export default class MapScene extends Phaser.Scene {
    constructor() {
        super('MapScene');
    }

    create() {

        //===================INPUT===================
        this.inputManager = new InputManager(this);

        // MapScene solo escucha movimiento y tecla ESC
        this.inputManager.configure({
            cursors: true,
            keys: ["B"]
        });

        //Bitácora
        this.inputManager.on("keyDown", (key) => {
            if (key === "B") this.openBinnacle(this.inputManager);
        });

        //===================MAPA===================

        //Creacion del mapa desde json
        const map = this.make.tilemap({ key: 'mapa' });
        const tilesets = map.addTilesetImage("tiles", "tilesImg");

        //Creacion de las capas
        const suelo = map.createLayer("Suelo", tilesets);
        const pared = map.createLayer("Pared", tilesets);
        const objetos = map.createLayer("objetos", tilesets);
        const colisiones = map.createLayer("colision", tilesets);

        colisiones.setCollisionByExclusion([-1]);

        //===================PLAYER===================//crear jugador y añadir sus colisiones con el mapa
        this.PlayerManager = new PlayerManager(this.inputManager, this, playerInitialData);
        this.physics.add.collider(this.PlayerManager.sprite, colisiones);

        //===================OBJETOS MAPA===================
        this.movingObjects = [];
        objectsData.forEach((data, index) => {
            const obj = new MovingObject(this, this.PlayerManager, colisiones, data);
            this.movingObjects.push(obj);
        });

        for (let i = 0; i < this.movingObjects.length; i++) {
            for (let j = i + 1; j < this.movingObjects.length; j++) {
                this.physics.add.collider(
                    this.movingObjects[i].sprite,
                    this.movingObjects[j].sprite
                );
            }
        }
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

        //Animaciones:
        this.anims.create({
            key: 'walk-down',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 6 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-up',
            frames: this.anims.generateFrameNumbers('player', { start: 7, end: 13 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-right',
            frames: this.anims.generateFrameNumbers('player', { start: 14, end: 20 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-left',
            frames: this.anims.generateFrameNumbers('player', { start: 21, end: 27 }),
            frameRate: 10,
            repeat: -1
        });



        //===================MINIJUEGOS===================

        //FURIA DEL DESIERTO:
        //crear portal para llevar a los minijuegos
        this.portalUndertale = this.add.rectangle(500, 300, 60, 60, 0x00FF00);
        this.physics.add.existing(this.portalUndertale);

        //comprobamos colision con el portalMinijuegoEsquivar
        this.physics.add.overlap(this.PlayerManager.sprite, this.portalUndertale, () => {
            //si hay colision lo llevamos al minijuego
            this.portalUndertale.destroy();
            this.scene.pause();
            this.scene.start('SelectDifficultyScene', { minijuego: 'Undertale', nombre: NOMBRES_MINIJUEGOS.Undertale });
            this.savePositions();
        });

        //Minijuego Memoria del Templo--------------------------------
        //crear portal para llevar a los minijuegos
        this.puzzleLightsPortal = this.add.rectangle(600, 300, 60, 60, 0xFFFFFF);
        this.physics.add.existing(this.puzzleLightsPortal);

        //comprobamos colision con el portal de puzzle lights
        this.physics.add.overlap(this.PlayerManager.sprite, this.puzzleLightsPortal, () => {
            //si hay colision lo llevamos al minijuego
            this.puzzleLightsPortal.destroy();
            this.scene.pause();
            //this.scene.start('PuzzleLights');
            this.scene.start('SelectDifficultyScene', { minijuego: 'PuzzleLights', nombre: NOMBRES_MINIJUEGOS.PuzzleLights });
            this.savePositions();
        });

        //Minijuego Cerrajero ancestral--------------------------------
        //crear portal para llevar a los minijuegos
        this.lockPickPortal = this.add.rectangle(500, 600, 60, 60, 0xb81414);
        this.physics.add.existing(this.lockPickPortal);

        //comprobamos colision con el portal de puzzle lights
        this.physics.add.overlap(this.PlayerManager.sprite, this.lockPickPortal, () => {
            //si hay colision lo llevamos al minijuego
            this.lockPickPortal.destroy();
            this.scene.pause();
            //this.scene.start('PuzzleLights');
            this.scene.start('SelectDifficultyScene', { minijuego: 'LockPick', nombre: NOMBRES_MINIJUEGOS.LockPick });
            this.savePositions();
        });

        //Minijuego Cazador de reptiles--------------------------------
        //crear portal
        this.CrocoPortal = this.add.rectangle(600, 600, 60, 60, 0x008000);
        this.physics.add.existing(this.CrocoPortal);

        //comprobamos colision con el portal
        this.physics.add.overlap(this.PlayerManager.sprite, this.CrocoPortal, () => {
            //si hay colision lo llevamos al minijuego
            this.CrocoPortal.destroy();
            this.scene.pause();

            this.scene.start('SelectDifficultyScene', { minijuego: 'CrocoShoot', nombre: NOMBRES_MINIJUEGOS.CrocoShoot });
            this.savePositions();
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
            this.savePositions();
        });


        //===================CAMARA===================
        this.cameras.main.startFollow(this.PlayerManager.getSprite());
        this.cameras.main.setZoom(1.5);

    }

    update() {

        this.inputManager.update();
        this.PlayerManager.update();
        //this.movingObject1.update();
        this.movingObjects.forEach(obj => {
            obj.update();
        });
    }

    openBinnacle() {
        this.scene.launch("BinnacleOverlay", { parentScene: "MapScene" });
        this.scene.pause(); // Pausamos MapScene mientras el overlay está activo
    }
    savePositions() {
        // Guardar posición del jugador
        playerInitialData.posInicial.x = this.PlayerManager.sprite.x;
        playerInitialData.posInicial.y = this.PlayerManager.sprite.y;

        // Guardar posición de los objetos movibles
        this.movingObjects.forEach((obj, index) => {
            objectsData[index].posInicial.x = obj.sprite.x;
            objectsData[index].posInicial.y = obj.sprite.y;
        });
    }

}