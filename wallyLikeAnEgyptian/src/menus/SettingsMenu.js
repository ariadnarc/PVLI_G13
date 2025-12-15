/**
 * JSDOC
 * YA
 * A
 */

import MenuBase from './MenuBase.js';

export default class SettingsMenu extends MenuBase {

  constructor(data) {
    super('SettingsMenu', data);
  }

  create() {
    super.create();   //configura ESC
    this.scene.bringToTop(); //asegura q el menu este encima de todo
    const { width, height } = this.sys.game.config;
    this.soundValue = this.game.sound.volume;

    //fondo
    this.add.rectangle(0, 0, width, height, 0x00000000, 0.90).setOrigin(0).setDepth(2000);

    this.add.text(width / 2, 100, 'AJUSTES DE SONIDO', {
      fontFamily: 'Filgaia',
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(2001);

    //texto volumen
    this.volumeText = this.add.text(width / 2, 180,
      `Volumen: ${(0.5 * 100).toFixed(0)}%`,
      { fontFamily: 'Filgaia', fontSize: '22px', color: '#ffffffff' }
    ).setOrigin(0.5).setDepth(2001);

    //slider
    const barWidth = 200;
    const bar = this.add.rectangle(width / 2, 230, barWidth, 10, 0xffffff).setDepth(2001);
    const handle = this.add.rectangle(width / 2, 230, 20, 20, 0xffff00).setInteractive().setDepth(2002);

    handle.on('pointerdown', () => {
      this.input.on('pointermove', (movePointer) => {
        const newX = Phaser.Math.Clamp(movePointer.x,
          width / 2 - barWidth / 2,
          width / 2 + barWidth / 2
        );
        handle.x = newX;
        this.soundValue = Phaser.Math.Clamp(
          (newX - (width / 2 - barWidth / 2)) / barWidth,
          0, 1
        );
        this.game.sound.volume = this.soundValue;
        this.volumeText.setText(`Volumen: ${(this.soundValue * 100).toFixed(0)}%`);
      });
    });

    this.input.on('pointerup', () => this.input.off('pointermove'));

    //boton volver
    this.createButton("Volver", width / 2, 420, () => {
      this.sound.play("click");
      this.onEscape(); // reusar comportamiento por defecto
    }, { width: 250, height: 60, hoverTint: 0xffaa00, fontSize: '28px' },
      'fondoBoton').setDepth(2002);
  }

  update() {
    if (this.inputManager) this.inputManager.update();
  }

  onEscape() {
    super.onEscape(); //cierra menu y resume esecena padre
  }
}
