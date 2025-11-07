export default class minijuegoJuan extends Phaser.Scene {
  constructor() {
    super('minijuegoJuan');
  }

  create() {
    // ÁREA DE JUEGO
    this.gameWidth = 400;
    this.gameHeight = 300;

    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // Área jugable
    const border = this.add.rectangle(centerX, centerY, this.gameWidth, this.gameHeight);
    border.setStrokeStyle(3, 0xffffff);

    // JUGADOR
    this.player = this.add.rectangle(centerX, centerY, 20, 20, 0x3498db);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);

    // Limita la física al área visible
    this.physics.world.setBounds(
      centerX - this.gameWidth / 2,
      centerY - this.gameHeight / 2,
      this.gameWidth,
      this.gameHeight
    );

    // Controles de movimiento
    this.cursors = this.input.keyboard.createCursorKeys();
    this.playerSpeed = 200;

    // GRUPO DE PROYECTILES
    this.bullets = this.physics.add.group();

    // VIDA
    this.maxHealth = 3;
    this.health = this.maxHealth;

    // Barra de vida visual
    this.healthBarBg = this.add.rectangle(centerX, 40, 120, 20, 0x333333);
    this.healthBar = this.add.rectangle(centerX - 60, 40, 120, 20, 0xff4444).setOrigin(0, 0.5);
    this.healthText = this.add.text(centerX, 70, `Vida: ${this.health}`, {
      fontSize: '16px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // TIEMPO
    this.totalTime = 3; // segundos para ganar
    this.remainingTime = this.totalTime;

    // Texto del temporizador
    this.timerText = this.add.text(centerX, 100, `Tiempo: ${this.remainingTime}`, {
      fontSize: '18px',
      color: '#ffff66'
    }).setOrigin(0.5);

    // Evento que actualiza el contador cada segundo
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true
    });

    // Colisión entre jugador y proyectiles
    this.physics.add.overlap(this.player, this.bullets, this.hitPlayer, null, this);

    // GENERACIÓN DE PROYECTILES
    // Cada cierto tiempo se genera un cilidrolo de esos
    this.bulletDelay = 700; // ms entre cada proyectil al inicio
    this.bulletTimer = this.time.addEvent({
      delay: this.bulletDelay,
      callback: this.spawnCylinder,
      callbackScope: this,
      loop: true
    });
  }

  update() {
    const body = this.player.body;
    body.setVelocity(0);

    if (this.cursors.left.isDown) body.setVelocityX(-this.playerSpeed);
    else if (this.cursors.right.isDown) body.setVelocityX(this.playerSpeed);

    if (this.cursors.up.isDown) body.setVelocityY(-this.playerSpeed);
    else if (this.cursors.down.isDown) body.setVelocityY(this.playerSpeed);
  }

  // TEMPORIZADOR
  updateTimer() {
    if (this.health <= 0) return; // si el jugador está muerto, no seguir

    this.remainingTime--;
    this.timerText.setText(`Tiempo: ${this.remainingTime}`);

    // Aumentar dificultad progresivamente según el tiempo transcurrido
    const progress = 1 - this.remainingTime / this.totalTime;

    // Aumenta la velocidad base de los proyectiles
    this.bulletSpeedBoost = 1 + 1.1 * progress;

    // Si el tiempo llega a 0 -> gana
    if (this.remainingTime <= 0) {
      this.winGame();
    }
  }

  // generación de proyectiles
  spawnCylinder() {
    // cuánto fuera del borde queremos generar los cilindros (en píxeles)
    const spawnOffset = 100;

    const side = Phaser.Math.Between(0, 3); // de qué lado aparece
    let x, y, width, height;
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // Velocidad base variable según dificultad
    const baseSpeed = 120 + Phaser.Math.Between(0, 80);
    const speed = baseSpeed * (this.bulletSpeedBoost || 1);

    // Nota: aquí usamos spawnOffset para separar el punto de generación del borde
    // del área jugable, evitando que aparezcan "pegados" al rectángulo.
    if (side === 0) { // desde arriba
      x = Phaser.Math.Between(centerX - this.gameWidth / 2, centerX + this.gameWidth / 2);
      y = centerY - this.gameHeight / 2 - spawnOffset; // más arriba que antes
      width = 15;
      height = 40;
    } else if (side === 1) { // desde abajo
      x = Phaser.Math.Between(centerX - this.gameWidth / 2, centerX + this.gameWidth / 2);
      y = centerY + this.gameHeight / 2 + spawnOffset; // más abajo que antes
      width = 15;
      height = 40;
    } else if (side === 2) { // desde izquierda
      x = centerX - this.gameWidth / 2 - spawnOffset; // más a la izquierda
      y = Phaser.Math.Between(centerY - this.gameHeight / 2, centerY + this.gameHeight / 2);
      width = 40;
      height = 15;
    } else { // desde derecha
      x = centerX + this.gameWidth / 2 + spawnOffset; // más a la derecha
      y = Phaser.Math.Between(centerY - this.gameHeight / 2, centerY + this.gameHeight / 2);
      width = 40;
      height = 15;
    }

    const cyl = this.add.rectangle(x, y, width, height, 0xff9900);
    this.physics.add.existing(cyl);
    this.bullets.add(cyl);

    // Ángulo hacia el jugador
    const angle = Phaser.Math.Angle.Between(x, y, this.player.x, this.player.y);
    cyl.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

    // Mantener comportamiento ya añadido (rebotes/rotación) — lo dejamos igual
    if (this.remainingTime < this.totalTime / 2) {
      const random = Phaser.Math.Between(0, 100);
      if (random < 30) {
        cyl.body.setBounce(1, 1);
        cyl.body.setCollideWorldBounds(true);
      }
      if (random > 70) {
        cyl.rotationSpeed = Phaser.Math.FloatBetween(-0.05, 0.05);
      }
    }

    cyl.update = () => {
      if (cyl.rotationSpeed) cyl.rotation += cyl.rotationSpeed;
    };

    // Destruir pasado un tiempo
    this.time.delayedCall(5000, () => cyl.destroy(), [], this);
  }

  // COLISIÖN CON EL JUGADOR
  hitPlayer(player, cyl) {
    cyl.destroy(); // eliminar proyectil
    this.health--; // restar vida

    // Actualizar texto y barra de vida
    this.healthText.setText(`Vida: ${this.health}`);
    this.healthBar.width = 120 * (this.health / this.maxHealth);

    // Si la vida llega a 0 → derrota
    if (this.health <= 0) this.loseGame();
  }

  // VICTORIA
  winGame() {
    this.physics.pause(); // detener físicas
    this.bulletTimer.remove(false);
    this.timerEvent.remove(false);

    // Cambiar de escena al ganar
    this.scene.stop();
    this.scene.launch('VictoriaUI'); //LAUNCH HACE QUE LAS ESCENAS SE APILEN
    // CON START LAS REEMPLAZAMOS, QUE ESTÁ BIEN, PERO A LO MEJOR PARA ESTO NO ES LO MEJOR
  }

  // DERROTA
  loseGame() {
    this.physics.pause();

    // Reinicia la escena después de 2 segundos por conveniencia para el hito 2
    this.time.delayedCall(2000, () => this.scene.restart(), [], this);
  }
}