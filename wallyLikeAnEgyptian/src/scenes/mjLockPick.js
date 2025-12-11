/**
 * Search "Skyrim Lockpick" for reference.
 * 
 * init: condicional minijuego, dificultad init
 * create: sprites, variables, generar cerraduras, teclas, dificultades
 * 
 * generateLockData(): crea las características de la cerradura
 * update: actualizar gráficos, gestiona el flag de transición entre cerraduras
 * 
 * handlePickMovement(delta): movimiento ganzúa
 * applyTurnLogic(delta): lo que ocurre al intentar desbloquear la cerradura
 * unlockCurrentLock(): lógica de desbloqueo
 * drawLock(lockNumber): dibujar la cerradura, para el update
 * drawPick(time): dibujar ganzúa, tiene en cuenta rotación del jugador y cerradura activa
 * drawTensionBar(): gestión visual de la tensión para el update
 * fail(): método que se ejecuta al llenar la barra de tensión, perder
 */
import { DIFICULTADES } from '../config/MinigameData.js';

export default class LockPick extends Phaser.Scene {
    constructor() {
        super('LockPick');

        // Constantes de configuración
        this.LOCK_ROTATION_SPEED = 0.1; // Velocidad a la cual se rota la cerradura
        this.PICK_MOVEMENT_SPEED = 120; // Velocidad de rotación de la ganzúa
        this.MAX_LOCK_ROTATION = 90; // Límite de rotación de la cerradura cuando el jugador se encuentra en el sweetspot(cuando llega aquí se desbloquea)
        this.RESISTANCE_THRESHOLD = 45; // Límite de rotación de la cerradura cuando el jugador está en el "ángulo de rotación"
    }

    init(data) {
        this.isMinigame = true;

        this.difficulty = data.dificultad;
    }

