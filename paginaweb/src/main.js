import GameTitle from './scenes/GameTitle.js';
import MapScene from './scenes/MapScene.js';
import VictoriaUI from './scenes/VictoriaUI.js';
import MensajeFinal from './scenes/MensajeFInal.js';

//minijuegos
import minijuegoJuan from './scenes/minijuegoJuan.js';
import minijuegoDavid from './scenes/minijuegoDavid.js';

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
  scene: [GameTitle, MapScene, minijuegoJuan, minijuegoDavid,
          VictoriaUI, MensajeFinal],
};

// Condicional que obliga a buscar el canvas q tenemos en el index
if (config.canvas) {
  new Phaser.Game(config);
} else {
  console.error("No se encontró el canvas con id 'gameCanvas'");
}