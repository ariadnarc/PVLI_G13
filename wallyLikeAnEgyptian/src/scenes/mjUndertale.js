import { DIFICULTADES } from '../config/MinigameData.js';
import InputManager from '../core/InputManager.js';
import PlayerManager from '../core/PlayerManager.js';
import { playerInitialData } from '../config/PlayerData.js';

export default class Undertale extends Phaser.Scene {
  constructor() {
    super('Undertale');
  }

  init(data = {}) {
    this.isMinigame = true;
    this.minijuego = data.minijuego;
    this.difficulty = data.dificultad;
  }

  create() {
    const config = DIFICULTADES[this.difficulty].minijuegos.Undertale;
    const cx = this.cameras.main.centerX;
    const cy = this.cameras.main.centerY;

    // =================== FONDO ===================
    this.add.image(cx, cy, 'paredBG');
    const arenaBg = this.add.image(cx, cy, 'fondoUndertale');
    this.gameWidth = 400;
    this.gameHeight = 300;
    arenaBg.setDisplaySize(this.gameWidth, this.gameHeight);

    const border = this.add.rectangle(cx, cy, this.gameWidth, this.gameHeight);
    border.setStrokeStyle(3, 0xffffff);

    this.physics.world.setBounds(
      cx - this.gameWidth / 2,
      cy - this.gameHeight / 2,
      this.gameWidth,
      this.gameHeight
    );

    // =================== INPUT / PLAYER ===================
    this.inputManager = new InputManager(this);
    this.inputManager.configure({ cursors: true });

    this.playerManager = new PlayerManager(this.inputManager, this, playerInitialData);
    this.player = this.playerManager.getSprite();
    this.player.setPosition(cx, cy);
    this.player.setCollideWorldBounds(true);

    // =================== PROYECTILES ===================
    this.bullets = this.physics.add.group();

    // =================== VIDA ===================
    this.health = config.vidas;
    this.maxHealth = this.health;
    this.isInvulnerable = false;
    this.invulnerabilityDuration = 1500;

    this.barraVidabg = this.add.rectangle(cx, 40, 120, 20, 0x333333);
    this.barraVida = this.add.rectangle(cx - 60, 40, 120, 20, 0xff4444)
      .setOrigin(0, 0.5);

    this.healthText = this.add.text(cx, 70, `Vida: ${this.health}`, {
      fontSize: '16px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // =================== TIMER ===================
    this.remainingTime = 30;
    this.timerText = this.add.text(cx, 100, `SOBREVIVE: ${this.remainingTime}`, {
      fontSize: '18px',
      color: '#ffff66'
    }).setOrigin(0.5);

    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true
    });

    // =================== ANIMACIONES ===================
    this.anims.create({
      key: 'giragira',
      frames: this.anims.generateFrameNumbers('fase2obs', {
        start: 0,
        end: 1
      }),
      frameRate: 12,
      repeat: -1
    });

    // =================== COLISIONES ===================
    this.physics.add.overlap(
      this.player,
      this.bullets,
      this.hitPlayer,
      null,
      this
    );

    // =================== FASES ===================
    this.attackPhase = 1;
    this.changePhase(1);

    this.patternTimer = this.time.addEvent({
      delay: 10000,
      callback: () => {
        this.attackPhase++;
        if (this.attackPhase > 3) this.attackPhase = 1;
        this.changePhase(this.attackPhase);
        this.showPhaseWarning(this.attackPhase);
      },
      loop: true
    });

    this.sound.play('minigame-music');
  }

  update() {
    this.inputManager.update();
    this.playerManager.update();
  }

  // =====================================================
  // =============== FACTORY DE PROYECTILES ===============
  // =====================================================
  spawnProjectile({ x, y, texture, anim = null, hitbox }) {
    const proj = this.physics.add.sprite(x, y, texture);
    this.bullets.add(proj);

    if (hitbox) {
      proj.body.setSize(hitbox.w, hitbox.h, true);
    }

    if (anim) {
      proj.anims.play(anim);
    }

    return proj;
  }

  // =====================================================
  // ================== FASE 1 ===========================
  // =====================================================
  spawnDagasAttack() {
    const cam = this.cameras.main;
    const fromLeft = Phaser.Math.Between(0, 1) === 0;

    const spawnX = fromLeft
      ? cam.centerX - 300
      : cam.centerX + 300;

    const proj = this.spawnProjectile({
      x: spawnX,
      y: this.player.y,
      texture: 'fase1obs',
      hitbox: { w: 60, h: 16 }
    });

    const retreatX = fromLeft ? spawnX - 30 : spawnX + 30;

    this.tweens.add({
      targets: proj,
      x: retreatX,
      duration: 400,
      onComplete: () => {
        const speed = fromLeft ? 600 : -600;
        proj.body.setVelocityX(speed);
        this.time.delayedCall(3000, () => proj.destroy());
      }
    });
  }

