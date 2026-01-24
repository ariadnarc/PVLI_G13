/**
 * @file MapScene.js
 * @class MapScene
 * @extends Phaser.Scene
 * @description
 * Escena principal del mapa en modo aventura.
 * Gestiona al jugador, el mapa de tiles, cofres/portales a minijuegos,
 * sala secreta, colisiones, muros invisibles y el portal final.
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

/**
 * Escena de exploración de la pirámide.
 */
export default class MapScene extends Phaser.Scene {

    /**
     * Crea la escena MapScene.
     */
    constructor() {
        super('MapScene');

        /**
         * Gestor de inputs personalizado.
         * @type {InputManager|undefined}
         */
        this.inputManager = undefined;

        /**
         * Gestor del jugador (movimiento, animaciones, etc.).
         * @type {PlayerManager|undefined}
         */
        this.PlayerManager = undefined;

        /**
         * Colección de objetos móviles presentes en el mapa.
         * @type {MovingObject[]}
         */
        this.movingObjects = [];

        /**
         * Colección de cofres/portales hacia minijuegos o sala secreta.
         * @type {PortalChest[]}
         */
        this.portales = [];

        /**
         * Gestor de sonido global.
         * @type {Object|undefined}
         */
        this.soundManager = undefined;

        /**
         * Muro invisible que bloquea la sala secreta.
         * @type {MurosInvisibles|undefined}
         */
        this.wallSalaSecrt = undefined;

        /**
         * Muro invisible de vuelta desde la sala secreta.
         * @type {MurosInvisibles|undefined}
         */
        this.wallVuelta = undefined;

        /**
         * Muro invisible cercano al portal final.
         * @type {MurosInvisibles|undefined}
         */
        this.wallFin = undefined;

        /**
         * Sprite decorativo de las escaleras.
         * @type {Phaser.Physics.Arcade.Sprite|undefined}
         */
        this.stairs = undefined;

        /**
         * Portal final que lleva a la escena de final de juego.
         * @type {FinalPortal|undefined}
         */
        this.finalPortal = undefined;

        /**
         * Icono HUD de información de teclas.
         * @type {Phaser.GameObjects.Image|undefined}
         */
        this.hudIcons = undefined;
    }

    /**
     * Crea el mapa, el jugador, cofres, sala secreta, colisiones,
     * cámara, HUD y configura la música de fondo.
     * @override
     */
    create() {
        //=== INPUT ===
        this.inputManager = new InputManager(this);
        this.inputManager.configure({ cursors: true, keys: ["B","N"] });

        this.inputManager.on("keyDown", (key) => {
            if (key === "B") this.openBinnacle(this.inputManager);
            if (key === "N") this.abrirNota(this.inputManager);
        });

        // Restaurar posición del jugador si se ha guardado previamente
        if (window.savedPlayerPos) {
            playerInitialData.posInicial.x = window.savedPlayerPos.x;
            playerInitialData.posInicial.y = window.savedPlayerPos.y;
        }

        // Creación del mapa desde JSON
        const map = this.make.tilemap({ key: 'mapa' });
        const tilesets = map.addTilesetImage("tiles", "tilesImg");

        // Creación de las capas
        const suelo = map.createLayer("Suelo", tilesets);
        const pared = map.createLayer("Pared", tilesets);
        const objetos = map.createLayer("objetos", tilesets);
        const colisiones = map.createLayer("colision", tilesets);
        colisiones.setCollisionByExclusion([-1]);

        //=== SOUND MANAGER ===
        this.soundManager = this.registry.get('soundManager');
        this.soundManager?.playMusic('walkLikeAnEgyptian');

        //=== PLAYER ===
        this.PlayerManager = new PlayerManager(this.inputManager, this, playerInitialData);
        this.physics.add.collider(this.PlayerManager.sprite, colisiones);

        // Objetos móviles del mapa
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
        
        //=== COFRES / PORTALES ===
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
        
        // Escaleras
        this.stairs = this.physics.add.sprite(398, 1070, 'escaleras', 0).setScale(0.03);

        // Portal final
        this.finalPortal = new FinalPortal(this,  415, 1070, this.PlayerManager,playerInitialData);

        // Configuración de cámara
        this.cameras.main.setBackgroundColor(0x30291F);
        this.cameras.main.startFollow(this.PlayerManager.getSprite());
        this.cameras.main.setZoom(1.5);

        // HUD: icono con información de teclas
        this.hudIcons = this.add.image(280, 420, 'keyInfo')
            .setScrollFactor(0)
            .setDepth(1000)
            .setScale(0.1);
    }

    /**
     * Actualiza el jugador, los objetos móviles, cofres/portales,
     * el portal final y los muros invisibles.
     * @override
     */
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

    /**
     * Abre la bitácora del jugador como overlay.
     * Pausa temporalmente la MapScene mientras la bitácora está activa.
     */
    openBinnacle() { 
        this.scene.launch("BinnacleOverlay", { parentScene: "MapScene" });
        this.scene.pause(); 
    }

    /**
     * Abre la nota con el mensaje jeroglífico como overlay.
     * Pausa temporalmente la MapScene mientras la nota está activa.
     */
    abrirNota() { 
        this.scene.launch("NotaJerogliOverlay", { parentScene: "MapScene" });
        this.scene.pause(); 
    }

    /**
     * Guarda la posición actual del jugador y de los objetos móviles
     * en variables globales de `window` para restaurarlas más adelante.
     */
    savePositions() { 

        // Guardar posición del jugador
        if (!window.savedPlayerPos) window.savedPlayerPos = {};
        window.savedPlayerPos.x = this.PlayerManager.sprite.x;
        window.savedPlayerPos.y = this.PlayerManager.sprite.y;

        // Guardar objetos también
        if (!window.savedObjectsPos) window.savedObjectsPos = [];
        this.movingObjects.forEach((obj, index) => {
            window.savedObjectsPos[index] = { x: obj.sprite.x, y: obj.sprite.y };
        });
    }

    /**
     * Pausa la música de la escena de mapa.
     * Puede ser llamada si la escena entra en pausa.
     */
    pause() {
        this.soundManager?.pauseMusic();
    }

    /**
     * Reanuda la música de la escena de mapa.
     * Puede ser llamada al reanudar la escena.
     */
    resume() {
        this.soundManager?.resumeMusic();
    }

    /**
     * Limpia recursos de audio al cerrar la escena.
     * Detiene la música de fondo.
     */
    shutdown() {
        this.soundManager?.stopMusic();
    }
}