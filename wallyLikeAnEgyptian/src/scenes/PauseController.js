export default class PauseController extends Phaser.Scene {
  constructor() {
    super({ key: 'PauseController', active: true }); 
    //esta escena SIEMPRE esta corriendo y escuchando el esc
  }

  create() {
    // ESC global
    this.input.keyboard.on('keydown-ESC', () => {
      this.handlePause();
    });
  }

  handlePause() {
    const topScene = this.getTopScene();

    if (topScene === 'PauseMenuGame') {
        this.scene.stop('PauseMenuGame');
        const parent = this.scene.get('PauseMenuGame').parentScene;
        this.scene.resume(parent);
        return;
    }

    if (topScene) {
        const parentSceneInstance = this.scene.get(topScene);
        this.scene.pause(topScene);
        this.scene.launch('PauseMenuGame', { 
            parentScene: topScene,
            isMinigame: parentSceneInstance.isMinigame || false 
        });
    }
  }

  getTopScene() {
    // Obtiene la ultima escena que estaba activa
    const scenes = this.scene.manager.getScenes(true);
    
    // Elimina de la lista esta escena controladora
    const filtered = scenes.filter(s => s.scene.key !== 'PauseController');
    
    // Devuelve la que esta mas arriba en el stack
    return filtered.length > 0 ? filtered[filtered.length - 1].scene.key : null;
  }
}