/**
 * JSDOC
 * YA
 * A
 */

import MenuBase from './MenuBase.js';

export default class SettingsMenu extends MenuBase {

  constructor() {
    super('SettingsMenu');
    this.isOverlay = true;
  }

  init(data){
    this.menuConfig = data || {};
  }

  create() {
    super.create();   //configura ESC
    this.scene.bringToTop(); //asegura q el menu este encima de todo

    const { width, height } = this.sys.game.config;

    this.soundManager = this.registry.get('soundManager');
    this.soundValue = this.game.sound.volume;

    //fondo
    this.add.rectangle(0, 0, width, height, 0x00000000, 0.9).setOrigin(0).setDepth(2000);

    this.add.text(width / 2, 100, 'AJUSTES DE SONIDO', {
      fontFamily: 'Filgaia',
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(2001);

    //texto volumen
    this.volumeText = this.add.text(
      width / 2,
      180,
      `Volumen: ${(this.soundValue * 100).toFixed(0)}%`,
      { fontFamily: 'Filgaia', fontSize: '22px', color: '#ffffff' }
    ).setOrigin(0.5).setDepth(2001);

    //slider
    const barWidth = 200;
    const barX = width / 2 - barWidth / 2;

    this.add.rectangle(width / 2, 230, barWidth, 10, 0xffffff)
      .setDepth(2001);

    const handle = this.add.rectangle(
      barX + barWidth * this.soundValue,
      230,
      20,
      20,
      0xffff00
    ).setInteractive().setDepth(2002);

    handle.on('pointerdown', () => {
      this.input.on('pointermove', (pointer) => {
        const newX = Phaser.Math.Clamp(
          pointer.x,
          barX,
          barX + barWidth
        );

        handle.x = newX;

        this.soundValue = Phaser.Math.Clamp(
          (newX - barX) / barWidth,
          0,
          1
        );

        this.game.sound.volume = this.soundValue;
        this.volumeText.setText(
          `Volumen: ${(this.soundValue * 100).toFixed(0)}%`
        );
      });
    });

    this.input.on('pointerup', () => {
      this.input.off('pointermove');
    });

    //boton volver
    this.createButton(
      'Volver',
      width / 2,
      420,
      () => {
        this.soundManager.play('click');
        this.onEscape();
      },
      { width: 250, height: 60, hoverTint: 0xffaa00, fontSize: '28px' },
      'fondoBoton'
    ).setDepth(2002);
  
  }

  update() {
    if (this.inputManager) this.inputManager.update();
  }

}
