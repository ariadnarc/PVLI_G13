// ========== IMPORTS ==========

// data
import Boot from './config/Boot.js';

//managers
import PauseController from './core/PauseController.js';

// Scenes
import MapScene from './scenes/MapScene.js';
import FinalMessage from './scenes/FinalMessage.js';
import SelectDifficultyScene from './scenes/SelectDifficultyScene.js';
import IntroScene from './scenes/IntroScene.js';

// overlays
import BinnacleOverlay from './overlay/BinnacleOverlay.js';

// menus
import MainMenu from './menus/MainMenu.js';
import PauseMenuGame from './menus/PauseMenuGame.js';
import PostMinigameMenu from './menus/PostMinigameMenu.js';
import SettingsMenu from './menus/SettingsMenu.js';

//minijuegos
import Undertale from './scenes/mjUndertale.js';
import PuzzleLights from './scenes/mjPuzzleLights.js';
import LockPick from './scenes/mjLockPick.js';
import CrocoShoot from './scenes/mjCrocoShoot.js';
import SlideBar from './scenes/mjSlide.js';



// esto q es?? (pregunta Juan)
import MovingObject from './core/MovingObject.js';

document.fonts.load('16px "Filgaia"').then(() => {

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
    scene: [Boot, MainMenu, MapScene,IntroScene, PauseController, BinnacleOverlay, PauseMenuGame,
            SettingsMenu, SelectDifficultyScene, Undertale, PuzzleLights,
            LockPick, CrocoShoot, SlideBar, PostMinigameMenu, FinalMessage],
  };

  // Condicional que obliga a buscar el canvas q tenemos en el index
  if (config.canvas) {
    new Phaser.Game(config);
  } else {
    console.error("No se encontró el canvas con id 'gameCanvas'");
  }
})