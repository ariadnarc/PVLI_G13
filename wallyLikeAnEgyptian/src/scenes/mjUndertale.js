import { DIFICULTADES } from '../config/MinigameData.js';
import InputManager from '../core/InputManager.js';
import PlayerManager from '../core/PlayerManager.js';
import { playerInitialData } from '../config/PlayerData.js';

export default class Undertale extends Phaser.Scene {
  constructor() {
    super('Undertale');
  }

  init(data = {}){
    this.isMinigame = true;

    // Guardamos el minijuego
    this.minijuego = data.minijuego;

    // Dificultad elegida
    this.difficulty = data.dificultad;
  }

  create() {

    const config = DIFICULTADES[this.difficulty].minijuegos.Undertale;
    const centerX = this.cameras.main.centerX; // Obtiene el centro X de la cámara principal
    const centerY = this.cameras.main.centerY; // Obtiene el centro Y de la cámara principal

    // FONDOS
    this.add.image(centerX, centerY, 'paredBG') // general
    const arenaBg = this.add.image(centerX, centerY, 'fondoUndertale');; // de la zona de juego
    // Área de juego
    this.gameWidth = 400; // Ancho del área jugable en píxeles
    this.gameHeight = 300; // Alto del área jugable en píxeles
    arenaBg.setDisplaySize(this.gameWidth, this.gameHeight);

    // INPUTMANAGER
    this.inputManager = new InputManager(this);
    this.inputManager.configure({
      cursors: true,
    });

    // JUGADOR
    this.playerManager = new PlayerManager(this.inputManager, this,playerInitialData);
    this.player = this.playerManager.getSprite();
    this.player.setPosition(centerX, centerY);

    // Dibuja el borde del área jugable (dsps de meter el fondo obligatorio)
    const border = this.add.rectangle(centerX, centerY, this.gameWidth, this.gameHeight); // Crea rectángulo en el centro
    border.setStrokeStyle(3, 0xffffff); // Aplica borde blanco de 3px de grosor

    // Establece los límites del mundo de físicas al área visible
    this.physics.world.setBounds(
      centerX - this.gameWidth / 2, // Límite izquierdo
      centerY - this.gameHeight / 2, // Límite superior
      this.gameWidth, // Ancho del área
      this.gameHeight // Alto del área
    );
    this.playerManager.sprite.setCollideWorldBounds(true); // evita q el player salga

    // ========== CONTROLES ==========
    this.playerSpeed = 200; // Define velocidad de movimiento del jugador en píxeles/segundo

    // ========== GRUPO DE PROYECTILES ==========
    this.bullets = this.physics.add.group(); // Crea grupo de física para gestionar proyectiles

    // -VIDA-
    this.health = config.vidas; // Lo único que vamos a cambiar dependiendo de la dificultad
    this.maxHealth = this.health; // para hacer la barraVida
    this.isInvulnerable = false; // Estado de invencibilidad del jugador
    this.invulnerabilityDuration = 1500; // Duración de invencibilidad en milisegundos
    this.barraVidabg = this.add.rectangle(centerX, 40, 120, 20, 0x333333); // Ractángulo vida background
    this.barraVida = this.add.rectangle(centerX - 60, 40, 120, 20, 0xff4444).setOrigin(0, 0.5); // Rectángulo vida activa
    // Texto que muestra la vida numérica
    this.healthText = this.add.text(centerX, 70, `Vida: ${this.health}`, {
      fontSize: '16px',
      color: '#ffffff'
    }).setOrigin(0.5); // Centra el texto

    // ========== SISTEMA DE TIEMPO ==========
    this.remainingTime = 30; // Inicializa tiempo restante

    // Texto del contador de tiempo
    this.timerText = this.add.text(centerX, 100, `Tiempo: ${this.remainingTime}`, {
      fontSize: '18px', // Tamaño de fuente
      color: '#ffff66' // Color amarillo claro
    }).setOrigin(0.5); // Centra el texto

    // Timer que decrementa el contador cada segundo
    this.timerEvent = this.time.addEvent({
      delay: 1000, // Ejecuta cada 1000ms (1 segundo)
      callback: this.updateTimer, // Función a ejecutar
      callbackScope: this, // Contexto de 'this' en el callback
      loop: true // Se repite indefinidamente
    });

    // ========== COLISIONES ==========
    this.physics.add.overlap(this.player, this.bullets, this.hitPlayer, null, this); // Detecta superposición entre jugador y proyectiles

    // ========== SISTEMA DE PATRONES DE ATAQUE ==========
    this.attackPhase = 1; // Inicializa fase de ataque en 1
    this.patternTimer = this.time.addEvent({
      delay: 10000, // Cambia de patrón cada 10 segundos
      callback: () => { // Función anónima que ejecuta al cumplirse el delay
        this.attackPhase++; // Incrementa la fase de ataque
        if (this.attackPhase > 0)
          this.changePhase(this.attackPhase); // Cambiamos el switch de fases que toma el valor de la fase de ataque
        this.showPhaseWarning(this.attackPhase); // Muestra aviso visual del cambio de patrón
      },
      callbackScope: this, // Contexto de 'this' en el callback
      loop: true // Se repite indefinidamente
    });

    // ========== SISTEMA DE FASES (DIFICULTAD) ==========
    this.phase = 1; // Inicializa fase de dificultad en 1
    this.changePhase(1); // Configura la fase inicial
  }

