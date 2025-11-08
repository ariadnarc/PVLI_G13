import GameTitle from './scenes/GameTitle.js';
import MapScene from './scenes/MapScene.js';

// UI scenes
import VictoryScene from './scenes/VictoryScene.js';
import MensajeFinal from './scenes/MensajeFinal.js';
import SelectDifficultyScene from './config/SelectDifficultyScene.js';

//minijuegos
import DodgeMissilesScene from './scenes/DodgeMissilesScene.js';
import PuzzleLightsScene from './scenes/PuzzleLightsScene.js';

const config = {
  type: Phaser.CANVAS,
  width: 1200,
  height: 600,
  backgroundColor: '#e87722',
  canvas: document.getElementById('gameCanvas'),
  physics: {
  default: 'arcade',
  arcade: {
    gravity: { y: 0 },  // sin gravedad
    debug: false        // hitboxes
    }
  }, // declaramos físcas globalmente
  scene: [GameTitle, MapScene, SelectDifficultyScene, DodgeMissilesScene, PuzzleLightsScene,
          VictoryScene, MensajeFinal],
};

// Condicional que obliga a buscar el canvas q tenemos en el index
if (config.canvas) {
  new Phaser.Game(config);
} else {
  console.error("No se encontró el canvas con id 'gameCanvas'");
}