import MenuBase from './MenuBase.js';
import InputManager from '../core/InputManager.js';

/**
 * Menú genérico reutilizable para pantallas post-minijuego
 * Crea dinámicamente los botones a partir de las funciones pasadas en options.
 * Ejemplo:
 * new PostMinigameMenu(this, {
 *   Reintentar: () => {...},
 *   "Salir al mapa": () => {...},
 *   "Ver marcador": () => {...}
 * });
 */
export default class PostMinigameMenu extends MenuBase {
  constructor(scene, options = {}) {
    super(scene, 'PostMinigameMenu');
    this.options = options;
  }

  create() {
    // llama al metodo del padre
    super.create();
    
    // Input escena
    this.inputManager.configureInputs({
        mouse: true,
        keys: ['ESC']
    });

    const { width, height } = this.sys.game.config;
    const centerY = height / 2 + 100;

    const btnStyle = {
      fontSize: '22px',
      backgroundColor: '#ddd',
      color: '#000',
      padding: { x: 15, y: 8 },
    };

    // === Obtener lista de botones ===
    const entries = Object.entries(this.options);
    const numButtons = entries.length;
    const spacing = 220; // separación horizontal entre botones
    const totalWidth = (numButtons - 1) * spacing;
    const startX = width / 2 - totalWidth / 2;

    // === Crear los botones dinámicamente ===
    entries.forEach(([label, callback], index) => {
      const x = startX + index * spacing;
      const y = centerY;

      const button = this.scene.add.text(x, y, label, btnStyle)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

      // === Registrar evento con InputManager ===
      this.inputManager.registerButton(button, callback);
    });
  }

  update(){
    this.inputManager.handleExit('Minigame');
  }

  destroy() {
    this.inputManager.disableMouse();
  }
}