  update() {

    this.inputManager.update();
    this.playerManager.update();

    //TODO :
    const body = this.player.body; // Obtiene referencia al cuerpo físico del jugador
  }

  // ========== ACTUALIZACIÓN DEL TEMPORIZADOR ==========
  updateTimer() {
    if (this.health <= 0) return; // Sale si el jugador está muerto

    this.remainingTime--; // Decrementa tiempo restante
    this.timerText.setText(`SOBREVIVE: ${this.remainingTime}`); // Actualiza texto del timer

    // Victoria cuando el tiempo llega a 0
    if (this.remainingTime <= 0) {
      this.winGame(); // Ejecuta función de victoria
    }
  }

  // ========== GENERACIÓN DE PROYECTILES SEGÚN PATRÓN ==========
  spawnCylinder() {
    const centerX = this.cameras.main.centerX; // Centro X de la cámara
    const centerY = this.cameras.main.centerY; // Centro Y de la cámara

    // Selecciona patrón según la fase de ataque actual
    switch (this.attackPhase) {
      case 1: // Patrón dirigido al jugador
        this.spawnDagasAttack();
        break;
      case 2: // Ataque de Undyne
        this.spawnCircleWave(centerX, centerY);
        break;
      case 3: // Patrón de barrido horizontal/vertical
        this.spawnSweep(centerX, centerY);
        break;
    }
  }

  spawnDagasAttack() {

    const cam = this.cameras.main;
    const gameWidth = cam.width;

    // 1. La posición Y se basa en la posición del jugador
    const spawnY = this.player.y;

    // 2. Decide si aparece por la izquierda o derecha
    const fromLeft = Phaser.Math.Between(0, 1) === 0;
    const spawnX = fromLeft ? + 80 : gameWidth - 80;

    // 3. Crear cilindro
    const cyl = this.add.rectangle(spawnX, spawnY, 100, 25, 0x000000);
    this.physics.add.existing(cyl);
    this.bullets.add(cyl);

    // Velocidad final (solo en horizontal)
    const attackSpeed = 600;

    // 4. Animación de aviso (retroceso corto)
    const retreatX = fromLeft ? spawnX - 30 : spawnX + 30;

    this.tweens.add({
      targets: cyl,
      x: retreatX,
      duration: 500,
      onComplete: () => {
        // 5. Ataque en línea recta horizontal
        const velocity = fromLeft ? attackSpeed : -attackSpeed;
        cyl.body.setVelocityX(velocity);
      }
    });
  }



  // ========== PATRÓN 2: CÍRCULO CONVERGENTE ==========
  spawnCircleWave() {
    const centerX = this.player.x;
    const centerY = this.player.y;

    const numProjectiles = 8;
    const radius = 240;
    const speed = 140;
    const pauseTime = 500;

    for (let i = 0; i < numProjectiles; i++) {

      const angle = (i / numProjectiles) * Phaser.Math.PI2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      const cyl = this.add.rectangle(x, y, 20, 20, 0xff3333);
      this.physics.add.existing(cyl);
      this.bullets.add(cyl);

      // Inicialmente velocidad cero
      cyl.body.setVelocity(0, 0);

      // Después del pauseTime, empieza a moverse hacia el jugador
      this.time.delayedCall(pauseTime, () => {
        cyl.body.setVelocity(-Math.cos(angle) * speed, -Math.sin(angle) * speed);

        // Destruir automáticamente después de 2,7s
        this.time.delayedCall(2700, () => cyl.destroy(), [], this);
      }, [], this);
    }
  }

