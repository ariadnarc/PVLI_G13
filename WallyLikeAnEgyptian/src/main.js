
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000',
    parent:'game-container',
    physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
    },
    scene: [
        Start,MapScene
    ]
};

const game= new Phaser.Game(config);
            