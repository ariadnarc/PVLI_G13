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
    const topKey = this.getTopSceneKey();
    if (!topKey) return;

    const topScene = this.scene.get(topKey);
    const soundManager = this.registry.get('soundManager');

    // SI estamos en un overlay que NO es el menú de pausa → ignorar ESC
    if (topScene.isOverlay && topKey !== 'PauseMenuGame') {
      return;
    }

    // CERRAR PAUSA
    if (this.scene.isActive('PauseMenuGame')) {
      const pauseMenu = this.scene.get('PauseMenuGame');
      const parent = pauseMenu.parentScene;

      this.scene.stop('PauseMenuGame');
      if (parent) this.scene.resume(parent);

      soundManager?.resumeAll();
      return;
    }

    // ABRIR PAUSA (solo si la escena top es jugable)
    this.scene.pause(topKey);
    this.scene.launch('PauseMenuGame', {
      parentScene: topKey,
      isMinigame: topScene.isMinigame || false
    });

    soundManager?.pauseAll();
  }

  getTopSceneKey() {
    const scenes = this.scene.manager.getScenes(true);

    // Quitamos el propio controller
    const filtered = scenes.filter(
      s => s.scene.key !== 'PauseController'
    );

    return filtered.length
      ? filtered[filtered.length - 1].scene.key
      : null;
  }
}
