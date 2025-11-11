export default class VictoryUI {
  constructor(scene, reward) {
    const tierColors = { S: '#ffcc00', A: '#ff6666', B: '#66ccff' };

    scene.add.text(
      scene.cameras.main.centerX,
      scene.cameras.main.centerY - 40,
      'Has conseguido:',
      { fontSize: '20px', color: '#000' }
    ).setOrigin(0.5);

    scene.add.image(
      scene.cameras.main.centerX,
      scene.cameras.main.centerY + 10,
      reward.imageKey
    ).setDisplaySize(80, 80);

    scene.add.text(
      scene.cameras.main.centerX,
      scene.cameras.main.centerY + 80,
      `Tier ${reward.tier}`,
      { fontSize: '22px', color: tierColors[reward.tier] || '#000' }
    ).setOrigin(0.5);
  }
}
