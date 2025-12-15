/**
 * JSDOC
 * YA
 * A
 */

import { DIFICULTADES } from '../config/MinigameData.js';
import InputManager from '../core/InputManager.js';

export default class SlideBar extends Phaser.Scene {

    constructor() {
        super('SlideBar');
    }

    init(data = {}) {

        this.isMinigame = true;
        // Guardamos el minijuego
        this.minijuego = data.minijuego;

        // Dificultad elegida
        this.difficulty = data.dificultad;

        // Si venimos de un reintento, mantenemos los intentos restantes
        // Si no hay valor, usamos los intentos completos según la dificultad
        const config = DIFICULTADES[this.difficulty].minijuegos.SlideBar;
        this.tries = data.remainingTries ?? config.intentos;
        this.barSpeed = config.velocidadBarra;
    }

    create() {

        //==============INPUT===============
        this.inputManager = new InputManager(this);
        this.inputManager.configure({
            cursors: false,
            keys: ['SPACE']
        });

        const w = this.scale.width;
        const h = this.scale.height;

        const bg = this.add.image(w / 2, h / 2, 'paredBG');
        bg.setDisplaySize(w, h);
        bg.setDepth(-10);

        //======BARRA, ZONA VERDE Y CURSOR===========
        // Barra
        this.barWidth = 500;
        this.barHeight = 20;
        this.bar = this.add.image(w / 2, h / 2, 'papiroBar');
        this.bar.setDisplaySize(this.barWidth, this.barHeight);

        // Zona verde (acierto)

        this.greenZone = this.add.sprite(w / 2, h / 2, 'egyptTiles', 22);
        this.greenZone.setScale(2);


        // Cursor
        this.cursor = this.add.sprite(w / 2 - this.barWidth / 2, h / 2, 'egyptTiles', 20).setScale(2);
        this.cursorSpeed = this.barSpeed;
        this.direction = 1; // 1 = derecha, -1 = izquierda

        //==========HUD=============
        this.hud = this.add.text(20, 20, "", {
            fontSize: "24px",
            color: "#ffffff"
        });

        this.bgMusic = this.sound.add('minigame-music');
        this.bgMusic.play();

        this.updateHUD();
    }

    update() {

        this.inputManager.update();

        // Movimiento del cursor
        const dt = this.game.loop.delta / 1000;
        let nextX = this.cursor.x + this.direction * this.cursorSpeed * dt;

        const left = this.bar.x - this.barWidth / 2;
        const right = this.bar.x + this.barWidth / 2;

        if (nextX <= left || nextX >= right) {
            this.direction *= -1; // cambia de dirección al llegar a los bordes
        } else {
            this.cursor.x = nextX;
        }

        // Pulsar SPACE para comprobar acierto
        if (this.inputManager.keys['SPACE'] && this.inputManager.keys['SPACE'].isDown) {
            this.checkHit();
        }
    }

    //=====COMPRUEBA ACIERTO=========
    checkHit() {
        const cursorBounds = this.cursor.getBounds();
        const greenBounds = this.greenZone.getBounds();

        const acierto = Phaser.Geom.Intersects.RectangleToRectangle(cursorBounds, greenBounds);

        if (acierto) {

            console.log("¡ACIERTO!");
            this.endGame(true); // termina el juego con victoria

        } else {

            console.log("FALLASTE");

            this.tries--;
            this.updateHUD();

            // Siempre llamamos a endGame, pasando los intentos que quedaban
            this.endGame(false, this.tries);
        }
    }


    updateHUD() {
        this.hud.setText(
            `Precisión del Escriba\nIntentos restantes: ${this.tries}`
        );
    }

    //======TERMINA MINIJUEGO=========
    endGame(victoria, remainingTries = this.tries) {
        const menuOptions = {};

        // Reintentar
        menuOptions['Reintentar'] = () => {
            this.bgMusic.stop();
            this.scene.stop('PostMinigameMenu');
            this.scene.stop();

            if (!victoria && remainingTries > 0) {
                // Todavia quedan intentos -> volvemos a SlideBar con los intentos restantes
                this.scene.start('SlideBar', {
                    minijuego: this.minijuego,
                    dificultad: this.difficulty,
                    remainingTries: remainingTries
                });
            } else {
                // Ultimo intento perdido o victoria -> Reintentar lleva a SelectDifficultyScene
                this.scene.start('SelectDifficultyScene', {
                    minijuego: this.minijuego
                });
            }
        };

        // Salir al mapa
        menuOptions['Salir'] = () => {
            this.bgMusic.stop();
            this.scene.stop('PostMinigameMenu');
            this.scene.stop();
            this.scene.start('MapScene');
        };

        // Lanzamos el menu de fin de minijuego
        this.scene.start('PostMinigameMenu', {
            result: victoria ? 'victory' : 'defeat',
            difficulty: this.difficulty,
            minijuego: this.minijuego,
            options: menuOptions,
            remainingTries: remainingTries // <-- importante para mostrar en PostMinigameMenu
        });
    };


}