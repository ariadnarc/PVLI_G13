export default class minijuegoLock extends Phaser.Scene {
    constructor() {
        super('minijuegoLock');
    }

    preload() {
        this.load.image('lock_fondo', 'Wally Like an Egyptian/assets/minijuegos/minijuegoLock/lock_fondo.png');
        this.load.image('lock_ring', 'Wally Like an Egyptian/assets/minijuegos/minijuegoLock/lock_ring.png');
        this.load.image('lock_lock', 'Wally Like an Egyptian/assets/minijuegos/minijuegoLock/lock_lock.png');
        this.load.image('lock_lockpick', 'Wally Like an Egyptian/assets/minijuegos/minijuegoLock/lock_lockpick.png');
    }

    create() {
        this.CENTER_X = this.cameras.main.centerX;
        this.CENTER_Y = this.cameras.main.centerY;

        // ------------- SPRITES DE LA CERRADURA ----------------

        // Fondos
        this.spr_fondo = this.add.image(this.CENTER_X, this.CENTER_Y + 150, 'lock_fondo')
        this.spr_fondo.setOrigin(0.5);
        this.spr_fondo.setDisplaySize(260,260);

        this.spr_fondo2 = this.add.image(this.CENTER_X, this.CENTER_Y - 150, 'lock_fondo')
        this.spr_fondo2.setOrigin(0.5);
        this.spr_fondo2.setDisplaySize(260,260);

        // Aros exteriores
        this.spr_ring1 = this.add.image(this.CENTER_X, this.CENTER_Y - 150, 'lock_ring')
        this.spr_ring1.setOrigin(0.5);
        this.spr_ring1.setDisplaySize(250, 250);

        this.spr_ring2 = this.add.image(this.CENTER_X, this.CENTER_Y + 150, 'lock_ring')
        this.spr_ring2.setOrigin(0.5);
        this.spr_ring2.setDisplaySize(250, 250);

        // Cerradura (parte que girará según lockRotation)
        this.spr_lock1 = this.add.image(this.CENTER_X, this.CENTER_Y - 150, 'lock_lock')
        this.spr_lock1.setOrigin(0.5);
        this.spr_lock1.setDisplaySize(200, 200);

        this.spr_lock2 = this.add.image(this.CENTER_X, this.CENTER_Y + 150, 'lock_lock')
        this.spr_lock2.setOrigin(0.5);
        this.spr_lock2.setDisplaySize(200, 200);

        // Ganzúa
        this.spr_pick = this.add.image(this.CENTER_X, this.CENTER_Y, 'lock_lockpick')
        this.spr_pick.setDisplaySize(200,200);

        this.pickAngle = 0;
        this.tension = 0;
        this.maxTension = 100;
        this.vibrationStrength = 0;

        // --------------------------------------------
        // MULTI-CERRADURA (2 candados)
        // --------------------------------------------
        this.currentLock = 1;

        this.locks = [
            null, // dummy para usar índices 1 y 2 (más cómodo)
            this.generateLockData(), // cerradura 1
            this.generateLockData()  // cerradura 2
        ];

        // Rotación actual de cada candado
        this.lockRotation = { 1: 0, 2: 0 };

        // Dibujos
        this.tensionGraphics = this.add.graphics();

        // Inputs
        this.keys = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        this.turnKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    // Genera sweetspot + rangos para cada candado
    generateLockData() {
        const SWEET_WIDTH = 10;
        const ROTATION_WIDTH = 20;

        let sweetCenter = Phaser.Math.Between(-90, 90);

        return {
            sweetCenter: sweetCenter,
            sweetMin: sweetCenter - SWEET_WIDTH,
            sweetMax: sweetCenter + SWEET_WIDTH,
            rotationMin: sweetCenter - ROTATION_WIDTH,
            rotationMax: sweetCenter + ROTATION_WIDTH
        };
    }

    update(time, delta) {
        this.tensionGraphics.clear();

        this.handlePickMovement(delta);
        this.applyTurnLogic(delta);

        this.drawLock(1, time);
        this.drawLock(2, time);
        this.drawPick(time);
        this.drawTensionBar();
    }

    // -------------------------
    // MOVIMIENTO DE GANZÚA
    // -------------------------
    handlePickMovement(delta) {
        const speed = 120;

        if (this.keys.left.isDown) this.pickAngle -= speed * delta / 1000;
        if (this.keys.right.isDown) this.pickAngle += speed * delta / 1000;

        this.pickAngle = Phaser.Math.Clamp(this.pickAngle, -90, 90);
    }

    // -------------------------
    // LÓGICA DE GIRO (por candado activo)
    // -------------------------
    applyTurnLogic(delta) {
        let lock = this.locks[this.currentLock];
        let angle = this.pickAngle;

        if (!this.turnKey.isDown) {
            this.vibrationStrength = 0;
            this.tension = Math.max(this.tension - delta * 0.1, 0);
            return;
        }

        // 1. FUERA DEL RANGO
        if (angle < lock.rotationMin || angle > lock.rotationMax) {
            this.vibrationStrength = 5;

            this.tension += delta * 0.45;
            if (this.tension >= this.maxTension) this.fail();
            return;
        }

        // 2. RANGO PERO FUERA DEL SWEETSPOT
        if (angle < lock.sweetMin || angle > lock.sweetMax) {
            this.tension = Math.max(this.tension - delta * 0.1, 0);
            this.lockRotation[this.currentLock] += delta * 0.2;

            if (this.lockRotation[this.currentLock] >= 45) {
                this.lockRotation[this.currentLock] = 45;
                this.vibrationStrength = 10;

                this.tension += delta * 0.45;
                if (this.tension >= this.maxTension) this.fail();
            }
            return;
        }

        // 3. SWEETSPOT
        this.vibrationStrength = 0;
        this.tension = Math.max(this.tension - delta * 0.2, 0);

        this.lockRotation[this.currentLock] += delta * 0.2;

        if (this.lockRotation[this.currentLock] >= 90) {
            this.unlockCurrentLock();
            this.lockRotation[this.currentLock] = 90;
        }
    }

    // -------------------------
    // CUANDO SE DESBLOQUEA UNA CERRADURA
    // -------------------------
    unlockCurrentLock() {

        console.log(`Cerradura ${this.currentLock} desbloqueada!`);

        if (this.currentLock === 1) {

            this.timerEvent = this.time.addEvent({
                delay: 500, // Ejecuta cada 1000ms (1 segundo)
                callback: () => {
                    this.input.keyboard.resetKeys();
                    this.currentLock = 2; // pasamos al segundo candado
                    this.tension = 0;
                    this.pickAngle = 0;
                    this.vibrationStrength = 0;
                }, // Función a ejecutar
                callbackScope: this
            });

        } else {
            console.log("¡Mini-juego completado!");
            this.scene.restart(); // reinicia las 2 cerraduras
        }
    }

    // -------------------------
    // DIBUJO DE CADA CERRADURA
    // -------------------------
    drawLock(lockNumber, time) {
        const sprite = lockNumber === 1 ? this.spr_lock1 : this.spr_lock2;
        sprite.setRotation(Phaser.Math.DegToRad(this.lockRotation[lockNumber]));

        // Opcional: agregar feedback visual de cuál está activa
        if (lockNumber === this.currentLock) {
            sprite.setTint(0xffffff);  // Normal (blanco)
        } else {
            sprite.setTint(0x888888);  // Gris (inactiva)
        }
    }


    // -------------------------
    // DIBUJO DE GANZÚA
    // -------------------------
    drawPick(time) {
        const angle = this.pickAngle + Math.sin(time * 0.02) * this.vibrationStrength * 0.4;

        // Mueve la ganzúa a la cerradura activa
        const targetY = this.currentLock === 1
            ? this.CENTER_Y - 150  // Posición de lock 1
            : this.CENTER_Y + 150; // Posición de lock 2

        this.spr_pick.setPosition(this.CENTER_X, targetY);
        this.spr_pick.setOrigin(0.32, 0.06);
        this.spr_pick.setRotation(Phaser.Math.DegToRad(angle - 135));
    }


    drawTensionBar() {
        let barWidth = Phaser.Math.Clamp((this.tension / this.maxTension) * 200, 0, 200);

        this.tensionGraphics.fillStyle(0xff0000);
        this.tensionGraphics.fillRect(this.CENTER_X - 100, this.CENTER_Y - 10, barWidth, 20);

        this.tensionGraphics.lineStyle(2, 0xffffff);
        this.tensionGraphics.strokeRect(this.CENTER_X - 100, this.CENTER_Y - 10, 200, 20);
    }

    fail() {
        console.log("Ganzúa rota");
        this.scene.restart();
    }
}