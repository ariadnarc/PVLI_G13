export default class minijuegoJuan extends Phaser.Scene {
  constructor() {
    super('minijuegoJuan'); // Registra la escena con el identificador 'minijuegoJuan'
  }

  create() {
    // ========== CONFIGURACIÓN DEL ÁREA DE JUEGO ==========
    this.gameWidth = 400; // Ancho del área jugable en píxeles
    this.gameHeight = 300; // Alto del área jugable en píxeles

    const centerX = this.cameras.main.centerX; // Obtiene el centro X de la cámara principal
    const centerY = this.cameras.main.centerY; // Obtiene el centro Y de la cámara principal

    // Dibuja el borde del área jugable
    const border = this.add.rectangle(centerX, centerY, this.gameWidth, this.gameHeight); // Crea rectángulo en el centro
    border.setStrokeStyle(3, 0xffffff); // Aplica borde blanco de 3px de grosor

    // ========== CONFIGURACIÓN DEL JUGADOR ==========
    this.player = this.add.rectangle(centerX, centerY, 20, 20, 0x000000); // Crea cuadrado azul de 20x20px
    this.physics.add.existing(this.player); // Añade físicas al jugador
    this.player.body.setCollideWorldBounds(true); // Impide que el jugador salga de los límites

    // Establece los límites del mundo de físicas al área visible
    this.physics.world.setBounds(
      centerX - this.gameWidth / 2, // Límite izquierdo
      centerY - this.gameHeight / 2, // Límite superior
      this.gameWidth, // Ancho del área
      this.gameHeight // Alto del área
    );

    // ========== CONTROLES ==========
    this.cursors = this.input.keyboard.createCursorKeys(); // Crea objeto con las teclas de dirección
    this.playerSpeed = 200; // Define velocidad de movimiento del jugador en píxeles/segundo

    // ========== GRUPO DE PROYECTILES ==========
    this.bullets = this.physics.add.group(); // Crea grupo de física para gestionar proyectiles

    // ========== SISTEMA DE VIDA ==========
    this.maxHealth = 3; // Define vida máxima del jugador
    this.health = this.maxHealth; // Inicializa vida actual al máximo
    this.isInvulnerable = false; // Estado de invencibilidad del jugador
    this.invulnerabilityDuration = 1500; // Duración de invencibilidad en milisegundos

    // Dibuja fondo de la barra de vida
    this.healthBarBg = this.add.rectangle(centerX, 40, 120, 20, 0x333333); // Rectángulo gris oscuro
    // Dibuja barra de vida activa
    this.healthBar = this.add.rectangle(centerX - 60, 40, 120, 20, 0xff4444).setOrigin(0, 0.5); // Rectángulo rojo alineado a la izquierda
    // Texto que muestra la vida numérica
    this.healthText = this.add.text(centerX, 70, `Vida: ${this.health}`, {
      fontSize: '16px', // Tamaño de fuente
      color: '#ffffff' // Color blanco
    }).setOrigin(0.5); // Centra el texto

    // ========== SISTEMA DE TIEMPO ==========
    this.totalTime = 30; // Segundos totales para completar el minijuego
    this.remainingTime = this.totalTime; // Inicializa tiempo restante

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
      delay: 10000, // Cambia de patrón cada 5 segundos
      callback: () => { // Función anónima que ejecuta al cumplirse el delay
        this.attackPhase++; // Incrementa la fase de ataque
        if (this.attackPhase > 3) this.attackPhase = 1; // Reinicia a fase 1 si supera 3
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
    const body = this.player.body; // Obtiene referencia al cuerpo físico del jugador
    body.setVelocity(0); // Resetea velocidad a 0 cada frame

    // Control de movimiento horizontal
    if (this.cursors.left.isDown) body.setVelocityX(-this.playerSpeed); // Mueve a la izquierda
    else if (this.cursors.right.isDown) body.setVelocityX(this.playerSpeed); // Mueve a la derecha

    // Control de movimiento vertical
    if (this.cursors.up.isDown) body.setVelocityY(-this.playerSpeed); // Mueve hacia arriba
    else if (this.cursors.down.isDown) body.setVelocityY(this.playerSpeed); // Mueve hacia abajo
  }

  // ========== ACTUALIZACIÓN DEL TEMPORIZADOR ==========
  updateTimer() {
    if (this.health <= 0) return; // Sale si el jugador está muerto

    this.remainingTime--; // Decrementa tiempo restante
    this.timerText.setText(`Tiempo: ${this.remainingTime}`); // Actualiza texto del timer

    /*
    // Cambia a fase 2 cuando quedan 7 segundos
    if (this.remainingTime === 7) this.changePhase(2);
    // Cambia a fase 3 cuando quedan 3 segundos
    if (this.remainingTime === 3) this.changePhase(3);
    */

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
        this.spawnDirectedProjectile(centerX, centerY);
        break;
      case 2: // Patrón de círculo convergente
        this.spawnCircleWave(centerX, centerY);
        break;
      case 3: // Patrón de barrido horizontal/vertical
        this.spawnSweep(centerX, centerY);
        break;
    }
  }

  // ========== PATRÓN 1: PROYECTIL DIRIGIDO ==========
  spawnDirectedProjectile(centerX, centerY) {
    const spawnOffset = 100; // Distancia fuera del área visible donde aparecen proyectiles
    const side = Phaser.Math.Between(0, 3); // Selecciona lado aleatorio (0-3)
    let x, y, width, height; // Variables para posición y tamaño del proyectil

    // Configura posición y tamaño según el lado seleccionado
    if (side === 0) { // Lado superior
      x = Phaser.Math.Between(centerX - this.gameWidth / 2, centerX + this.gameWidth / 2); // X aleatorio en el ancho
      y = centerY - this.gameHeight / 2 - spawnOffset; // Y fuera del borde superior
      width = 15; height = 40; // Proyectil vertical estrecho
    } else if (side === 1) { // Lado inferior
      x = Phaser.Math.Between(centerX - this.gameWidth / 2, centerX + this.gameWidth / 2); // X aleatorio en el ancho
      y = centerY + this.gameHeight / 2 + spawnOffset; // Y fuera del borde inferior
      width = 15; height = 40; // Proyectil vertical estrecho
    } else if (side === 2) { // Lado izquierdo
      x = centerX - this.gameWidth / 2 - spawnOffset; // X fuera del borde izquierdo
      y = Phaser.Math.Between(centerY - this.gameHeight / 2, centerY + this.gameHeight / 2); // Y aleatorio en el alto
      width = 40; height = 15; // Proyectil horizontal ancho
    } else { // Lado derecho
      x = centerX + this.gameWidth / 2 + spawnOffset; // X fuera del borde derecho
      y = Phaser.Math.Between(centerY - this.gameHeight / 2, centerY + this.gameHeight / 2); // Y aleatorio en el alto
      width = 40; height = 15; // Proyectil horizontal ancho
    }

    const cyl = this.add.rectangle(x, y, width, height, 0xff9900); // Crea rectángulo naranja
    this.physics.add.existing(cyl); // Añade físicas al proyectil
    this.bullets.add(cyl); // Añade proyectil al grupo

    // Calcula velocidad con componente aleatorio
    const baseSpeed = 120 + Phaser.Math.Between(0, 80); // Velocidad base entre 120-200
    const speed = baseSpeed * (this.bulletSpeedBoost || 1); // Aplica multiplicador si existe
    const angle = Phaser.Math.Angle.Between(x, y, this.player.x, this.player.y); // Calcula ángulo hacia el jugador
    cyl.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed); // Aplica velocidad en dirección del jugador

    this.time.delayedCall(5000, () => cyl.destroy(), [], this); // Destruye proyectil después de 5 segundos
  }

  // ========== PATRÓN 2: CÍRCULO CONVERGENTE ==========
  spawnCircleWave() {
    const centerX = this.player.x;
    const centerY = this.player.y;

    const numProjectiles = 8;
    const radius = 240;
    const speed = 140;
    const pauseTime = 500;
    const delayBetweenProjectiles = 200; // ms entre cada proyectil

    for (let i = 0; i < numProjectiles; i++) {
      this.time.delayedCall(i * delayBetweenProjectiles, () => {
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

          // Destruir automáticamente después de 2s
          this.time.delayedCall(2000, () => cyl.destroy(), [], this);
        }, [], this);
      }, [], this);
    }
  }

  // ========== PATRÓN 3: BARRIDO HORIZONTAL/VERTICAL ==========
  spawnSweep(centerX, centerY) {
    const horizontal = Phaser.Math.Between(0, 1) === 0; // Decide aleatoriamente si es horizontal (true) o vertical (false)
    const numProjectiles = 6; // Número de proyectiles en el barrido
    const speed = 200; // Velocidad de los cilindros

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
      case 1: phaseName = "¡Oleada dirigida!"; break; // Nombre para patrón 1
      case 2: phaseName = "¡Círculo convergente!"; break; // Nombre para patrón 2
      case 3: phaseName = "¡Barrido infernal!"; break; // Nombre para patrón 3
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
      .setStrokeStyle(4, 0xffff66) // Borde amarillo de 4px
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

    // Crea texto de aviso de cambio de fase
    const txt = this.add.text(this.cameras.main.centerX, 400, `FASE ${newPhase}`, {
      fontSize: '24px', // Tamaño mediano
      color: '#ffff00' // Color amarillo
    }).setOrigin(0.5); // Centra el texto

    // Animación de desvanecimiento del texto
    this.tweens.add({
      targets: txt, // Texto a animar
      alpha: 0, // Desvanece a transparente
      duration: 1500, // En 1.5 segundos
      onComplete: () => txt.destroy() // Destruye al terminar
    });

    // Configura parámetros según la nueva fase
    switch (newPhase) {
      case 1: // Fase 1: Solo proyectiles dirigidos rápidos
        this.bulletDelay = 700; // Dispara cada 700ms
        this.bulletTimer = this.time.addEvent({
          delay: this.bulletDelay, // Delay configurado
          callback: this.spawnCylinder, // Función de generación
          callbackScope: this, // Contexto de this
          loop: true // Se repite indefinidamente
        });
        break;

      case 2: // Fase 2: Solo círculos convergentes lentos
        this.bulletDelay = 2000; // Dispara cada 2 segundos
        this.bulletTimer = this.time.addEvent({
          delay: this.bulletDelay, // Delay configurado
          callback: this.spawnCircleWave, // Función de círculo
          callbackScope: this, // Contexto de this
          loop: true // Se repite indefinidamente
        });
        break;

      case 3: // Fase 3: Combinación de dirigidos rápidos + círculos
        this.bulletDelay = 1200; // Proyectiles dirigidos cada 1.2s
        this.bulletTimer = this.time.addEvent({
          delay: this.bulletDelay, // Delay configurado
          callback: this.spawnCylinder, // Función de generación
          callbackScope: this, // Contexto de this
          loop: true // Se repite indefinidamente
        });
        this.circleTimer = this.time.addEvent({ // Timer adicional para círculos
          delay: 4000, // Círculos cada 4 segundos
          callback: this.spawnCircleWave, // Función de círculo
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
    this.healthBar.width = 120 * (this.health / this.maxHealth); // Ajusta ancho de barra proporcionalmente

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
    this.bulletTimer.remove(false); // Elimina timer de proyectiles
    this.timerEvent.remove(false); // Elimina timer del contador

    this.scene.stop(); // Detiene esta escena
    this.scene.launch('VictoriaUI'); // Inicia escena de victoria (se apila sobre la actual)
  }

  // ========== DERROTA ==========
  loseGame() {
    this.physics.pause(); // Detiene todas las físicas del juego

    this.time.delayedCall(2000, () => this.scene.restart(), [], this); // Reinicia escena después de 2 segundos
  }
}