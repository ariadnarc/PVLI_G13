class MapScene extends Phaser.Scene{
    constructor(){
        super('MapScene');
    }
    preload(){
        //Carga los tiles del mapa
        this.load.image('suelo', 'assets/mapa/tileSuelo.png');
        this.load.image('pared', 'assets/mapa/tilePared.png');
        this.load.image('techo', 'assets/mapa/tileTecho.png');

        //Carga el mapa JSON (hecho con Tiled)
        this.load.tilemapTiledJSON('map','assets/mapa/map.json')
    }
    create() {
        //mapa
        const map= this.make.tilemap({key:'map'});

        //agrega cada tileset segun el nombre en Tiled
        const sueloTileset=map.addTilesetImage('suelo', 'suelo');
        const paredTileset=map.addTilesetImage('pared', 'pared');
        const techoTileset=map.addTilesetImage('techo', 'techo');

        //crea capa principal de Tiled
        const capaPrincipal=map.createLayer('Capa de patrones 2', [sueloTileset, paredTileset, techoTileset], 0, 0);
        
        //capa de colisiones
        const capaColision=map.createLayer('colision',[techoTileset],0,0);

        // ajustar tamaño del mundo, teniendo en cuenta el mapa
        this.physics.world.setBounds(0, 0, map.widthInPixels,map.heightInPixels);
        
        //crear jugador y añadir sus colisiones
        this.player=this.add.rectangle(400,300,15,25,0x3498db);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);
        this.physics.add.collider(this.player,capaColision);
        
       
        //colisiones dentro de Tiled
        capaColision.setCollisionByProperty({ collides: true });
           

        //camara sigue jugador
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(1.5);

        //controles
        this.cursors=this.input.keyboard.createCursorKeys();
    }
    update(){
        const speed=200;
        const body=this.player.body;

        body.setVelocity(0);

        if(this.cursors.left.isDown){
            body.setVelocityX(-speed);
        }
        else if(this.cursors.right.isDown){
            body.setVelocityX(speed);
        }
        else if(this.cursors.up.isDown){
            body.setVelocityY(-speed);
        }
        else if(this.cursors.down.isDown){
            body.setVelocityY(speed);
        }
    }
}