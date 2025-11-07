import MapaLaberinto from "../../assets/mapa/mapaLaberinto.js";
import Player from "../scripts/player.js";

export default class MapScene extends Phaser.Scene {
    constructor() {
        super('MapScene');
    }
    preload() {
        //Carga los tiles del mapa (pared)
        this.load.image('pared_1', 'assets/mapa/tiles/pared_1.png');
        this.load.image('pared_2', 'assets/mapa/tiles/pared_2.png');
        this.load.image('pared_3', 'assets/mapa/tiles/pared_3.png');
        this.load.image('pared_4', 'assets/mapa/tiles/pared_4.png');
        this.load.image('pared_5', 'assets/mapa/tiles/pared_5.png');
        this.load.image('pared_6', 'assets/mapa/tiles/pared_6.png');
        this.load.image('pared_7', 'assets/mapa/tiles/pared_7.png');
        this.load.image('pared_8', 'assets/mapa/tiles/pared_8.png');
        this.load.image('pared_9', 'assets/mapa/tiles/pared_9.png');

        //suelo
        this.load.image('suelo_22', 'assets/mapa/tiles/suelo_22.png');

        //techo
        this.load.image('techo_43', 'assets/mapa/tiles/techo_43.png');
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

        //crear portal para llevar a los minijuegos
        this.portal = this.add.rectangle(500, 300, 60, 60, 0x00FF00);
        this.physics.add.existing(this.portal);

        //comprobamos colision con el portal
        this.physics.add.overlap(this.player.sprite, this.portal, () => {
            //si hay colision lo llevamos al minijuego
            this.scene.start('minijuegoJuan');
            this.portal.destroy();
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