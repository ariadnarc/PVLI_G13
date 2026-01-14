/**
 * JSDOC
 * YA
 * A
 */

import PlayerManager from "../core/PlayerManager.js";
import InputManager from "../core/InputManager.js";
import MovingObject from "../core/MovingObject.js";
import { objectsData } from '../config/ObjectsData.js';
import { playerInitialData } from '../config/PlayerData.js';
import PortalChest from "../core/PortalChest.js";
import { cofresData } from "../config/cofresData.js";
import MurosInvisibles from "../core/MurosInvisibles.js";
import FinalPortal from './FinalPortal.js';

export default class MapScene extends Phaser.Scene {
    constructor() {
        super('MapScene');
    }

    create() {
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

        //Creacion del mapa desde json
        const map = this.make.tilemap({ key: 'mapa' });
        const tilesets = map.addTilesetImage("tiles", "tilesImg");

        //Creacion de las capas
        const suelo = map.createLayer("Suelo", tilesets);
        const pared = map.createLayer("Pared", tilesets);
        const objetos = map.createLayer("objetos", tilesets);
        const colisiones = map.createLayer("colision", tilesets);

        colisiones.setCollisionByExclusion([-1]);

        // Crear jugador y añadir sus colisiones con el mapa
        this.PlayerManager = new PlayerManager(this.inputManager, this, playerInitialData);
        this.physics.add.collider(this.PlayerManager.sprite, colisiones);

        // Objetos mapa
        this.movingObjects = [];
        objectsData.forEach((data, index) => {
            const obj = new MovingObject(this, this.PlayerManager, colisiones, data);
            this.movingObjects.push(obj);
        });

        // Minijuegos
        this.portales = [];

       cofresData.forEach(data => {
            const portal = new PortalChest(this, data, this.PlayerManager, (minijuego) => {
            this.scene.pause();
            this.scene.start('SelectDifficultyScene', { minijuego, nombre: minijuego });
            this.savePositions();
        });

        this.portales.push(portal);
    });
    //===================COLIDER OBJETOS CON COFRES Y ENTRE ELLOS===================
    for (let i = 0; i < this.movingObjects.length; i++) {
            for (let j = i + 1; j < this.movingObjects.length; j++) {
                this.physics.add.collider(
                this.movingObjects[i].sprite,
                this.movingObjects[j].sprite
        );
        }
    }
    for (let i = 0; i < this.movingObjects.length; i++) {
            for (let j = i + 1; j < this.portales.length; j++) {
                this.physics.add.collider(
                this.movingObjects[i].sprite,
                this.portales[j].sprite
        );
        }
    }

        // Paredes invisibles
        this.wallSalaSecrt = new MurosInvisibles(this, 914, 1036, { A: 1 }, this.PlayerManager);
        this.wallVuelta = new MurosInvisibles(this, 455, 995, { A: 1 }, this.PlayerManager);
        this.wallFin = new MurosInvisibles(this, 455, 1135, { A: 1 }, this.PlayerManager);

        // Portal final
        this.finalPortal = new FinalPortal(this,  455, 1050, this.PlayerManager);

        // Animaciones:
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

        this.cameras.main.setBackgroundColor(0x30291F);

        // Cámara Follow
        this.cameras.main.startFollow(this.PlayerManager.getSprite());
        this.cameras.main.setZoom(1.5);
    }

    update() {
        this.inputManager.update();
        this.PlayerManager.update();
        this.movingObjects.forEach(obj => {
            obj.update();
        });
        this.portales.forEach(portal => {
            portal.update();
        });
        //this.wall.update();
        this.finalPortal.update();
        this.wallSalaSecrt.update();
        this.wallVuelta.update();
        this.wallFin.update();
    }

    openBinnacle() { // Abrir bitácora
        this.scene.launch("BinnacleOverlay", { parentScene: "MapScene" });
        this.scene.pause(); // Pausamos MapScene mientras el overlay está activo
    }

    savePositions() { // Save coords del player
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