  // =====================================================
  // ================== FASE 2 ===========================
  // =====================================================
  spawnCircleWave() {
    const cx = this.player.x;
    const cy = this.player.y;

    const count = 8;
    const radius = 240;
    const speed = 140;

    for (let i = 0; i < count; i++) {
      const angle = Phaser.Math.PI2 * (i / count);

      const proj = this.spawnProjectile({
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        texture: 'fase2obs',
        anim: 'girogiro',
        hitbox: { w: 18, h: 18 }
      });

      proj.body.setVelocity(0, 0);

      this.time.delayedCall(500, () => {
        proj.body.setVelocity(
          -Math.cos(angle) * speed,
          -Math.sin(angle) * speed
        );
        this.time.delayedCall(3000, () => proj.destroy());
      });
    }
  }

  // =====================================================
  // ================== FASE 3 ===========================
  // =====================================================
  spawnSweep() {
    const cx = this.cameras.main.centerX;
    const cy = this.cameras.main.centerY;
    const horizontal = Phaser.Math.Between(0, 1) === 0;

    for (let i = 0; i < 8; i++) {
      const offset = (i - 3.5) * 40;
      let x, y, vx, vy;

      if (horizontal) {
        x = Phaser.Math.Between(0, 1)
          ? cx - this.gameWidth / 2 - 80
          : cx + this.gameWidth / 2 + 80;
        y = cy + offset;
        vx = x < cx ? 120 : -120;
        vy = 0;
      } else {
        y = Phaser.Math.Between(0, 1)
          ? cy - this.gameHeight / 2 - 80
          : cy + this.gameHeight / 2 + 80;
        x = cx + offset;
        vx = 0;
        vy = y < cy ? 120 : -120;
      }

      const proj = this.spawnProjectile({
        x,
        y,
        texture: 'fase3obs',
        hitbox: { w: 20, h: 20 }
      });

      proj.body.setVelocity(vx, vy);
      this.time.delayedCall(4000, () => proj.destroy());
    }
  }

  // =====================================================
  changePhase(phase) {
    if (this.bulletTimer) this.bulletTimer.remove(false);

    let callback;
    let delay;

    switch (phase) {
      case 1:
        callback = this.spawnDagasAttack;
        delay = 400;
        break;
      case 2:
        callback = this.spawnCircleWave;
        delay = 1800;
        break;
      case 3:
        callback = this.spawnSweep;
        delay = 2000;
        break;
    }

    this.bulletTimer = this.time.addEvent({
      delay,
      callback,
      callbackScope: this,
      loop: true
    });
  }

  // =====================================================
  hitPlayer(player, proj) {
    if (this.isInvulnerable) return;

    proj.destroy();
    this.health--;

    this.healthText.setText(`Vida: ${this.health}`);
    this.barraVida.width = 120 * (this.health / this.maxHealth);

    this.activateInvulnerability();

    if (this.health <= 0) this.loseGame();
  }

  activateInvulnerability() {
    this.isInvulnerable = true;

    this.tweens.add({
      targets: this.player,
      alpha: 0.3,
      duration: 100,
      yoyo: true,
      repeat: 5,
      onComplete: () => {
        this.player.alpha = 1;
        this.isInvulnerable = false;
      }
    });

    this.time.delayedCall(this.invulnerabilityDuration, () => {
      this.isInvulnerable = false;
      this.player.alpha = 1;
    });
  }

  updateTimer() {
    if (this.health <= 0) return;
    this.remainingTime--;
    this.timerText.setText(`SOBREVIVE: ${this.remainingTime}`);
    if (this.remainingTime <= 0) this.winGame();
  }



  // ========== VICTORIA ==========
  winGame() {
    this.sound.stop();

    this.physics.pause(); // Detiene todas las físicas del juego
    if (this.bulletTimer) this.bulletTimer.remove(false); // Elimina timer de proyectiles
    if (this.timerEvent) this.timerEvent.remove(false); // Elimina timer del contador

    //lanza el PostMinigameMenu
    this.scene.launch('PostMinigameMenu', {
      result: 'victory',
      difficulty: this.difficulty,
      minijuego: 'Undertale',
      options: {
        "Volver al mapa": () => {
          this.scene.stop('PostMinigameMenu');
          this.scene.start('MapScene');
        }
      }
    });

    this.scene.stop(); //detiene la escena del minijuego
  }

  // ========== DERROTA ==========
  loseGame() {
    this.sound.stop();

    this.physics.pause(); // Detiene todas las fisicas del juego
    if (this.bulletTimer) this.bulletTimer.remove(false);
    if (this.timerEvent) this.timerEvent.remove(false);

    //lanzamos PostMinigameMenu con resultado defeat
    this.scene.launch('PostMinigameMenu', {
      result: 'defeat',
      difficulty: this.difficulty,
      minijuego: 'Undertale',
      options: {
        "Reintentar": () => {
          this.scene.stop('PostMinigameMenu');
          this.scene.stop();
          this.scene.start('Undertale', { minijuego: this.minijuego, dificultad: this.difficulty });
        },
        "Salir": () => {
          this.scene.stop('PostMinigameMenu');
          this.scene.stop();
          this.scene.start('MapScene');
        }
      }
    });

    //detenemos la escena actual
    this.scene.stop();
  }
}