    create() {
        this.CENTER_X = this.cameras.main.centerX;
        this.CENTER_Y = this.cameras.main.centerY;
        const config = DIFICULTADES[this.difficulty].minijuegos.LockPick;

        // SPRITES (son 2 cerraduras, por eso hay "duplicados")

        // FondoGeneral
        this.fondo = this.add.image(this.CENTER_X, this.CENTER_Y, 'paredBG');
        // FondoCerradura
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

        // Cerradura
        this.spr_lock1 = this.add.image(this.CENTER_X, this.CENTER_Y - 150, 'lock_lock');
        this.spr_lock1.setOrigin(0.5);
        this.spr_lock1.setDisplaySize(200, 200);
        this.spr_lock2 = this.add.image(this.CENTER_X, this.CENTER_Y + 150, 'lock_lock');
        this.spr_lock2.setOrigin(0.5);
        this.spr_lock2.setDisplaySize(200, 200);

        // Ganzúa (solo 1)
        this.spr_pick = this.add.image(this.CENTER_X, this.CENTER_Y, 'lock_lockpick');
        this.spr_pick.setDisplaySize(200, 200);

        // Variables de juego
        this.pickAngle = 0; // Ángulo actual de la ganzúa (-90 a 90 grados)
        this.tension = 0; // Tensión acumulada (si llega a maxTension, se rompe la ganzúa)
        this.maxTension = 100; // Límite máximo de tensión
        this.vibrationStrength = 0; // Intensidad de la vibración visual
        this.isTransitioning = false; // Flag para bloquear inputs durante el cambio de cerradura

        // Constantes que se definen por la dificultad (MinigameData)
        this.SWEET_WIDTH = config.limiteSweet; // Límite del sweetspot en grados (x2)
        this.ROTATION_WIDTH = config.limiteRotacion; // Lo mismo pero el otro límite (rotación)
        this.TENSION_INCREASE_RATE = config.tensionSube; // Vel. a la que se acumula tensión
        this.TENSION_DECREASE_RATE = config.tensionBaja; // Vel. con la que baja la tensión acumulada

        this.currentLock = 1; // Cerradura activa (1 o 2)

        // Array con datos de cada cerradura
        this.locks = [
            null, // dummyyyy
            this.generateLockData(), // cerradura 1
            this.generateLockData()  // cerradura 2
        ];

        this.lockRotation = { 1: 0, 2: 0 }; // Rotación actual de cada candado (0 = cerrado, 90 = abierto)

        this.tensionGraphics = this.add.graphics(); // Para dibujar la barra de tensión

        // Configuración de teclas (no usamos el inputManager)
        this.keys = this.input.keyboard.createCursorKeys();
        this.turnKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    generateLockData() { // Genera los datos de la cerradura
        let sweetCenter = Phaser.Math.Between(-90, 90); // Elige un ángulo aleatorio

        return {
            sweetCenter: sweetCenter, // Centro del punto óptimo
            sweetMin: sweetCenter - this.SWEET_WIDTH, // Límite inferior del sweetspot
            sweetMax: sweetCenter + this.SWEET_WIDTH, // Límite superior del sweetspot
            rotationMin: sweetCenter - this.ROTATION_WIDTH, // Límite inferior donde puedes girar
            rotationMax: sweetCenter + this.ROTATION_WIDTH // Límite superior donde puedes girar
        };
    }

    update(time, delta) {
        this.tensionGraphics.clear(); // Limpia el dibujo anterior de la barra de tensión

        // Solo procesar inputs si NO estamos en transición entre cerraduras
        if (!this.isTransitioning) {
            this.handlePickMovement(delta); // Mov. de ganzúa
            this.applyTurnLogic(delta); // Mov. de cerradura
        }

        // Dibuja todo en pantalla cada frame
        this.drawLock(1); // NO uso time xq el método drawLock contiene una sola multiplicación
        this.drawLock(2);
        this.drawPick(time);
        this.drawTensionBar();
    }

    handlePickMovement(delta) { // Movimiento de la ganzúa
        if (this.keys.left.isDown) { // Izquierda
            this.pickAngle -= this.PICK_MOVEMENT_SPEED * delta / 1000;
        }
        if (this.keys.right.isDown) { // Derecha
            this.pickAngle += this.PICK_MOVEMENT_SPEED * delta / 1000;
        }
        // Evitamos que la ganzúa se mueva más allá de -90 o +90 grados
        this.pickAngle = Phaser.Math.Clamp(this.pickAngle, -90, 90);
        // Como se puede obervar
    }

    applyTurnLogic(delta) { // LÓGICA DE GIRO (cuando pulsas SPACE)
        let lock = this.locks[this.currentLock]; // Datos de la cerradura activa
        let angle = this.pickAngle; // Ángulo actual de la ganzúa
        let currentRotation = this.lockRotation[this.currentLock]; // Cuánto ha girado la cerradura

        // Si NO estás presionando ESPACIO:
        if (!this.turnKey.isDown) {
            this.vibrationStrength = 0; // Deja de vibrar
            this.tension = Math.max(this.tension - this.TENSION_DECREASE_RATE * delta, 0);
            // Reduce la tensión gradualmente sin bajar de 0

            // Si la cerradura está parcialmente girada pero no completamente abierta:
            if (currentRotation < this.MAX_LOCK_ROTATION && currentRotation > 0) {
                // La cerradura vuelve a su posición inicial (se "cierra" de nuevo)
                this.lockRotation[this.currentLock] =
                    Math.max(currentRotation - this.LOCK_ROTATION_SPEED * delta * 2, 0);
            }
            return; // Sale de la función (no hace nada más si no presionas ESPACIO)
        }

        // 1. FUERA DEL RANGO DE ROTACIÓN
        if (angle < lock.rotationMin || angle > lock.rotationMax) {
            this.vibrationStrength = 5; // Vibración suave
            this.tension += this.TENSION_INCREASE_RATE * delta; // Tensión

            // Si la cerradura estaba girándose, vuelve a cerrarse
            if (currentRotation > 0) {
                this.lockRotation[this.currentLock] =
                    Math.max(currentRotation - this.LOCK_ROTATION_SPEED * delta * 1.5, 0);
            }

            // Si la tensión llega al máximo,
            if (this.tension >= this.maxTension) {
                this.fail();
            }
            return; // Sale de la función
        }

        // 2. EN RANGO PERO FUERA DEL SWEETSPOT (caliente caliente)
        if (angle < lock.sweetMin || angle > lock.sweetMax) {
            this.vibrationStrength = 0; // No vibra
            this.tension = Math.max(this.tension - this.TENSION_DECREASE_RATE * delta * 0.5, 0); // Reduce tensión lentamente

            // Rotar lentamente la cerradura hasta punto medio
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

        // 3. EN EL SWEETSPOT (¡ahí es!)
        this.vibrationStrength = 0; // Sin vibración
        this.tension = Math.max(this.tension - this.TENSION_DECREASE_RATE * delta * 2, 0); // Reduce tensión rápidamente

        // Rotar la cerradura suavemente hacia la apertura
        this.lockRotation[this.currentLock] += this.LOCK_ROTATION_SPEED * delta;

        // Verificar desbloqueo cerradura
        if (this.lockRotation[this.currentLock] >= this.MAX_LOCK_ROTATION) {
            this.lockRotation[this.currentLock] = this.MAX_LOCK_ROTATION; // Fija en 90 grados
            this.unlockCurrentLock(); // Llama a la función de desbloqueo
        }
    }
    // NOTA: sé que he repetido mucho las acciones en cuanto a tensión y disminuir giro
    // de cerradura, la estructura quedaría mucho más compacta si crease algunas funciones como
    // por ejemplo increaseTension, reduceRotation a parte, pero he optado por dejarlo así.

    unlockCurrentLock() { // Lógica de desbloqueo de cerradura
        if (this.currentLock === 1) { // Si es la primera cerradura, prepara la transición a la segunda
            this.isTransitioning = true; // Bloquea inputs durante la transición

            // Animación de transición
            this.tweens.add({
                targets: this.spr_pick,
                alpha: 0, // Opacidad (no se ve)
                duration: 500, // ms
                onComplete: () => {
                    // 1. Cambiar a la segunda cerradura
                    this.currentLock = 2;
                    this.tension = 0;
                    this.pickAngle = 0;
                    this.vibrationStrength = 0;

                    // 2. Reaparecer la ganzúa
                    this.tweens.add({
                        targets: this.spr_pick,
                        alpha: 1, // Opacidad final (ahora si se ve)
                        duration: 500,
                        onComplete: () => {
                            this.isTransitioning = false; // Desbloquea inputs
                        }
                    });
                }
            });
        } else { // Si no es la primera entonces, es la segunda, -> acabas minijuego
            console.log("¡Mini-juego completado!");
            this.scene.restart(); // beta
        }
    }

    drawLock(lockNumber) { // Dibujar cerradura
        const sprite = lockNumber === 1 ? this.spr_lock1 : this.spr_lock2; // Selecciona el sprite
        sprite.setRotation(Phaser.Math.DegToRad(this.lockRotation[lockNumber]));
        // Cuando Phaser calcula rotaciones de sprites, lo hace en radianes
    }

    drawPick(time) { // Dibujar ganzúa
        // Solo vibrar cuando hay tensión
        const vibration = this.vibrationStrength > 0
            ? Math.sin(time * 0.02) * this.vibrationStrength * 0.4  // Math.sin crea oscilación
            : 0;
        const angle = this.pickAngle + vibration; // Ángulo base + vibración

        // Mueve la ganzúa a la cerradura activa
        const targetY = this.currentLock === 1
            ? this.CENTER_Y - 150  // Lock 1
            : this.CENTER_Y + 150; // Lock 2 

        this.spr_pick.setPosition(this.CENTER_X, targetY); // Posiciona la ganzúa
        // WARNING con esto (dependemos de dnd esté la punta en el propio sprite):
        this.spr_pick.setOrigin(0.32, 0.06); // Ajusta el origen para que gire desde la punta
        this.spr_pick.setRotation(Phaser.Math.DegToRad(angle - 135)); // Rota la ganzúa dsde ese origen
    }

    drawTensionBar() { // Dibuja la barra de tensión en pantalla
        // No uso time porque lo recalculo desde 0 al empezar cada frame (ver clear() del update)
        // Calcula el ancho según tensión acumulada, si la tensión acumulada llega a 100, = maxTension, barra llena
        let barWidth = Phaser.Math.Clamp((this.tension / this.maxTension) * 200, 0, 200);

        // Color que cambia según tensión
        let color = 0x00ff00; // Verde por defecto
        if (this.tension > 60) {
            color = 0xff0000; // Rojo = peligro
        } else if (this.tension > 30) {
            color = 0xffff00; // Amarillo = precaución
        }

        this.tensionGraphics.fillStyle(color); // Color que viene dado por lo de arriba
        this.tensionGraphics.fillRect(this.CENTER_X - 100, this.CENTER_Y - 10, barWidth, 20);

        this.tensionGraphics.lineStyle(2, 0xffffff); // (grosor, color)
        this.tensionGraphics.strokeRect(this.CENTER_X - 100, this.CENTER_Y - 10, 200, 20); // Borde de la barra
    }

    // Se llama cuando rompes la ganzúa (tension >= maxTension)
    fail() {
        console.log("Ganzúa rota");
        this.scene.restart(); // beta
    }
}