import MapaLaberinto from "../../assets/mapa/mapaLaberinto.js";
import Player from "../scripts/player.js";

export default class MapScene extends Phaser.Scene {
    constructor() {
        super('MapScene');
    }
    preload() {
        //Carga los tiles del mapa (pared)
        this.load.image('pared_1', 'Wally like an Egyptian/assets/mapa/tiles/pared_1.png');
        this.load.image('pared_2', 'Wally like an Egyptian/assets/mapa/tiles/pared_2.png');
        this.load.image('pared_3', 'Wally like an Egyptian/assets/mapa/tiles/pared_3.png');
        this.load.image('pared_4', 'Wally like an Egyptian/assets/mapa/tiles/pared_4.png');
        this.load.image('pared_5', 'Wally like an Egyptian/assets/mapa/tiles/pared_5.png');
        this.load.image('pared_6', 'Wally like an Egyptian/assets/mapa/tiles/pared_6.png');
        this.load.image('pared_7', 'Wally like an Egyptian/assets/mapa/tiles/pared_7.png');
        this.load.image('pared_8', 'Wally like an Egyptian/assets/mapa/tiles/pared_8.png');
        this.load.image('pared_9', 'Wally like an Egyptian/assets/mapa/tiles/pared_9.png');

        //suelo
        this.load.image('suelo_22', 'Wally like an Egyptian/assets/mapa/tiles/suelo_22.png');

        //techo
        this.load.image('techo_43', 'Wally like an Egyptian/assets/mapa/tiles/techo_43.png');

        // Carga de imágenes de jeroglíficos
        for (let i = 1; i <= 9; i++) {
        this.load.image(`jero${i}`, `Wally like an Egyptian/assets/minijuegos/luces/jero${i}.png`);
        }
    }
    create() {
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
        this.player = new Player(this, 400, 300);
        this.physics.add.collider(this.player.sprite, this.bloques);

        //Minijuego Esquivar
        //crear portal para llevar a los minijuegos
        this.portalMinijuegoEsquivar = this.add.rectangle(500, 300, 60, 60, 0x00FF00);
        this.physics.add.existing(this.portalMinijuegoEsquivar);

        //comprobamos colision con el portalMinijuegoEsquivar
        this.physics.add.overlap(this.player.sprite, this.portalMinijuegoEsquivar, () => {
            //si hay colision lo llevamos al minijuego
            this.portalMinijuegoEsquivar.destroy();
            this.scene.pause();
            this.scene.start('minijuegoJuan');
        });

        //Minijuego Luces
        //crear portal para llevar a los minijuegos
        this.portalMinijuegoLuces = this.add.rectangle(1000, 150, 60, 60, 0xFFFFFF);
        this.physics.add.existing(this.portalMinijuegoLuces);

        //comprobamos colision con el portalMinijuegoEsquivar
        this.physics.add.overlap(this.player.sprite, this.portalMinijuegoLuces, () => {
            //si hay colision lo llevamos al minijuego
            this.portalMinijuegoLuces.destroy();
            this.scene.pause();
            this.scene.start('minijuegoDavid');
        });

        //Minijuego Lock
        //crear portal para llevar a los minijuegos
        this.portalMinijuegoLock = this.add.rectangle(400, 200, 60, 60, 0x00FFF0);
        this.physics.add.existing(this.portalMinijuegoLock);

        //comprobamos colision con el portalMinijuegoEsquivar
        this.physics.add.overlap(this.player.sprite, this.portalMinijuegoLock, () => {
            //si hay colision lo llevamos al minijuego
            this.portalMinijuegoEsquivar.destroy();
            this.scene.pause();
            this.scene.start('minijuegoLock');
        });

        // portal para el mensaje final
        this.portalMensajeFinal = this.add.rectangle(200, 300, 60, 60, 0x000000);
        this.physics.add.existing(this.portalMensajeFinal);

        //comprobamos colision con el portalMinijuegoEsquivar
        this.physics.add.overlap(this.player.sprite, this.portalMensajeFinal, () => {
            //si hay colision lo llevamos al mensaje, idealmente en la
            // versión final será una exclamación, no un overlapeo
            this.portalMensajeFinal.destroy();
            this.scene.launch('MensajeFinal');
        });

        //camara sigue jugador
        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.setZoom(1.5);

    }
    update() {
        //update jugador
        this.player.update();
    }
}