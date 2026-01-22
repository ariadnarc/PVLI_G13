/**
 * JSDOC
 * YA
 * A
 */

export default class PauseController extends Phaser.Scene {
  constructor() {
    super({ key: 'PauseController', active: true });
  }

  create() {
    // ESC global
    this.input.keyboard.on('keydown-ESC', () => {
      this.handlePause();
    });
  }

  handlePause() {
    const topSceneKey = this.getTopScene();
    if (!topSceneKey) return; // No hay ninguna escena activa

    const soundManager = this.registry.get('soundManager');

    // Si el topScene es el menú de pausa, lo cerramos y reanudamos la escena padre
    if (topSceneKey === 'PauseMenuGame') {
      const pauseScene = this.scene.get('PauseMenuGame');
      const parentKey = pauseScene.parentScene;

      this.scene.stop('PauseMenuGame');

      if (parentKey) {
        this.scene.resume(parentKey); // Reanudar escena padre
      }

      soundManager?.resumeAll(); // Reanudar música global
      return;
    }

    // Evitar abrir múltiples menús de pausa encima de otro
    const existingPause = this.scene.get('PauseMenuGame');
    if (existingPause && existingPause.scene.isActive()) {
      return; // ya hay un menú de pausa abierto, ignoramos
    }

    // Pausar la escena actual y lanzar menú de pausa
    const topScene = this.scene.get(topSceneKey);
    this.scene.pause(topSceneKey);

    this.scene.launch('PauseMenuGame', {
      parentScene: topSceneKey,
      isMinigame: topScene.isMinigame || false
    });

    soundManager?.pauseAll(); // Pausar música global
  }


  getTopScene() {
    const scenes = this.scene.manager.getScenes(true);
    const filtered = scenes.filter(s => s.scene.key !== 'PauseController');
    return filtered.length > 0 ? filtered[filtered.length - 1].scene.key : null;
  }
}
