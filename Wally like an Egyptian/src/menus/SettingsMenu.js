import MenuBase from './MenuBase.js';

export default class SettingsMenu extends MenuBase {
  constructor() {
    super('SettingsMenu');
  }

  initMenu() {
    const { width, height } = this.scale;
    this.soundValue = this.game.sound.volume; // Valor inicial del volumen (0–1)

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

    // Slider básico (podría ser reemplazado por UI más compleja)
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

    // Botón volver
    this.createButton('Volver', width / 2, 320, () => {
      const parent = this.menuConfig.parentMenu;
      this.scene.stop();
      this.scene.resume(parent);
    });
  }
}
