import { playerInitialData } from '../config/PlayerData.js';
/**
 * @file MurosInvisibles.js
 * @description
 * Clase para muros invisibles que bloquean al jugador hasta que tenga
 * un número mínimo de jeroglíficos. Muestra mensajes indicando cuántos
 * jeroglíficos faltan.
 */

/**
 * Opciones de configuración para un muro invisible.
 * @typedef {Object} MurosInvisiblesData
 * @property {number} x - Posición X del muro.
 * @property {number} y - Posición Y del muro.
 * @property {number} requiredGlyphs - Cantidad de jeroglíficos requeridos para pasar.
 * @property {PlayerManager} PlayerManager - Instancia del jugador que interactúa con el muro.
 */

/**
 * Clase que representa un muro invisible que bloquea al jugador.
 */

export default class MurosInvisibles {
    /**
     * Crea un muro invisible con collider y mensajes.
     * @param {Phaser.Scene} scene - Escena de Phaser donde se crea el muro.
     * @param {number} x - Posición X del muro.
     * @param {number} y - Posición Y del muro.
     * @param {number} requiredGlyphs - Número de jeroglíficos necesarios para pasar.
     * @param {PlayerManager} PlayerManager - Instancia del jugador.
     */
    constructor(scene, x, y, requiredGlyphs, PlayerManager) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.requiredGlyphs = requiredGlyphs;
        this.PlayerManager = PlayerManager;

        /** @type {Phaser.Physics.Arcade.Sprite} */
        this.wall = this.scene.physics.add.staticSprite(x, y, null);
        this.wall.setSize(60, 10);
        this.wall.setVisible(false);

        /** @type {Phaser.GameObjects.Text|null} */
        this.infoText = null;

        /** @type {Phaser.GameObjects.Text|null} */
        this.infoTextJero = null;

        // Collider con el jugador
        this.scene.physics.add.collider(this.PlayerManager.sprite, this.wall, (playerSprite, wallSprite) => {

            const jeroObtenidos = playerInitialData.jeroglificosObtenidos.length;
            const jeroRestantes = this.requiredGlyphs - jeroObtenidos;

            if (jeroRestantes > 0) {
                // Bloquear paso
                this.PlayerManager.sprite.setVelocity(0, 0);

                // Mostrar texto de aviso si no está ya creado
                if(!this.infoText && !this.infoTextJero){
                    this.infoText = this.scene.add.text(this.x, this.y + 100, `No tienes jeroglificos suficientes`, {
                    fontFamily: 'Filgaia',
                    fontSize: '20px',
                    color: '#d8af75ff',
                    fontStyle: 'bold',
                    stroke: '#33261bff',
                    strokeThickness: 4
                }).setOrigin(0.5);

                this.infoTextJero = this.scene.add.text(this.x, this.y + 150, `Te faltan `+ jeroRestantes, {
                    fontFamily: 'Filgaia',
                    fontSize: '15px',
                    color: '#d8af75ff',
                    fontStyle: 'bold',
                    stroke: '#33261bff',
                    strokeThickness: 4
                }).setOrigin(0.5);
                }
                
            } else {
                // Desactivar la pared y destruir textos si los hay
                wallSprite.disableBody(true, true);
                if (this.infoText) {
                    this.infoText.destroy();
                    this.infoText = null;
                }
                if (this.infoTextJero) {
                    this.infoTextJero.destroy();
                    this.infoTextJero = null;
                }
            }
        });
    }
    
    /**
     * Actualiza el muro. Se encarga de borrar los textos si el jugador
     * se aleja demasiado del muro.
     */
    update(){
         const distance = Phaser.Math.Distance.Between(
            this.PlayerManager.sprite.x,
            this.PlayerManager.sprite.y,
            this.x,
            this.y
        );

        if (distance > 50) { // 50 px de tolerancia
            if (this.infoText) {
                this.infoText.destroy();
                this.infoText = null;
            }
            if (this.infoTextJero) {
                this.infoTextJero.destroy();
                this.infoTextJero = null;
            }
        }
    }
}