  // ========== PATRÓN 3: BARRIDO HORIZONTAL/VERTICAL ==========
  spawnSweep(centerX, centerY) {
    const horizontal = Phaser.Math.Between(0, 1) === 0; // Decide aleatoriamente si es horizontal (true) o vertical (false)
    const numProjectiles = 8; // Número de proyectiles en el barrido
    const speed = 120; // Velocidad de los cilindros

    // Crea línea de proyectiles
    for (let i = 0; i < numProjectiles; i++) {
      const totalSpread = (numProjectiles - 1) * 40; // Calcula ancho total dinámicamente
      const startOffset = -totalSpread / 2; // Centra el punto inicial
      const offset = startOffset + (i * 40); // Distribución centrada

      let x, y, vx, vy; // Variables para posición y velocidad

      if (horizontal) { // Barrido horizontal
        x = (Phaser.Math.Between(0, 1) === 0) // Decide aleatoriamente lado de aparición
          ? centerX - this.gameWidth / 2 - 100 // Aparece a la izquierda
          : centerX + this.gameWidth / 2 + 100; // Aparece a la derecha
        y = centerY + offset; // Y distribuido verticalmente
        vx = (x < centerX) ? speed : -speed; // Velocidad hacia el centro horizontal
        vy = 0; // Sin movimiento vertical
      } else { // Barrido vertical
        y = (Phaser.Math.Between(0, 1) === 0) // Decide aleatoriamente lado de aparición
          ? centerY - this.gameHeight / 2 - 100 // Aparece arriba
          : centerY + this.gameHeight / 2 + 100; // Aparece abajo
        x = centerX + offset; // X distribuido horizontalmente
        vy = (y < centerY) ? speed : -speed; // Velocidad hacia el centro vertical
        vx = 0; // Sin movimiento horizontal
      }

      const cyl = this.add.rectangle(x, y, 20, 20, 0x66ccff); // Crea cuadrado azul claro
      this.physics.add.existing(cyl); // Añade físicas
      this.bullets.add(cyl); // Añade al grupo
      cyl.body.setVelocity(vx, vy); // Aplica velocidad calculada
      this.time.delayedCall(4000, () => cyl.destroy(), [], this); // Destruye después de 4 segundos
    }
  }

  // ========== AVISO VISUAL DE CAMBIO DE PATRÓN ==========
  showPhaseWarning(phase) {
    const centerX = this.cameras.main.centerX; // Centro X de la cámara
    const centerY = this.cameras.main.centerY; // Centro Y de la cámara

    // Determina nombre del patrón según la fase
    let phaseName;
    switch (phase) {
      case 1: phaseName = "¡Fase 1!"; break; // Nombre para patrón 1
      case 2: phaseName = "¡Fase 2!"; break; // Nombre para patrón 2
      case 3: phaseName = "¡Fase 3!"; break; // Nombre para patrón 3
    }

    // Crea texto de aviso centrado
    const warningText = this.add.text(centerX, centerY, phaseName, {
      fontSize: '28px', // Tamaño grande
      color: '#ff3333', // Color rojo
      fontStyle: 'bold', // Negrita
      stroke: '#ffffff', // Borde blanco
      strokeThickness: 4 // Grosor del borde
    }).setOrigin(0.5); // Centra el texto

    // Animación de aparición del texto
    this.tweens.add({
      targets: warningText, // Objeto a animar
      scale: { from: 0.5, to: 1.2 }, // Escala de 0.5 a 1.2
      alpha: { from: 0, to: 1 }, // Opacidad de 0 a 1
      duration: 300, // Duración de 300ms
      yoyo: true, // Revierte la animación
      hold: 300, // Mantiene por 300ms antes de revertir
      onComplete: () => { // Al completar la primera animación
        this.tweens.add({ // Inicia segunda animación
          targets: warningText, // Mismo texto
          alpha: 0, // Desvanece a transparente
          duration: 500, // En 500ms
          onComplete: () => warningText.destroy() // Destruye el texto al terminar
        });
      }
    });

    // Crea rectángulo para efecto de parpadeo del borde
    const borderFlash = this.add.rectangle(centerX, centerY, this.gameWidth, this.gameHeight)
      .setStrokeStyle(4, 0x000000) // Borde amarillo de 4px
      .setAlpha(0); // Inicialmente invisible

    // Animación de parpadeo del borde
    this.tweens.add({
      targets: borderFlash, // Objeto a animar
      alpha: { from: 0, to: 1 }, // Opacidad de 0 a 1
      duration: 150, // Duración de 150ms
      repeat: 4, // Repite 4 veces
      yoyo: true, // Alterna entre valores
      onComplete: () => borderFlash.destroy() // Destruye al terminar
    });
  }

