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
import NotaJerogliOverlay from "../overlay/NotaJerogliOverlay.js";

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
        //Nota
        this.inputManager.on("keyDown", (key) => {
            if (key === "H") this.abrirNota(this.inputManager);

        });

        console.log('window.savedPlayerPos al iniciar create:', window.savedPlayerPos);
        if (window.savedPlayerPos) {
            console.log('Restaurando posición:', window.savedPlayerPos);
            playerInitialData.posInicial.x = window.savedPlayerPos.x;
            playerInitialData.posInicial.y = window.savedPlayerPos.y;
            console.log('✅ Posición restaurada:', window.savedPlayerPos);
        }else {
            console.log('NO hay posición guardada');
        }
        console.log('playerInitialData.posInicial:', playerInitialData.posInicial);

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

            // Restaurar posición si existe
            if (window.savedObjectsPos && window.savedObjectsPos[index]) {
                obj.sprite.x = window.savedObjectsPos[index].x;
                obj.sprite.y = window.savedObjectsPos[index].y;
            }
        });
        
        // === COFRES / PORTALES ===
        this.portales = [];

        cofresData.forEach(data => {
            const portal = new PortalChest(
                this,
                data,
                this.PlayerManager,
                () => {
      
                    this.savePositions();
                    
                    this.scene.stop('MapScene');

                    //Lanzar escena SIN destruir el mapa
                    this.scene.start('PreMinigameScene', {
                        minijuego: data.minijuego,
                        dificultad: data.dificultad,
                        jeroglificoId: data.jeroglificoId,
                        controles: data.controles,
                        parentScene: 'MapScene'
                    });
                    
                }
            );

            this.portales.push(portal);
        });

            
        //=== COLISIONES OBJETOS ENTRE SÍ ===
        for (let i = 0; i < this.movingObjects.length; i++) {
                for (let j = i + 1; j < this.movingObjects.length; j++) {
                    this.physics.add.collider(
                    this.movingObjects[i].sprite,
                    this.movingObjects[j].sprite
                );
            }
        }

        //=== COLISIONES OBJETOS - COFRES ===
        for (let i = 0; i < this.movingObjects.length; i++) {
                for (let j = i + 1; j < this.portales.length; j++) {
                    this.physics.add.collider(
                    this.movingObjects[i].sprite,
                    this.portales[j].sprite
                );
            }
        }

        //=== MUROS INVISIBLES ===
        this.wallSalaSecrt = new MurosInvisibles(this, 914, 1036, { A: 1 }, this.PlayerManager);
        this.wallVuelta = new MurosInvisibles(this, 455, 995, { A: 1 }, this.PlayerManager);
        this.wallFin = new MurosInvisibles(this, 455, 1135, { A: 1 }, this.PlayerManager);

        // Portal final
        this.finalPortal = new FinalPortal(this,  455, 1050, this.PlayerManager);

        this.cameras.main.setBackgroundColor(0x30291F);

        // Cámara Follow
        this.cameras.main.startFollow(this.PlayerManager.getSprite());
        this.cameras.main.setZoom(1.5);
    }

    update() {
        this.inputManager.update();
        this.PlayerManager.update();

        this.movingObjects.forEach(obj => obj.update());
        this.portales.forEach(portal => portal.update());

        this.finalPortal.update();
        this.wallSalaSecrt.update();
        this.wallVuelta.update();
        this.wallFin.update();
    }

    openBinnacle() { // Abrir bitácora
        this.scene.launch("BinnacleOverlay", { parentScene: "MapScene" });
        this.scene.pause(); // Pausamos MapScene mientras el overlay está activo
    }
    abrirNota() { 
        this.scene.launch("NotaJerogloOverlay", { parentScene: "MapScene" });
        this.scene.pause(); // Pausamos MapScene mientras el overlay está activo
    }

    savePositions() { // Save coords del player

        console.log('SAVEPOSITIONS LLAMADO');
        console.log('Posición actual del jugador:', this.PlayerManager.sprite.x, this.PlayerManager.sprite.y);
        // Guardar en una variable global
        if (!window.savedPlayerPos) {
            window.savedPlayerPos = {};
        }

        console.log('Guardado en window.savedPlayerPos:', window.savedPlayerPos);
        
        window.savedPlayerPos.x = this.PlayerManager.sprite.x;
        window.savedPlayerPos.y = this.PlayerManager.sprite.y;

        // Guardar objetos también
        if (!window.savedObjectsPos) {
            window.savedObjectsPos = [];
        }
        
        this.movingObjects.forEach((obj, index) => {
            window.savedObjectsPos[index] = {
            x: obj.sprite.x,
            y: obj.sprite.y
            };
        });
        
        console.log('Guardado en window:', window.savedPlayerPos);
    }
}