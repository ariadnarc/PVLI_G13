import MenuBase from './MenuBase.js';

export default class SettingsMenu extends MenuBase {
  constructor() {
    super('SettingsMenu');
  }

  create() {
    // llama al metodo del padre
    super.create();

    const { width, height } = this.sys.game.config;
    this.soundValue = this.game.sound.volume; // Valor inicial del volumen (0–1)

    // Input escena
    this.inputManager.configureInputs({
        mouse: true,
        keys: ['ESC']
    });

    // Fondo semitransparente
    this.add.rectangle(0, 0, width, height, 0x000000, 0.5).setOrigin(0);

    this.add.text(width / 2, 100, 'AJUSTES DE SONIDO', {
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Texto de volumen
    this.volumeText = this.add.text(width / 2, 180, `Volumen: ${(this.soundValue * 100).toFixed(0)}%`, {
      fontSize: '22px',
      color: '#ffffff',
    }).setOrigin(0.5);

    // Slider básico
    const barWidth = 200;
    const bar = this.add.rectangle(width / 2, 230, barWidth, 10, 0xffffff);
    const handle = this.add.rectangle(width / 2, 230, 20, 20, 0xffff00).setInteractive();

    handle.on('pointerdown', (pointer) => {
      this.input.on('pointermove', (movePointer) => {
        const newX = Phaser.Math.Clamp(movePointer.x, width / 2 - barWidth / 2, width / 2 + barWidth / 2);
        handle.x = newX;
        this.soundValue = Phaser.Math.Clamp((newX - (width / 2 - barWidth / 2)) / barWidth, 0, 1);
        this.game.sound.volume = this.soundValue;
        this.volumeText.setText(`Volumen: ${(this.soundValue * 100).toFixed(0)}%`);
      });
    });

    this.input.on('pointerup', () => this.input.off('pointermove'));

    // Estilo básico
    const style = {
      fontSize: '24px',
      color: '#fff',
      backgroundColor: '#333',
      padding: { x: 15, y: 8 }
    };

    // Crear el texto-botón
    const volverButton = this.add.text(width / 2, 420, 'Volver', style).setOrigin(0.5)

    // Registrar el botón en InputManager 
    this.inputManager.registerButton(volverButton, () => {
      const parent = this.menuConfig.parentScene;
      this.scene.stop();
      this.scene.resume(parent);
    });
  }

  update(){
    this.inputManager.handleExit('Menu');
  }
}


