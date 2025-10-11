const config = {
  type: Phaser.CANVAS,
  width: 1200,
  height: 600,
  backgroundColor: '#e87722',
  parent: 'game',        // Phaser meterá el canvas dentro de esta sección
  /*scene: [Boot, Level, End]   // Cuando tengamos scripts, se escribe tal que asi los nombres de estos*/
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

// PRUEBA
function preload() {
  // Cargar recursos
}

function create() {
  this.add.text(400, 300, '¡Bienvenido al juego!', {
    fontFamily: 'Comfortaa',
    fontSize: '50px',
    color: '#556b2f'
  }).setOrigin(0.5);

  // Dejamos esto como paso a otra escena
  //this.scene.start('level');
}

function update() {}
