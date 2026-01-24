/**
 * @file DialogText.js
 * @description
 * Clase para crear y gestionar ventanas de diálogo.
 * Permite mostrar texto estático o animado, con borde, fondo semitransparente,
 * botón de cierre y ajuste dinámico según tamaño de pantalla.
 */

/**
 * Configuración opcional de una ventana de diálogo.
 * @typedef {Object} DialogTextOptions
 * @property {number} [borderThickness=3] - Grosor del borde de la ventana.
 * @property {number} [borderColor=0x907748] - Color del borde.
 * @property {number} [borderAlpha=1] - Transparencia del borde.
 * @property {number} [windowAlpha=0.8] - Transparencia del fondo de la ventana.
 * @property {number} [windowColor=0x303030] - Color del fondo de la ventana.
 * @property {number} [windowHeight=150] - Altura de la ventana de diálogo.
 * @property {number} [padding=32] - Padding alrededor de la ventana.
 * @property {string} [closeBtnColor='darkgoldenrod'] - Color de la X de cierre.
 * @property {number} [dialogSpeed=3] - Velocidad de animación del texto.
 * @property {number} [fontSize=28] - Tamaño de la fuente.
 * @property {string} [fontFamily='Filgaia'] - Familia de la fuente.
 */

/**
 * Clase para mostrar ventanas de diálogo con texto animado en Phaser.
 */
export default class DialogText{
	/**
   * Crea una ventana de diálogo.
   * @param {Phaser.Scene} scene - Escena de Phaser donde se mostrará el diálogo.
   * @param {DialogTextOptions} [opts={}] - Opciones de configuración de la ventana.
   */
	constructor(scene, opts){
		this.scene = scene;
		this.init(opts);
	}

	/**
   * Inicializa la ventana con parámetros por defecto o los pasados.
   * @param {DialogTextOptions} opts
   */
	init(opts) {
		if (!opts) opts = {};
		
		this.borderThickness = opts.borderThickness || 3;
		this.borderColor = opts.borderColor || 0x907748;
		this.borderAlpha = opts.borderAlpha || 1;
		this.windowAlpha = opts.windowAlpha || 0.8;
		this.windowColor = opts.windowColor || 0x303030;
		this.windowHeight = opts.windowHeight || 150;
		this.padding = opts.padding || 32;
		this.closeBtnColor = opts.closeBtnColor || 'darkgoldenrod';
		this.dialogSpeed = opts.dialogSpeed || 3;
		this.fontSize = opts.fontSize || 28;
		this.fontFamily = opts.fontFamily || 'Filgaia';
		
		this.eventCounter = 0;
		this.visible = true;
		
		/** @type {Phaser.GameObjects.Text|null} */
		this.text = null;
		
		/** @type {string[]|null} */
		this.dialog = null;

		/** @type {Phaser.GameObjects.Graphics|null} */
		this.graphics = null;

		/** @type {Phaser.GameObjects.Text|null} */
		this.closeBtn = null;
		
		this.createWindow();
	}

	/** Muestra u oculta la ventana de diálogo */
	toggleWindow() {
		this.visible = !this.visible;
		if (this.text) this.text.visible = this.visible;
		if (this.graphics) this.graphics.visible = this.visible;
		if (this.closeBtn) this.closeBtn.visible = this.visible;
	}

	/**
   * Establece el texto de la ventana.
   * @param {string} text - Texto a mostrar.
   * @param {boolean} [animate=false] - Si el texto se muestra letra a letra.
   */
	setText(text, animate) {
		this.eventCounter = 0;
		this.dialog = text.split('');

		if (this.timedEvent) this.timedEvent.remove();

		var tempText = animate ? '' : text;
		
		//llama al metodo que calcula la pos del texto y lo crea
		this.setText(tempText); 

		if (animate) {

			const delay= Math.max(1,150-(this.dialogSpeed*30));
			//se crea un evento temporizado
			this.timedEvent = this.scene.time.addEvent({
				delay,
				callback: this.animateText(),
				callbackScope: this,
				loop: true
			});
		}
		
	}

