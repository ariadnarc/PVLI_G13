import MenuBase from './MenuBase.js';

export default class PostMinigameMenu extends MenuBase {
  constructor() {
    super('PostMinigameMenu');
  }

  init(data) {
    this.options = data?.options || {};
    this.menuConfig = data || {};
  }

  create() {
    super.create();

    const { width, height } = this.sys.game.config;
    const centerY = height / 2 + 100;

    const btnStyle = {
      fontSize: '22px',
      backgroundColor: '#ddd',
      color: '#000',
      padding: { x: 15, y: 8 },
    };

    const entries = Object.entries(this.options);
    const spacing = 220;
    const totalWidth = (entries.length - 1) * spacing;
    const startX = width / 2 - totalWidth / 2;

    entries.forEach(([label, callback], i) => {
      const x = startX + i * spacing;

      const btn = this.add.text(x, centerY, label, btnStyle)
        .setOrigin(0.5);

      this.inputManager.registerButton(btn, callback);
      this.menuElements.push(btn);
    });
  }

  onEscape() {
    // post-minigame typical behavior: back to map
    this.scene.stop();
    this.scene.start('MapScene');
  }
}
