const config = {
  type: Phaser.CANVAS,
  width: 1200,
  height: 600,
  backgroundColor: '#e87722',
  canvas: document.getElementById('gameCanvas'),
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);

function preload() {}

function create() {
  this.add.text(600, 300, '¡Bienvenido al juego!', {
    fontFamily: 'Comfortaa',
    fontSize: '50px',
    color: '#3c2f2f'
  }).setOrigin(0.5);
}

function update() {}