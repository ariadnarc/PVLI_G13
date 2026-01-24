/**
 * @file main.js
 * @description
 * Punto de entrada del juego.
 * Configura Phaser (canvas, tamaño, físicas, escenas) y arranca la instancia principal.
 * Espera a que la fuente "Filgaia" esté cargada antes de crear el juego para
 * garantizar un renderizado correcto de los textos.
 */

// ========== IMPORTS ==========

// Boot / carga inicial de assets y configuración base
import Boot from './config/Boot.js';

// Managers
import PauseController from './core/PauseController.js';

// Scenes
import MapScene from './scenes/MapScene.js';
import PreMinigameScene from './scenes/PreMinigameScene.js';
import IntroScene from './scenes/IntroScene.js';
import FinalScene from './scenes/FinalScene.js';
import SalaSecreta from './scenes/SalaSecreta.js';

// Overlays (UI superpuesta sobre escenas principales)
import BinnacleOverlay from './overlay/BinnacleOverlay.js';
import NotaJerogliOverlay from './overlay/NotaJerogliOverlay.js';

// Menús
import MainMenu from './menus/MainMenu.js';
import PauseMenuGame from './menus/PauseMenuGame.js';
import PostMinigameMenu from './menus/PostMinigameMenu.js';
import SettingsMenu from './menus/SettingsMenu.js';

// Minijuegos
import Undertale from './scenes/mjUndertale.js';
import PuzzleLights from './scenes/mjPuzzleLights.js';
import LockPick from './scenes/mjLockPick.js';
import CrocoShoot from './scenes/mjCrocoShoot.js';
import SlideBar from './scenes/mjSlide.js';
import FinalGame from './scenes/mjFinalGame.js'

// Esperamos a que la fuente personalizada Filgaia esté disponible
document.fonts.load('16px "Filgaia"').then(() => {

  /**
   * Configuración principal del juego Phaser.
   * - type: tipo de render (CANVAS)
   * - canvas: elemento canvas del DOM donde dibuja el juego
   * - physics: configuración global de físicas arcade
   * - scene: lista de escenas registradas en el juego
   * @type {Phaser.Types.Core.GameConfig}
   */
  const config = {
    type: Phaser.CANVAS,
    width: 1200,
    height: 600,
    canvas: document.getElementById('gameCanvas'),
    scale: {
      mode: Phaser.Scale.NONE,
    },
    backgroundColor: '#e87722',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },  // sin gravedad
        debug: false        // hitboxes
      }
    }, // declaramos físcas globalmente
    scene: [Boot, MainMenu, MapScene, IntroScene, PauseController, BinnacleOverlay, NotaJerogliOverlay, PauseMenuGame,
      SettingsMenu, PreMinigameScene, Undertale, PuzzleLights, FinalGame,
      LockPick, CrocoShoot, SlideBar, PostMinigameMenu, FinalScene,SalaSecreta],
  };

  // Condicional que obliga a buscar el canvas que tenemos en el index
  if (config.canvas) {
    // Instancia principal de Phaser.Game
    new Phaser.Game(config);
  } else {
    console.error("No se encontró el canvas con id 'gameCanvas'");
  }
})