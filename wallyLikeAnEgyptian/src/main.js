// ========== IMPORTS ==========

// data
import Boot from './config/Boot.js';

// Scenes
import MapScene from './scenes/MapScene.js';
import VictoryScene from './scenes/VictoryScene.js';
import DefeatScene from './scenes/DefeatScene.js';
import FinalMessage from './scenes/FinalMessage.js';
import SelectDifficultyScene from './scenes/SelectDifficultyScene.js';

// overlays
import BinnacleOverlay from './overlay/BinnacleOverlay.js';

// menus
import MainMenu from './menus/MainMenu.js';
import PauseMenuGame from './menus/PauseMenuGame.js';
import PauseMenuMinigame from './menus/PauseMenuMinigame.js';
import PostMinigameMenu from './menus/PostMinigameMenu.js';
import SettingsMenu from './menus/SettingsMenu.js';

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
    debug: true        // hitboxes
    }
  }, // declaramos físcas globalmente
  scene: [Boot, MainMenu, MapScene, BinnacleOverlay, PauseMenuGame, SettingsMenu, SelectDifficultyScene, DodgeMissilesScene, PuzzleLightsScene,
          PauseMenuMinigame, VictoryScene, PostMinigameMenu, DefeatScene, FinalMessage],
};

// Condicional que obliga a buscar el canvas q tenemos en el index
if (config.canvas) {
  new Phaser.Game(config);
} else {
  console.error("No se encontró el canvas con id 'gameCanvas'");
}