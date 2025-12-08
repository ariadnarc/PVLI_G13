import InputManager from '../core/InputManager.js';

export default class MenuBase extends Phaser.Scene {

  constructor(key) {
    super(key);
    this.menuElements = [];
    this.menuConfig = {};
  }

  init(data){
    this.menuConfig = data || {};
  }

  create() {
    // Crear InputManager
    this.inputManager = new InputManager(this);

    // Todos los menús escuchan ESC por defecto
    this.inputManager.configure({
      keys: ['ESC']
    });

    // Handler genérico para ESC
    this.inputManager.on("keyDown", (key) => {
      if (key === "ESC") {
        this.onEscape();
      }
    });
  }

  /**
   * Método genérico al pulsar ESC.
   * Los menús individuales pueden sobrescribirlo.
   */
  onEscape() {
    // Comportamiento por defecto: cerrar menú y volver a la escena padre
    const parent = this.menuConfig.parentScene;

    if (parent) {
      this.scene.stop();
      this.scene.resume(parent);
    } else { // detecta errores con la escena padre
      console.warn(`MenuBase: No se ha definido parentScene en ${this.scene.key}`);
      this.scene.stop();
    }
  }

  /**
   * Crear botón genérico
   */
  createButton(label, x, y, callback, style = {}, spriteKey = null) {
    let container;

    if(spriteKey) {
        // Crear el sprite de fondo
        const bg = this.add.image(0, 0, spriteKey).setOrigin(0.5);

        // Escalar si se pasa en style
        if(style.width && style.height){
            bg.setDisplaySize(style.width, style.height);
        }

        // Crear el texto encima
        const txt = this.add.text(0, 0, label, {
            fontSize: style.fontSize || '22px',
            fontFamily: 'Filgaia',
            color: style.color || '#634830ff',
            align: 'center',
            ...style
        }).setOrigin(0.5);

        // Agrupar en un container
        container = this.add.container(x, y, [bg, txt]);

        // Interactividad
        bg.setInteractive({ useHandCursor: true });
        bg.on('pointerdown', callback);

        // Hover opcional
        if(style.hoverTint) {
            bg.on('pointerover', () => bg.setTint(style.hoverTint));
            bg.on('pointerout', () => bg.clearTint());
        }

    } else {
        // Si no se pasa spriteKey, usar texto con backgroundColor como antes
        const txt = this.add.text(x, y, label, {
            fontSize: style.fontSize || '22px',
            fontFamily: 'Filgaia',
            color: style.color || '#000',
            backgroundColor: style.backgroundColor || '#ddd',
            padding: { x: 12, y: 6 },
            align: 'center',
            ...style,
        }).setOrigin(0.5);

        this.inputManager.registerButton(txt, callback);
        container = txt;
    }

    // Guardar referencia para limpiar
    this.menuElements.push(container);

    return container;
}

  /**
   * Cleanup
   */
  shutdown() {
    this.menuElements.forEach(el => el.destroy());
    this.menuElements = [];
  }
}