  // ========== CAMBIO DE FASE DE DIFICULTAD ==========
  changePhase(newPhase) {
    this.phase = newPhase; // Actualiza fase actual

    // Detiene timers anteriores si existen
    if (this.bulletTimer) this.bulletTimer.remove(false); // Elimina timer de proyectiles sin destruir callbacks
    if (this.circleTimer) this.circleTimer.remove(false); // Elimina timer de círculos sin destruir callbacks

    // Configura parámetros según la nueva fase
    switch (newPhase) {
      case 1: // Fase 1: Solo proyectiles dirigidos rápidos
        this.bulletDelay = 400; // Dispara cada 400ms
        this.bulletTimer = this.time.addEvent({
          delay: this.bulletDelay, // Delay configurado
          callback: this.spawnCylinder, // Función de generación
          callbackScope: this, // Contexto de this
          loop: true // Se repite indefinidamente
        });
        break;

      case 2: // Fase 2: Solo círculos convergentes lentos
        this.bulletDelay = 1800; // Convergen cada 1,8s
        this.bulletTimer = this.time.addEvent({
          delay: this.bulletDelay, // Delay configurado
          callback: this.spawnCircleWave, // Función de círculo
          callbackScope: this, // Contexto de this
          loop: true // Se repite indefinidamente
        });
        break;

      case 3: // Fase 3: Combinación de dirigidos rápidos + círculos
        this.bulletDelay = 2000; // Barrido cada 2s
        this.bulletTimer = this.time.addEvent({
          delay: this.bulletDelay, // Delay configurado
          callback: this.spawnCylinder, // Función de generación
          callbackScope: this, // Contexto de this
          loop: true // Se repite indefinidamente
        });
        break;
    }
  }

  // ========== COLISIÓN JUGADOR-PROYECTIL ==========
  hitPlayer(player, cyl) {
    // Ignora colisión si el jugador es invulnerable
    if (this.isInvulnerable) return;

    cyl.destroy(); // Elimina el proyectil que impactó
    this.health--; // Reduce vida del jugador en 1

    // Actualiza interfaz de vida
    this.healthText.setText(`Vida: ${this.health}`); // Actualiza texto numérico
    this.barraVida.width = 120 * (this.health / this.maxHealth); // Ajusta ancho de barra proporcionalmente

    // Activa invencibilidad
    this.activateInvulnerability();

    // Verifica condición de derrota
    if (this.health <= 0) this.loseGame(); // Ejecuta función de derrota
  }

  // ========== SISTEMA DE INVENCIBILIDAD ==========
  activateInvulnerability() {
    this.isInvulnerable = true; // Activa estado de invencibilidad

    // Efecto visual de parpadeo
    this.tweens.add({
      targets: this.player, // El jugador es el objeto a animar
      alpha: 0.3, // Reduce opacidad a 30%
      duration: 100, // Duración de cada parpadeo: 100ms
      yoyo: true, // Alterna entre valores (0.3 y 1)
      repeat: 5, // Repite 7 veces (total: 8 cambios en 1600ms aprox)
      onComplete: () => { // Al terminar la animación
        this.player.alpha = 1; // Restaura opacidad completa
        this.isInvulnerable = false; // Desactiva invencibilidad
      }
    });

    // Timer de seguridad para desactivar invencibilidad
    this.time.delayedCall(this.invulnerabilityDuration, () => {
      this.isInvulnerable = false; // Garantiza que se desactive después del tiempo
      this.player.alpha = 1; // Garantiza opacidad completa
    }, [], this);
  }

  // ========== VICTORIA ==========
  winGame() {
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
                this.scene.start('Undertale', { minijuego: this.minijuego,dificultad: this.difficulty });
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

// SPRITES

// CASE 1: serpientes desde arriba*
// CASE 2: escudos que giran / arma circular que gira*
// CASE 3: espadas rollo egipcio
// FONDO: lo que salga (wait team)
// BG ZONA JUGADOR: arena? desde arriba*
// BORDE: cactus?
// VIDAS: corazonzitos*
// PLAYER: rostro del character que elijamos para ser prota (wait team)*
// *: animado
