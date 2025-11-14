export default class BinnacleUI {
  constructor(scene, binnacleManager) {
    this.scene = scene;
    this.binnacle = binnacleManager;
    this.visible = false;
    this.container = null;

    this.createUI();
  }

  /** Crea los elementos visuales de la bitácora (inicialmente oculta) */
  createUI() {
    const { centerX, centerY, width, height } = this.scene.cameras.main;

    this.container = this.scene.add.container(centerX, centerY).setVisible(false);

    // Fondo translúcido
    const bg = this.scene.add.rectangle(0, 0, width * 0.7, height * 0.6, 0x000000, 0.8)
      .setOrigin(0.5)
      .setStrokeStyle(3, 0xffffff);

    // Título
    const title = this.scene.add.text(0, -height * 0.25, '📜 Bitácora de Jeroglíficos', {
      fontSize: '22px',
      color: '#ffff99',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Texto con los datos (se actualiza dinámicamente)
    this.textInfo = this.scene.add.text(0, 0, '', {
      fontSize: '18px',
      color: '#ffffff',
      align: 'center',
      lineSpacing: 8
    }).setOrigin(0.5);

    // Cerrar
    const closeBtn = this.scene.add.text(0, height * 0.22, '[ Cerrar - B ]', {
      fontSize: '16px',
      color: '#ff8888'
    }).setOrigin(0.5);

    this.container.add([bg, title, this.textInfo, closeBtn]);
  }

  /** Actualiza el contenido textual según los datos actuales */
  refreshData() {
    const data = this.binnacle.getSummary();
    const text = `
      Tier S: ${data.S}
      Tier A: ${data.A}
      Tier B: ${data.B}
    `;
    this.textInfo.setText(text);
  }

  /** Muestra u oculta la ventana */
  toggle() {
    this.visible = !this.visible;
    this.container.setVisible(this.visible);
    if (this.visible) this.refreshData();
  }

  /** Elimina la interfaz completamente (si se cambia de escena, por ejemplo) */
  destroy() {
    this.container.destroy();
  }
}
