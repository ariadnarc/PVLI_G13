/**
 * @file ButtonManager.js
 * @description
 * Clase para crear botones interactivos con Phaser 3.
 * Cada botón tiene un rectángulo, texto y eventos de hover/presión/click.
 * Compatible con SoundManager o con la reproducción de sonido por defecto.
 */

/**
 * Configuración opcional de un botón.
 * @typedef {Object} ButtonConfig
 * @property {number} [width=200] - Ancho del botón.
 * @property {number} [height=60] - Alto del botón.
 * @property {number} [backgroundColor=0x222222] - Color de fondo normal.
 * @property {number} [hoverColor=0x444444] - Color al pasar el ratón.
 * @property {number} [pressedColor=0x111111] - Color al presionar.
 * @property {number} [borderRadius=10] - Radio de borde (por si se usa).
 * @property {Phaser.Types.GameObjects.Text.TextStyle} [textStyle={fontSize: "20px", color: "#ffffff"}] - Estilo del texto.
 * @property {number} [hoverScale=1.05] - Escala al hacer hover.
 * @property {function} [onClick] - Función que se ejecuta al hacer click.
 */

/**
 * Clase que gestiona un botón interactivo en Phaser 3.
 */
export default class ButtonManager {
  /**
   * Crea un botón con rectángulo y texto.
   * @param {Phaser.Scene} scene - Escena donde se añadirá el botón.
   * @param {number} x - Posición X del botón.
   * @param {number} y - Posición Y del botón.
   * @param {string} label - Texto del botón.
   * @param {ButtonConfig} [config={}] - Configuración opcional del botón.
   */
  constructor(scene, x, y, label, config = {}) {
    this.scene = scene;

    // Intentar obtener el SoundManager desde el registro
    this.soundManager = scene.registry.get('soundManager');

    // Configuración por defecto + overrides
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

  /**
   * Crea los elementos gráficos del botón y los añade al contenedor.
   * @param {number} x
   * @param {number} y
   * @param {string} label
   */
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

    this.setupEvents();
  }

  /** Configura los eventos pointer del botón (hover, press, click). */
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

      if (this.soundManager) {
        this.soundManager.playSound('click');
      } else {
        this.scene.sound?.play('click'); // fallback por si no hay SoundManager
      }
    });

    this.background.on("pointerup", () => {
      this.background.setFillStyle(cfg.hoverColor);
      cfg.onClick();
    });
  }

  /**
   * Cambia el texto del botón.
   * @param {string} newText
   */
  setText(newText) {
    this.text.setText(newText);
  }

  /**
   * Devuelve el contenedor del botón (para añadirlo a layouts externos).
   * @returns {Phaser.GameObjects.Container}
   */
  getContainer() {
    return this.container;
  }
}
