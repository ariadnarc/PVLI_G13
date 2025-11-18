export default class minijuegoLock extends Phaser.Scene {
    constructor() {
        super('minijuegoLock');
    }

    preload() { }

    create() {

        // Centro
        this.CENTER_X = this.cameras.main.centerX;
        this.CENTER_Y = this.cameras.main.centerY;

        // Variables base
        this.pickAngle = 0;
        this.lockRotation = 0;
        this.maxLockTurn = 90;

        this.tension = 0;
        this.maxTension = 100;

        this.vibrationStrength = 0;

        // ----------------------------
        // RANDOMIZACIÓN SKYRIM
        // ----------------------------

        // 1. Sweet spot central aleatorio
        this.sweetCenter = Phaser.Math.Between(-90, 0);

        // 2. Tamaño del sweet spot
        const SWEET_WIDTH = 10;  // ±10°

        // 3. Tamaño del rango donde el candado puede empezar a girar
        const ROTATION_WIDTH = 20; // ±20°

        // Sweet spot perfecto
        this.sweetMin = this.sweetCenter - SWEET_WIDTH;
        this.sweetMax = this.sweetCenter + SWEET_WIDTH;

        // Rango más grande donde puede girar parcialmente
        this.rotationMin = this.sweetCenter - ROTATION_WIDTH;
        this.rotationMax = this.sweetCenter + ROTATION_WIDTH;

        // Dibujos
        this.lockGraphics = this.add.graphics();
        this.pickGraphics = this.add.graphics();
        this.tensionGraphics = this.add.graphics();

        // Inputs
        this.cursors = this.input.keyboard.createCursorKeys();
        this.turnKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update(time, delta) {
        this.lockGraphics.clear();
        this.pickGraphics.clear();
        this.tensionGraphics.clear();

        this.handlePickMovement(delta);
        this.applyTurnLogic(delta, time);
        this.drawLock();
        this.drawPick(time);
        this.drawTensionBar();

        console.log(this.sweetMax);
    }

    // -------------------------
    // MOVIMIENTO DE LA GANZÚA
    // -------------------------
    handlePickMovement(delta) {
        const speed = 120; // grados por segundo

        if (this.cursors.left.isDown) {
            this.pickAngle -= speed * delta / 1000;
        }
        if (this.cursors.right.isDown) {
            this.pickAngle += speed * delta / 1000;
        }

        this.pickAngle = Phaser.Math.Clamp(this.pickAngle, -90, 90);
    }

    // -------------------------
    // LÓGICA DE GIRO Y VIBRACIÓN
    // -------------------------
    applyTurnLogic(delta) {
        if (!this.turnKey.isDown) {
            this.vibrationStrength = 0;
            this.tension = Math.max(this.tension - delta * 0.1, 0);
            return;
        }

        const angle = this.pickAngle;

        // FUERA COMPLETAMENTE DEL RANGO DE GIRO
        if (angle < this.rotationMin || angle > this.rotationMax) {
            this.lockRotation = 0;

            // 🔥 VIBRACIÓN FUERTE (no se puede girar)
            this.vibrationStrength = 5;

            this.tension += delta * 0.6;
            if (this.tension >= this.maxTension) this.fail();
            return;
        }

        // DENTRO DEL RANGO PERO FUERA DEL SWEET SPOT
        if (angle < this.sweetMin || angle > this.sweetMax) {
            const dist = Math.min(
                Math.abs(angle - this.sweetMin),
                Math.abs(angle - this.sweetMax)
            );

            // Vibración creciente
            this.vibrationStrength = 1 + dist * 0.1;

            this.lockRotation = Phaser.Math.Clamp(
                this.lockRotation + delta * 0.05,
                0,
                50 // se para antes de desbloquear
            );

            this.tension += delta * 0.3;
            if (this.tension >= this.maxTension) this.fail();
            return;
        }
    }

    // -------------------------
    // DIBUJAR GANZÚA (línea amarilla)
    // -------------------------
    drawPick(time) {

        const angleRad =
            Phaser.Math.DegToRad(this.pickAngle - 90) +
            Math.sin(time * 0.02) * this.vibrationStrength * 0.01;

        let x = this.CENTER_X + Math.cos(angleRad) * 90;
        let y = this.CENTER_Y + Math.sin(angleRad) * 90;

        this.pickGraphics.lineStyle(4, 0xffff00);
        this.pickGraphics.strokeLineShape(
            new Phaser.Geom.Line(this.CENTER_X, this.CENTER_Y, x, y)
        );
    }

    // -------------------------
    // DIBUJAR CERRADURA (círculo + aguja)
    // -------------------------
    drawLock() {

        // círculo
        this.lockGraphics.lineStyle(4, 0xffffff);
        this.lockGraphics.strokeCircle(this.CENTER_X, this.CENTER_Y, 100);

        // aguja
        this.lockGraphics.lineStyle(6, 0x00ffff);

        let rad = Phaser.Math.DegToRad(this.lockRotation - 90);
        let lx = this.CENTER_X + Math.cos(rad) * 80;
        let ly = this.CENTER_Y + Math.sin(rad) * 80;

        this.lockGraphics.strokeLineShape(
            new Phaser.Geom.Line(this.CENTER_X, this.CENTER_Y, lx, ly)
        );
    }

    // -------------------------
    // BARRA DE TENSIÓN
    // -------------------------
    drawTensionBar() {

        let barWidth = Phaser.Math.Clamp((this.tension / this.maxTension) * 200, 0, 200);

        this.tensionGraphics.fillStyle(0xff0000);
        this.tensionGraphics.fillRect(this.CENTER_X - 100, this.CENTER_Y + 120, barWidth, 20);

        this.tensionGraphics.lineStyle(2, 0xffffff);
        this.tensionGraphics.strokeRect(this.CENTER_X - 100, this.CENTER_Y + 120, 200, 20);
    }

    // -------------------------
    // RESULTADOS
    // -------------------------
    success() {
        console.log("Cerradura abierta");
        this.scene.restart();
    }

    fail() {
        console.log("Ganzúa rota");
        this.scene.restart();
    }
}