	/** Consigue el ancho del juego */ 
	getGameWidth() {
		return this.scene.sys.game.config.width;
	}

	/** Consigue el alto del juego */ 
	getGameHeight() {
		return this.scene.sys.game.config.height;
	}

	/**
   * Calcula las dimensiones y pos de la ventana en funcion del tamaño de la pantalla de juego
   * @param {number} width
   * @param {number} height
   */
	calculateWindowDimensions(width, height) {
		var x = this.padding;
		var y = height - this.windowHeight - this.padding;
		var rectWidth = width - (this.padding * 2);
		var rectHeight = this.windowHeight;
		return { x, y, rectWidth, rectHeight };
	}

	/** Crea la ventana interior */ 
	createInnerWindow(x, y, rectWidth, rectHeight) {
		this.graphics.fillStyle(this.windowColor, this.windowAlpha);
		this.graphics.fillRect(x + 1, y + 1, rectWidth - 1, rectHeight - 1);
	}

	/** Crea el borde de la ventana */
	createOuterWindow(x, y, rectWidth, rectHeight) {
		this.graphics.lineStyle(this.borderThickness, this.borderColor, this.borderAlpha);
		this.graphics.strokeRect(x, y, rectWidth, rectHeight);
	}

	/** Crea la ventana completa */
	createWindow() {
		const gameHeight = this.getGameHeight();
		const gameWidth = this.getGameWidth();
		const dimensions = this.calculateWindowDimensions(gameWidth, gameHeight);
		this.graphics = this.scene.add.graphics();

		this.createOuterWindow(dimensions.x, dimensions.y, dimensions.rectWidth, dimensions.rectHeight);
		this.createInnerWindow(dimensions.x, dimensions.y, dimensions.rectWidth, dimensions.rectHeight);
		
		this.createCloseModalButton(); 
		this.createCloseModalButtonBorder(); 
	}

	/** Crea el botón de cerrar */
	createCloseModalButton() {
		const self = this;
		this.closeBtn = this.scene.make.text({
			x: this.getGameWidth() - this.padding - 14,
			y: this.getGameHeight() - this.windowHeight - this.padding + 3,
			text: 'X',
			style: { font: 'bold 12px TimesNewRoman', fill: this.closeBtnColor }
		});
		
		this.closeBtn.setInteractive(); 

		this.closeBtn.on('pointerover', function () { this.setTint(0xff0000);}); 
		this.closeBtn.on('pointerout', function () { this.clearTint(); }); 
		this.closeBtn.on('pointerdown', function () {
			self.toggleWindow(); 
			if (self.timedEvent) self.timedEvent.remove();
			if (self.text) self.text.destroy();
		});
	}

	/** Crea el borde del botón de cerrar */
	createCloseModalButtonBorder() {
		const x = this.getGameWidth() - this.padding - 20;
		const y = this.getGameHeight() - this.windowHeight - this.padding;
		this.graphics.strokeRect(x, y, 20, 20);
	}

	/** Animación de texto letra a letra */
	animateText() {
		this.eventCounter++;
		this.text.setText(this.text.text + this.dialog[this.eventCounter - 1]);
		if (this.eventCounter === this.dialog.length) this.timedEvent.remove();
	}

	/** Calcula la posición y crea el texto */
	setText(text) {
		if (this.text) this.text.destroy();

		const x = this.padding + 10;
		const y = this.getGameHeight() - this.windowHeight - this.padding + 10;

		this.text = this.scene.make.text({
			x,
			y,
			text,
			style: {
				wordWrap: { width: this.getGameWidth() - (this.padding * 2) - 25 },
				fontSize: this.fontSize +'px',
				fontFamily: this.fontFamily
			}
		});
	}
};