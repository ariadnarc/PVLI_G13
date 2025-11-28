export default class ButtonManager {
  /**
   * Crea un botón con un rectángulo + texto
   * @param {Phaser.Scene} scene 
   * @param {number} x 
   * @param {number} y 
   * @param {string} label 
   * @param {object} config 
   */
  constructor(scene, x, y, label, config = {}) {
    this.scene = scene;

    // Configuración por defecto
    this.config = {
      width: config.width || 200,
      height: config.height || 60,
      backgroundColor: config.backgroundColor || 0x222222,
      hoverColor: config.hoverColor || 0x444444,
      pressedColor: config.pressedColor || 0x111111,
      borderRadius: config.borderRadius || 10,
      textStyle: config.textStyle || { fontSize: "20px", color: "#ffffff" },
      hoverScale: config.hoverScale || 1.05,
      onClick: config.onClick || (() => {})
    };

    this.createButton(x, y, label);
  }

  createButton(x, y, label) {
    const cfg = this.config;

    // Contenedor para manejar rectángulo + texto juntos
    this.container = this.scene.add.container(x, y);

    // Fondo del botón
    this.background = this.scene.add.rectangle(
      0,
      0,
      cfg.width,
      cfg.height,
      cfg.backgroundColor,
      1
    )
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    // Texto del botón
    this.text = this.scene.add.text(
      0,
      0,
      label,
      cfg.textStyle
    ).setOrigin(0.5);

    // Añadir al contenedor
    this.container.add([this.background, this.text]);

    // Eventos del botón
    this.setupEvents();
  }

  setupEvents() {
    const cfg = this.config;

    this.background.on("pointerover", () => {
      this.background.setFillStyle(cfg.hoverColor);
      this.container.setScale(cfg.hoverScale);
    });

    this.background.on("pointerout", () => {
      this.background.setFillStyle(cfg.backgroundColor);
      this.container.setScale(1);
    });

    this.background.on("pointerdown", () => {
      this.background.setFillStyle(cfg.pressedColor);

      // Sonido si existe en la escena
      this.scene.sound?.play("click");
    });

    this.background.on("pointerup", () => {
      this.background.setFillStyle(cfg.hoverColor);
      cfg.onClick();
    });
  }

  /**
   * Permite cambiar el texto del botón externamente.
   */
  setText(newText) {
    this.text.setText(newText);
  }

  /**
   * Devuelve el contenedor por si quieres añadirlo a layouts externos.
   */
  getContainer() {
    return this.container;
  }
}
