import { DIFICULTADES } from '../config/MinigameData.js';
import InputManager from '../core/InputManager.js';
import PlayerManager from '../core/PlayerManager.js';
import { playerInitialData } from '../config/PlayerData.js';

/**
 * @typedef {Object} UndertaleMinigameConfig
 * @property {number} vidas La cantidad inicial de vida del jugador para esta dificultad
 */

/**
 * @typedef {Object} SceneData
 * @property {string} minijuego Nombre del minijuego
 * @property {string} dificultad Dificultad seleccionada
 */

/**
 * Mini-Juego inspirado en Undertale!! Un bullet hell de toda la vida
 * El objetivo es sobrevivir a las oleadas de proyectiles durante un tiempo determinado
 * @extends Phaser.Scene
 */
export default class Undertale extends Phaser.Scene {
  /**
   * Constructor de la escena.
   */
  constructor() {
    super('Undertale');

    /** @type {boolean} Indica si esta escena es un minijuego */
    this.isMinigame = true;
    /** @type {string} Nombre del minijuego */
    this.minijuego = '';
    /** @type {string} Dificultad del minijuego */
    this.difficulty = '';

    /** @type {number} Ancho del área de juego */
    this.gameWidth = 0;
    /** @type {number} Alto del área de juego */
    this.gameHeight = 0;

    /** @type {InputManager} Input Manager */
    this.inputManager = null;
    /** @type {PlayerManager} Player Manager */
    this.playerManager = null;
    /** @type {Phaser.Physics.Arcade.Sprite} Jugador */
    this.player = null;
    /** @type {Phaser.Physics.Arcade.Group} Proyectiles para las colisiones */
    this.bullets = null;

    /** @type {number} Vida actual del jugador */
    this.health = 0;
    /** @type {number} Vida máxima del jugador */
    this.maxHealth = 0;
    /** @type {boolean} Flajj de invulnerabilidad tras ser golpeado */
    this.isInvulnerable = false;
    /** @type {number} Duración de la invulnerabilidad en milisegundos */
    this.invulnerabilityDuration = 1500;
    /** @type {Phaser.GameObjects.Text} Objeto de texto para mostrar la vida */
    this.healthText = null;
    /** @type {Phaser.GameObjects.Rectangle} Lo mismo pero objeto rectángulo */
    this.barraVida = null;

    /** @type {number} Tiempo restante para ganar (seg.) */
    this.remainingTime = 0;
    /** @type {Phaser.GameObjects.Text} Objeto de texto para mostrar el tiempo restante */
    this.timerText = null;
    /** @type {Phaser.Time.TimerEvent} Temporizador para la cuenta atrás (event) */
    this.timerEvent = null;

    /** @type {number} Fase de ataque actual (1 - 3) */
    this.attackPhase = 1;
    /** @type {Phaser.Time.TimerEvent} Temporizador para generar proyectiles (event) */
    this.bulletTimer = null;
    /** @type {Phaser.Sound.BaseSound} Rolita */
    this.bgMusic = null;
  }

  /**
   * Inicializa la escena, cargando datos de configuración
   * @param {SceneData} data - Datos pasados a la escena, incluyendo el nombre del minijuego y la dificultad
   */
  init(data = {}) {
    this.isMinigame = true;
    this.minijuego = data.minijuego;
    this.difficulty = data.dificultad;
  }

