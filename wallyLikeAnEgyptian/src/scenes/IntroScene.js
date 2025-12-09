import DialogText from '../core/DialogText.js';

export default class IntroScene extends Phaser.Scene{
    constructor (){
        super('IntroScene');
        this.dialogIndex=0;
        
    }

    preload(){
        this.load.json('dialog','wallyLikeAnEgyptian/src/config/dialogoIntroData.json');
    }

    create(){
        this.dialogData=this.cache.json.get('dialog').dialogos;

        // Crear ventana de dialogo
        this.dialogWindow = new DialogText(this, {
        windowHeight: 200,
        dialogSpeed:4,
        fontSize: 28,
        fontFamily: 'Filgaia'
        });

        // Mostrar el primer dialogo
        this.showDialog();

        // Avanzar dialogo
        this.input.keyboard.on('keydown-SPACE', () => { this.nextDialog(); }); // con space
        this.input.on('pointerdown', () => { this.nextDialog(); }); // con click

         // Crear botón de saltar al mapa
        this.createSkipButton();

  }

  showDialog() {
    if (this.dialogIndex >= this.dialogData.length) {
      this.scene.start('MapScene'); // o lo que quieras al final del diálogo
      return;
    }

    const line = this.dialogData[this.dialogIndex];
    const textToShow = line.speaker 
            ? `${line.speaker}: ${line.text || ''}` // si hay speaker, mostramos "Speaker: texto"
            : `${line.text || ''}`;                 // si no hay speaker, solo mostramos el texto


    this.dialogWindow.setText(textToShow,true);
  }


  nextDialog() {
    // Si el texto aún se está animando, mostrar todo de golpe
    if (this.dialogWindow.timedEvent && this.dialogWindow.timedEvent.getProgress() < 1) {
      const line = this.dialogData[this.dialogIndex];
      const textToShow = `${line.speaker}: ${line.text}`;
      this.dialogWindow.setText(textToShow, false);
    } else {
      // Avanzar al siguiente diálogo
      this.dialogIndex++;
      this.showDialog();
    }
  }

  createSkipButton() {
      const width = this.sys.game.config.width;
      const height = this.sys.game.config.height;

      const skipBtn = this.add.text(width - 120, height - 50, 'Ir al Mapa', {
        fontSize: 12,
        fontFamily: 'Filgaia',
        fill: '#00ff00',
        backgroundColor: '#000000',
        padding: { x: 10, y: 5 }
      }).setInteractive({ useHandCursor: true });

      skipBtn.on('pointerdown', () => {
        this.scene.start('MapScene'); 
      });

      skipBtn.on('pointerover', () => skipBtn.setStyle({ fill: '#ff0' }));
      skipBtn.on('pointerout', () => skipBtn.setStyle({ fill: '#00ff00' }));
    }
    
}