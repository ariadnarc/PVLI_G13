import Phaser from 'src/lib/phaser.js';
import GameTitle from './scenes/GameTitle.js';
import GameScene from './scenes/GameScene.js';

const config = {
  type: Phaser.CANVAS,
  width: 1200,
  height: 600,
  backgroundColor: '#e87722',
  canvas: document.getElementById('gameCanvas'),
  scene: [GameTitle, GameScene],
};

const game = new Phaser.Game(config);