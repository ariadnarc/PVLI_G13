/**
 * @file PauseController.js
 * @description
 * Controlador global de pausa del juego.
 * Escucha la tecla ESC y abre/cierra el menú de pausa.
 * Gestiona la pausa de escenas jugables y resume correctamente las escenas parent.
 */

export default class PauseController extends Phaser.Scene {
  /**
   * Crea la escena del controlador de pausa.
   */
  constructor() {
    super({ key: 'PauseController', active: true });
  }

  /**
   * Se ejecuta al crear la escena.
   * Configura la escucha global de la tecla ESC.
   */
  create() {
    // ESC global
    this.input.keyboard.on('keydown-ESC', () => {
      this.handlePause();
    });
  }

  /**
   * Gestiona la pausa del juego al pulsar ESC.
   * Abre o cierra el menú de pausa según el estado actual.
   */
  handlePause() {
    const topKey = this.getTopSceneKey();
    if (!topKey) return;

    const topScene = this.scene.get(topKey);
    const soundManager = this.registry.get('soundManager');

    // Si estamos en un overlay que NO es el menú de pausa → ignorar ESC
    if (topScene.isOverlay && topKey !== 'PauseMenuGame') {
      return;
    }

    // Cerrar pausa si ya está abierta
    if (this.scene.isActive('PauseMenuGame')) {
      const pauseMenu = this.scene.get('PauseMenuGame');
      const parent = pauseMenu.parentScene;

      this.scene.stop('PauseMenuGame');
      if (parent) this.scene.resume(parent);

      soundManager?.resumeAll();
      return;
    }

    // Abrir pausa (solo si la escena top es jugable)
    this.scene.pause(topKey);
    this.scene.launch('PauseMenuGame', {
      parentScene: topKey,
      isMinigame: topScene.isMinigame || false
    });

    soundManager?.pauseAll();
  }

  /**
   * Obtiene la clave de la escena superior activa (top scene),
   * ignorando la propia escena PauseController.
   * @returns {string|null} - Clave de la escena superior o null si no hay.
   */
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
