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
import {MINIJUEGOS_SECRETA} from '../config/SalaSecretaBoot.js'
//import NotaJerogliOverlay from "../overlay/NotaJerogliOverlay.js";

export default class MapScene extends Phaser.Scene {
    constructor() {
        super('MapScene');
    }

    create() {
        // ===== INPUT =====
        this.inputManager = new InputManager(this);
        this.inputManager.configure({ cursors: true, keys: ["B","N"] });

        this.inputManager.on("keyDown", (key) => {
            if (key === "B") this.openBinnacle(this.inputManager);
            if (key === "N") this.abrirNota(this.inputManager);
        });

        if (window.savedPlayerPos) {
            playerInitialData.posInicial.x = window.savedPlayerPos.x;
            playerInitialData.posInicial.y = window.savedPlayerPos.y;
        }

        //Creacion del mapa desde json
        const map = this.make.tilemap({ key: 'mapa' });
        const tilesets = map.addTilesetImage("tiles", "tilesImg");

        //Creacion de las capas
        const suelo = map.createLayer("Suelo", tilesets);
        const pared = map.createLayer("Pared", tilesets);
        const objetos = map.createLayer("objetos", tilesets);
        const colisiones = map.createLayer("colision", tilesets);
        colisiones.setCollisionByExclusion([-1]);

        // ===== SOUND MANAGER =====
        this.soundManager = this.registry.get('soundManager');
        this.soundManager?.playMusic('walkLikeAnEgyptian');

        // ===== PLAYER =====
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
            const portal = new PortalChest(this, data, this.PlayerManager, () => {
                this.savePositions();
                this.soundManager?.stopMusic();
                this.scene.stop('MapScene');
                this.scene.start('PreMinigameScene', {
                    minijuego: data.minijuego,
                    dificultad: data.dificultad,
                    jeroglificoId: data.jeroglificoId,
                    controles: data.controles,
                    parentScene: 'MapScene'
                });
            });
            this.portales.push(portal);
        });

        //=== SALA SECRETA ===
        const elegido = MINIJUEGOS_SECRETA[Math.floor(Math.random() * MINIJUEGOS_SECRETA.length)];
        const portalSalaSecreta = new PortalChest(this, {posInicial: { x: 870, y: 1120 }}, this.PlayerManager, () => {
                this.savePositions();
                this.soundManager?.stopMusic();
                this.scene.stop('MapScene');
                this.scene.start('SalaSecreta', {
                    minijuego:  elegido.minijuego,
                    dificultad:  elegido.dificultad,
                    controles:  elegido.controles,
                    parentScene: 'MapScene'
                });
            });
        this.portales.push(portalSalaSecreta);

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
        this.wallSalaSecrt = new MurosInvisibles(this, 914, 1036,5, this.PlayerManager,playerInitialData);
        this.wallVuelta = new MurosInvisibles(this, 455, 995, 15,this.PlayerManager,playerInitialData);
        this.wallFin = new MurosInvisibles(this, 455, 1135,15, this.PlayerManager,playerInitialData);

        // Portal final
        this.finalPortal = new FinalPortal(this,  455, 1050, this.PlayerManager,playerInitialData);

        this.cameras.main.setBackgroundColor(0x30291F);

        // Cámara Follow
        this.cameras.main.startFollow(this.PlayerManager.getSprite());
        this.cameras.main.setZoom(1.5);

        this.hudIcons = this.add.image(280, 420, 'keyInfo')
            .setScrollFactor(0)
            .setDepth(1000)
            .setScale(0.1);
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
    abrirNota() { // Abir Nota
        this.scene.launch("NotaJerogliOverlay", { parentScene: "MapScene" });
        this.scene.pause(); // Pausamos MapScene mientras el overlay está activo
    }

    savePositions() { // Save coords del player

        if (!window.savedPlayerPos) window.savedPlayerPos = {};
        window.savedPlayerPos.x = this.PlayerManager.sprite.x;
        window.savedPlayerPos.y = this.PlayerManager.sprite.y;

        // Guardar objetos también
        if (!window.savedObjectsPos) window.savedObjectsPos = [];
        this.movingObjects.forEach((obj, index) => {
            window.savedObjectsPos[index] = { x: obj.sprite.x, y: obj.sprite.y };
        });
    }

    pause() {
        this.soundManager?.pauseMusic();
    }

    resume() {
        this.soundManager?.resumeMusic();
    }

    shutdown() {
        this.soundManager?.stopMusic();
    }
}