  create() {
    /** @type {UndertaleMinigameConfig} Declaramos el config para poder declarar variaables que pasan pr dif.*/
    const config = DIFICULTADES[this.difficulty].minijuegos.Undertale;
    const cx = this.cameras.main.centerX;
    const cy = this.cameras.main.centerY;

    // Fondo, área de juego, físicas
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

    // Player
    this.inputManager = new InputManager(this);
    this.inputManager.configure({ cursors: true });

    this.playerManager = new PlayerManager(
      this.inputManager,
      this,
      playerInitialData
    );
    this.player = this.playerManager.getSprite();
    this.player.setPosition(cx, cy);
    this.player.setCollideWorldBounds(true);

    // Proyectiles
    this.bullets = this.physics.add.group();

    // Vida, invulnerabilty
    this.health = config.vidas;
    this.maxHealth = this.health;
    this.isInvulnerable = false;
    this.invulnerabilityDuration = 1500;

    this.barraVidabg = this.add.rectangle(cx, 40, 120, 20, 0x333333);
    this.barraVida = this.add
      .rectangle(cx - 60, 40, 120, 20, 0xff4444)
      .setOrigin(0, 0.5);

    this.healthText = this.add
      .text(cx, 70, `Vida: ${this.health}`, {
        fontSize: '16px',
        color: '#ffffff'
      })
      .setOrigin(0.5);

    // Tiempo de juego
    this.remainingTime = 30;
    this.timerText = this.add
      .text(cx, 100, `SOBREVIVE: ${this.remainingTime}`, {
        fontSize: '18px',
        color: '#ffff66'
      })
      .setOrigin(0.5);

    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true
    });

    // Anims (solo hay 1, las del player aquí no)
    this.anims.create({
      key: 'giragira',
      frames: this.anims.generateFrameNumbers('fase2obs', {
        start: 0,
        end: 1
      }),
      frameRate: 12,
      repeat: -1
    });

    // Colisiones
    this.physics.add.overlap(
      this.player,
      this.bullets,
      this.hitPlayer,
      null,
      this
    );

    // Fase y música
    // Juan: sé que es algo raro separarlo en 2 variables, pero
    // viene genial para hacer por un lado oleadas y proyectiles
    // y por el otro HUD, tldr, comodidad para programar
    this.attackPhase = 1;
    this.changePhase(1);

    /** @type {Phaser.Time.TimerEvent} Temporizador (event). */
    this.patternTimer = this.time.addEvent({
      delay: 10000, // 10 segs.
      callback: () => {
        this.attackPhase++;
        if (this.attackPhase > 3) this.attackPhase = 1;
        this.changePhase(this.attackPhase);
        this.showPhaseWarning(this.attackPhase);
      },
      loop: true
    });

    this.bgMusic = this.sound.add('minigame-music');
    this.bgMusic.play();
  }


  update() { // Player e Input
    this.inputManager.update();
    this.playerManager.update();
  }

  /**
   * Genera un nuevo proyectil físico en la escena y lo añade al grupo de balas.
   * @param {Object} options - Opciones para el proyectil
   * @param {number} options.x - Posición x inicial
   * @param {number} options.y - Posición y inicial
   * @param {string} options.texture - Nombre sprite
   * @param {string} [options.anim] - Animación (solo si queremos, declaramos como null)
   * @param {Object} [options.hitbox] - Configuración opcional para el tamaño del cuerpo de la física
   * @param {number} options.hitbox.w - Ancho del hitbox
   * @param {number} options.hitbox.h - Alto del hitbox
   * @param {number} [options.scale=1] - Escala del sprite
   * @param {number} [options.rotation=0] - Rotación inicial en radianes
   * @returns {Phaser.Physics.Arcade.Sprite} El nuevo objeto proyectil
   */
  spawnProjectile({ x, y, texture, anim = null, hitbox, scale = 1, rotation = 0 }) {
    const proj = this.physics.add.sprite(x, y, texture);
    this.bullets.add(proj);

    proj.setScale(scale);
    proj.setRotation(rotation);

    if (hitbox) {
      proj.body.setSize(hitbox.w, hitbox.h, true);
    }

    if (anim) {
      proj.anims.play(anim);
    }

    return proj;
  }

  /**
   * FASE 1
   * Dagas desde los 2 lados
   */
  spawnDagasAttack() {
    const cam = this.cameras.main;
    const fromLeft = Phaser.Math.Between(0, 1) === 0;

    const spawnX = fromLeft
      ? cam.centerX - 300
      : cam.centerX + 300;

    const rotation = fromLeft
      ? Phaser.Math.DegToRad(90)
      : Phaser.Math.DegToRad(-90);

    const proj = this.spawnProjectile({
      x: spawnX,
      y: this.player.y,
      texture: 'fase1obs',
      scale: 2,
      rotation,
      hitbox: { w: 30, h: 8 }
    });

    const retreatX = fromLeft ? spawnX - 30 : spawnX + 30;

    this.tweens.add({
      targets: proj,
      x: retreatX,
      duration: 400,
      onComplete: () => {
        proj.body.setVelocityX(fromLeft ? 600 : -600);
        this.time.delayedCall(3000, () => proj.destroy());
      }
    });
  }

  /**
   * FASE 2
   * Proyectiles que se mueven desde una posición circular hacia el centro (el jugador)
   */
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
        anim: 'giragira',
        hitbox: { w: 35, h: 35 },
        scale: 0.6,
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

  /**
   * FASE 3
   * Barrido doble lo largo de un eje
   */
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

      const rotation = horizontal
        ? Phaser.Math.DegToRad(90)
        : Phaser.Math.DegToRad(0);

      const proj = this.spawnProjectile({
        x,
        y,
        texture: 'fase3obs',
        scale: 1,
        rotation,
      });

      proj.body.setVelocity(vx, vy);
      if (horizontal) {
        if (vx < 0) {
          // derecha > izquierda
          proj.setRotation(Phaser.Math.DegToRad(-90));
        } else {
          // izquierda > derecha
          proj.setRotation(Phaser.Math.DegToRad(90));
        }

        proj.body.setSize(64, 10, true);

      } else {
        if (vy > 0) {
          // arriba > abajo
          proj.setRotation(Phaser.Math.DegToRad(180));
        } else {
          // abajo > arriba
          proj.setRotation(Phaser.Math.DegToRad(0));
        }

        proj.body.setSize(10, 64, true);
      }

      this.time.delayedCall(4000, () => proj.destroy());
    }
  }

  /**
   * CAMBIO FASE
   * Detiene el patrón de ataque actual e inicia uno nuevo
   * @param {number} phase - La nueva fase de ataque (1 - 3)
   */
  changePhase(phase) {
    if (this.bulletTimer) this.bulletTimer.remove(false);

    let callback, delay;

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

  /**
   * Texto de que cambiamos de fase
   * @param {number} phase - El número de la fase que comienza
   */
  showPhaseWarning(phase) {
    const cx = this.cameras.main.centerX;
    const cy = this.cameras.main.centerY;

    const text = this.add
      .text(cx, cy, `¡FASE ${phase}!`, {
        fontSize: '28px',
        color: '#ff3333',
        fontStyle: 'bold',
        stroke: '#ffffff',
        strokeThickness: 4
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: text,
      scale: { from: 0.5, to: 1.2 },
      alpha: { from: 0, to: 1 },
      duration: 300,
      yoyo: true,
      hold: 300,
      onComplete: () => {
        this.tweens.add({
          targets: text,
          alpha: 0,
          duration: 500,
          onComplete: () => text.destroy()
        });
      }
    });
  }

  // ================= COLISIÓN =================

  /**
   * Colisión entre el jugador y un proyectil
   * Vida--, isInvulnerable = true llamando a otro método (el q está justo abajo)
   * @param {Phaser.Physics.Arcade.Sprite} player - El sprite del jugador
   * @param {Phaser.Physics.Arcade.Sprite} proj - El sprite del proyectil
   */
  hitPlayer(player, proj) {
    if (this.isInvulnerable) return;

    proj.destroy();
    this.health--;

    this.healthText.setText(`Vida: ${this.health}`);
    this.barraVida.width = 120 * (this.health / this.maxHealth);

    this.activateInvulnerability();

    if (this.health <= 0) this.loseGame();
  }

  /**
   * Gestión de la invulnerabilidad
   */
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

  /**
 * Temporizador
 */
  updateTimer() {
    if (this.health <= 0) return;

    this.remainingTime--;
    this.timerText.setText(`SOBREVIVE: ${this.remainingTime}`);

    if (this.remainingTime <= 0) {
      this.winGame();
    }
  }

  /**
   * WIN
   */
  winGame() {
    this.bgMusic.stop();
    this.physics.pause();

    if (this.bulletTimer) this.bulletTimer.remove(false);
    if (this.timerEvent) this.timerEvent.remove(false);

    this.scene.launch('PostMinigameMenu', {
      result: 'victory',
      difficulty: this.difficulty,
      minijuego: 'Undertale',
      options: {
        'Volver al mapa': () => {
          this.scene.stop('PostMinigameMenu');
          this.scene.start('MapScene');
        }
      }
    });

    this.scene.stop();
  }

  /**
   * LOSE
   */
  loseGame() {
    this.bgMusic.stop();
    this.physics.pause();

    if (this.bulletTimer) this.bulletTimer.remove(false);
    if (this.timerEvent) this.timerEvent.remove(false);

    this.scene.launch('PostMinigameMenu', {
      result: 'defeat',
      difficulty: this.difficulty,
      minijuego: 'Undertale',
      options: {
        Reintentar: () => {
          this.scene.stop('PostMinigameMenu');
          this.scene.restart({
            minijuego: this.minijuego,
            dificultad: this.difficulty
          });
        },
        Salir: () => {
          this.scene.stop('PostMinigameMenu');
          this.scene.start('MapScene');
        }
      }
    });

    this.scene.stop();
  }
}