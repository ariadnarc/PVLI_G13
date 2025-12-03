export default class LockPick extends Phaser.Scene {
    constructor() {
        super('LockPick');
        
        // Constantes de configuración
        this.TENSION_INCREASE_RATE = 0.1;
        this.TENSION_DECREASE_RATE = 0.04;
        this.LOCK_ROTATION_SPEED = 0.1;
        this.PICK_MOVEMENT_SPEED = 120;
        this.MAX_LOCK_ROTATION = 90;
        this.RESISTANCE_THRESHOLD = 45;
        this.SWEET_WIDTH = 10;
        this.ROTATION_WIDTH = 20;
    }

    // Método de Phaser que carga recursos (imágenes, sonidos, etc.) antes de crear la escena
    preload() {
        this.load.image('lock_fondo', 'Wally Like an Egyptian/assets/minijuegos/minijuegoLock/lock_fondo.png');
        this.load.image('lock_ring', 'Wally Like an Egyptian/assets/minijuegos/minijuegoLock/lock_ring.png');
        this.load.image('lock_lock', 'Wally Like an Egyptian/assets/minijuegos/minijuegoLock/lock_lock.png');
        this.load.image('lock_lockpick', 'Wally Like an Egyptian/assets/minijuegos/minijuegoLock/lock_lockpick.png');
    }

    // Método de Phaser que se ejecuta una vez después de preload(). Aquí inicializas todo el juego
    create() {
        // Guarda el centro de la pantalla para posicionar elementos
        this.CENTER_X = this.cameras.main.centerX;
        this.CENTER_Y = this.cameras.main.centerY;

        // ------------- SPRITES DE LA CERRADURA ----------------

        // Fondos - this.add.image(x, y, clave_imagen) crea una imagen en la pantalla
        this.spr_fondo = this.add.image(this.CENTER_X, this.CENTER_Y + 150, 'lock_fondo');
        this.spr_fondo.setOrigin(0.5); // Establece el origen/punto de referencia al centro (0.5, 0.5)
        this.spr_fondo.setDisplaySize(260, 260); // Cambia el tamaño visual del sprite

        this.spr_fondo2 = this.add.image(this.CENTER_X, this.CENTER_Y - 150, 'lock_fondo');
        this.spr_fondo2.setOrigin(0.5);
        this.spr_fondo2.setDisplaySize(260, 260);

        // Aros exteriores (decorativos)
        this.spr_ring1 = this.add.image(this.CENTER_X, this.CENTER_Y - 150, 'lock_ring');
        this.spr_ring1.setOrigin(0.5);
        this.spr_ring1.setDisplaySize(250, 250);

        this.spr_ring2 = this.add.image(this.CENTER_X, this.CENTER_Y + 150, 'lock_ring');
        this.spr_ring2.setOrigin(0.5);
        this.spr_ring2.setDisplaySize(250, 250);

        // Cerradura (la parte que gira cuando forzas el candado)
        this.spr_lock1 = this.add.image(this.CENTER_X, this.CENTER_Y - 150, 'lock_lock');
        this.spr_lock1.setOrigin(0.5);
        this.spr_lock1.setDisplaySize(200, 200);

        this.spr_lock2 = this.add.image(this.CENTER_X, this.CENTER_Y + 150, 'lock_lock');
        this.spr_lock2.setOrigin(0.5);
        this.spr_lock2.setDisplaySize(200, 200);

        // Ganzúa (la herramienta que mueves con A y D)
        this.spr_pick = this.add.image(this.CENTER_X, this.CENTER_Y, 'lock_lockpick');
        this.spr_pick.setDisplaySize(200, 200);

        // Variables de juego
        this.pickAngle = 0; // Ángulo actual de la ganzúa (-90 a 90 grados)
        this.tension = 0; // Tensión acumulada (si llega a maxTension, se rompe la ganzúa)
        this.maxTension = 100; // Límite máximo de tensión antes de fallar
        this.vibrationStrength = 0; // Intensidad de la vibración visual
        this.isTransitioning = false; // Flag para bloquear inputs durante el cambio de cerradura

        // --------------------------------------------
        // MULTI-CERRADURA (2 candados)
        // --------------------------------------------
        this.currentLock = 1; // Cerradura activa (1 o 2)

        // Array con datos de cada cerradura (posición del sweetspot, rangos, etc.)
        this.locks = [
            null, // índice 0 no se usa (para que locks[1] y locks[2] sean más intuitivos)
            this.generateLockData(), // cerradura 1
            this.generateLockData()  // cerradura 2
        ];

        // Rotación actual de cada candado (0 = cerrado, 90 = abierto)
        this.lockRotation = { 1: 0, 2: 0 };

        // Graphics es un objeto de Phaser para dibujar formas (líneas, rectángulos, etc.)
        this.tensionGraphics = this.add.graphics();

        // Configuración de teclas: A (izquierda), D (derecha), ESPACIO (girar)
        this.keys = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        this.turnKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    // Genera datos aleatorios para cada cerradura (dónde está el sweetspot)
    generateLockData() {
        let sweetCenter = Phaser.Math.Between(-90, 90); // Elige un ángulo aleatorio

        return {
            sweetCenter: sweetCenter, // Centro del punto óptimo
            sweetMin: sweetCenter - this.SWEET_WIDTH, // Límite inferior del sweetspot
            sweetMax: sweetCenter + this.SWEET_WIDTH, // Límite superior del sweetspot
            rotationMin: sweetCenter - this.ROTATION_WIDTH, // Límite inferior donde puedes girar
            rotationMax: sweetCenter + this.ROTATION_WIDTH // Límite superior donde puedes girar
        };
    }

    // Método de Phaser que se ejecuta 60 veces por segundo (bucle principal del juego)
    // time = tiempo total desde que empezó el juego (en milisegundos)
    // delta = tiempo transcurrido desde el último frame (en milisegundos)
    update(time, delta) {
        this.tensionGraphics.clear(); // Limpia el dibujo anterior de la barra de tensión

        // Solo procesar inputs si NO estamos en transición entre cerraduras
        if (!this.isTransitioning) {
            this.handlePickMovement(delta); // Procesa el movimiento de la ganzúa (teclas A y D)
            this.applyTurnLogic(delta); // Procesa el giro de la cerradura (tecla ESPACIO)
        }

        // Dibuja todo en pantalla cada frame
        this.drawLock(1, time);
        this.drawLock(2, time);
        this.drawPick(time);
        this.drawTensionBar();
    }

    // -------------------------
    // MOVIMIENTO DE GANZÚA
    // -------------------------
    // Maneja el movimiento horizontal de la ganzúa con las teclas A y D
    handlePickMovement(delta) {
        // Si presionas A, mueve la ganzúa hacia la izquierda
        if (this.keys.left.isDown) {
            this.pickAngle -= this.PICK_MOVEMENT_SPEED * delta / 1000;
        }
        // Si presionas D, mueve la ganzúa hacia la derecha
        if (this.keys.right.isDown) {
            this.pickAngle += this.PICK_MOVEMENT_SPEED * delta / 1000;
        }

        // Phaser.Math.Clamp limita el valor entre un mínimo y máximo
        // Aquí evita que la ganzúa se mueva más allá de -90 o +90 grados
        this.pickAngle = Phaser.Math.Clamp(this.pickAngle, -90, 90);
    }

    // -------------------------
    // LÓGICA DE GIRO (por candado activo)
    // -------------------------
    // Esta función controla qué pasa cuando presionas ESPACIO para girar la cerradura
    applyTurnLogic(delta) {
        let lock = this.locks[this.currentLock]; // Datos de la cerradura activa
        let angle = this.pickAngle; // Ángulo actual de la ganzúa
        let currentRotation = this.lockRotation[this.currentLock]; // Cuánto ha girado la cerradura

        // Si NO estás presionando ESPACIO:
        if (!this.turnKey.isDown) {
            this.vibrationStrength = 0; // Deja de vibrar
            this.tension = Math.max(this.tension - this.TENSION_DECREASE_RATE * delta, 0); // Reduce la tensión gradualmente
            // En cuanto a math.max sirve para saber el mayor número entre (x, y, n...), pero
            // inteligentemente en este caso le estamos diciendo "resta tensión, pero NUNCA bajes de 0".

            // Si la cerradura está parcialmente girada pero no completamente abierta:
            if (currentRotation < this.MAX_LOCK_ROTATION && currentRotation > 0) {
                // La cerradura vuelve a su posición inicial (se "cierra" de nuevo)
                this.lockRotation[this.currentLock] = Math.max(
                    currentRotation - this.LOCK_ROTATION_SPEED * delta * 2, 
                    0
                );
            }
            return; // Sale de la función (no hace nada más si no presionas ESPACIO)
        }

        // 1. FUERA DEL RANGO DE ROTACIÓN (estás demasiado lejos del sweetspot)
        if (angle < lock.rotationMin || angle > lock.rotationMax) {
            this.vibrationStrength = 5; // Vibración suave
            this.tension += this.TENSION_INCREASE_RATE * delta; // Aumenta la tensión
            
            // Si la cerradura estaba girándose, vuelve a cerrarse
            if (currentRotation > 0) {
                this.lockRotation[this.currentLock] = Math.max(
                    currentRotation - this.LOCK_ROTATION_SPEED * delta * 1.5, 
                    0
                );
            }
            
            // Si la tensión llega al máximo, rompes la ganzúa
            if (this.tension >= this.maxTension) {
                this.fail();
            }
            return; // Sale de la función
        }

        // 2. EN RANGO PERO FUERA DEL SWEETSPOT (cerca, pero no en el punto perfecto)
        if (angle < lock.sweetMin || angle > lock.sweetMax) {
            this.vibrationStrength = 0; // No vibra
            this.tension = Math.max(this.tension - this.TENSION_DECREASE_RATE * delta * 0.5, 0); // Reduce tensión lentamente
            
            // Rotar lentamente la cerradura (puedes avanzar un poco)
            if (currentRotation < this.RESISTANCE_THRESHOLD) {
                this.lockRotation[this.currentLock] += this.LOCK_ROTATION_SPEED * delta;
            } else {
                // Si intentas pasar de 45 grados sin estar en el sweetspot:
                this.vibrationStrength = 10; // Vibración fuerte (indica resistencia)
                this.tension += this.TENSION_INCREASE_RATE * delta; // Aumenta tensión rápidamente
                
                if (this.tension >= this.maxTension) {
                    this.fail(); // Rompes la ganzúa
                }
            }
            return; // Sale de la función
        }

        // 3. EN EL SWEETSPOT (¡estás en el ángulo perfecto!)
        this.vibrationStrength = 0; // Sin vibración
        this.tension = Math.max(this.tension - this.TENSION_DECREASE_RATE * delta * 2, 0); // Reduce tensión rápidamente

        // Rotar la cerradura suavemente hacia la apertura
        this.lockRotation[this.currentLock] += this.LOCK_ROTATION_SPEED * delta;

        // Verificar si la cerradura se desbloqueó completamente (llegó a 90 grados)
        if (this.lockRotation[this.currentLock] >= this.MAX_LOCK_ROTATION) {
            this.lockRotation[this.currentLock] = this.MAX_LOCK_ROTATION; // Fija en 90 grados
            this.unlockCurrentLock(); // Llama a la función de desbloqueo
        }
    }

    // -------------------------
    // CUANDO SE DESBLOQUEA UNA CERRADURA
    // -------------------------
    unlockCurrentLock() {
        console.log(`Cerradura ${this.currentLock} desbloqueada!`); // Mensaje en consola

        if (this.currentLock === 1) {
            // Si es la primera cerradura, prepara la transición a la segunda
            this.isTransitioning = true; // Bloquea inputs durante la transición
            
            // Animación de transición suave: la ganzúa desaparece (alpha = opacidad)
            this.tweens.add({ // this.tweens crea animaciones interpoladas
                targets: this.spr_pick, // Objeto a animar
                alpha: 0, // Opacidad final (0 = invisible)
                duration: 500, // Duración en milisegundos
                onComplete: () => { // Función que se ejecuta cuando termina la animación
                    // Cambiar a la segunda cerradura
                    this.currentLock = 2;
                    this.tension = 0;
                    this.pickAngle = 0;
                    this.vibrationStrength = 0;
                    
                    // Reaparecer la ganzúa
                    this.tweens.add({
                        targets: this.spr_pick,
                        alpha: 1, // Opacidad final (1 = visible)
                        duration: 500,
                        onComplete: () => {
                            this.isTransitioning = false; // Desbloquea inputs
                        }
                    });
                }
            });
        } else {
            // Si es la segunda cerradura, has completado el minijuego
            console.log("¡Mini-juego completado!");
            this.scene.restart(); // Reinicia la escena (útil para testing)
        }
    }

    // -------------------------
    // DIBUJO DE CADA CERRADURA
    // -------------------------
    // Actualiza la rotación visual y el color de una cerradura
    drawLock(lockNumber, time) {
        const sprite = lockNumber === 1 ? this.spr_lock1 : this.spr_lock2; // Selecciona el sprite
        sprite.setRotation(Phaser.Math.DegToRad(this.lockRotation[lockNumber])); // Convierte grados a radianes y rota

        // Feedback visual de cuál está activa
        if (lockNumber === this.currentLock) {
            sprite.setTint(0xffffff);  // Blanco = cerradura activa
        } else if (this.lockRotation[lockNumber] >= this.MAX_LOCK_ROTATION) {
            sprite.setTint(0x00ff00);  // Verde = cerradura desbloqueada
        } else {
            sprite.setTint(0x666666);  // Gris oscuro = cerradura inactiva
        }
    }

    // -------------------------
    // DIBUJO DE GANZÚA
    // -------------------------
    // Actualiza la posición, rotación y vibración de la ganzúa
    drawPick(time) {
        // Solo vibrar cuando hay tensión
        const vibration = this.vibrationStrength > 0 
            ? Math.sin(time * 0.02) * this.vibrationStrength * 0.4  // Math.sin crea oscilación
            : 0;
        const angle = this.pickAngle + vibration; // Ángulo base + vibración

        // Mueve la ganzúa a la cerradura activa
        const targetY = this.currentLock === 1
            ? this.CENTER_Y - 150  // Posición de lock 1 (arriba)
            : this.CENTER_Y + 150; // Posición de lock 2 (abajo)

        this.spr_pick.setPosition(this.CENTER_X, targetY); // Posiciona la ganzúa
        this.spr_pick.setOrigin(0.32, 0.06); // Ajusta el origen para que gire desde la base
        this.spr_pick.setRotation(Phaser.Math.DegToRad(angle - 135)); // Rota la ganzúa (ajustado para que apunte bien)
    }

    // Dibuja la barra de tensión en pantalla
    drawTensionBar() {
        let barWidth = Phaser.Math.Clamp((this.tension / this.maxTension) * 200, 0, 200); // Calcula el ancho según tensión

        // Color que cambia según tensión (feedback visual)
        let color = 0x00ff00; // Verde por defecto
        if (this.tension > 60) {
            color = 0xff0000; // Rojo = peligro
        } else if (this.tension > 30) {
            color = 0xffff00; // Amarillo = precaución
        }

        this.tensionGraphics.fillStyle(color); // Establece el color de relleno
        this.tensionGraphics.fillRect(this.CENTER_X - 100, this.CENTER_Y - 10, barWidth, 20); // Dibuja rectángulo relleno

        this.tensionGraphics.lineStyle(2, 0xffffff); // Establece estilo de línea (grosor, color)
        this.tensionGraphics.strokeRect(this.CENTER_X - 100, this.CENTER_Y - 10, 200, 20); // Dibuja borde de la barra
    }

    // Se llama cuando rompes la ganzúa (tensión al máximo)
    fail() {
        console.log("Ganzúa rota");
        this.scene.restart(); // Reinicia la escena
    }
}