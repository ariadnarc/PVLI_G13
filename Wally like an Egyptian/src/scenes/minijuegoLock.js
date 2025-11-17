export default class minijuegoLock extends Phaser.Scene {
    constructor() {
        super('minijuegoLock');
    }

    preload() { }

    create() {
        // Centro dinámico de la pantalla
        this.CENTER_X = this.cameras.main.centerX;
        this.CENTER_Y = this.cameras.main.centerY;

        // Variables de la escena
        this.pickAngle = 0;        // ángulo actual de la pica
        this.sweetMin = -30;       // ángulo mínimo del sweet spot
        this.sweetMax = 30;        // ángulo máximo del sweet spot
        this.maxTension = 100;     // tensión máxima antes de romper
        this.tension = 0;

        this.lockRotation = 0;     // ángulo de la cerradura
        this.rotationSpeed = 0;    // velocidad de rotación según éxito

        // Gráficos
        this.lockGraphics = this.add.graphics();
        this.pickGraphics = this.add.graphics();
        this.tensionGraphics = this.add.graphics();

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.turnKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update(time, delta) {
        const { pickGraphics, tensionGraphics, lockGraphics, cursors, turnKey, CENTER_X, CENTER_Y } = this;

        pickGraphics.clear();
        tensionGraphics.clear();
        lockGraphics.clear();

        // mover pica
        if (cursors.left.isDown) {
            this.pickAngle -= 0.1 * delta;
        } else if (cursors.right.isDown) {
            this.pickAngle += 0.1 * delta;
        }
        this.pickAngle = Phaser.Math.Clamp(this.pickAngle, -90, 90);

        // dibujar cerradura (círculo)
        lockGraphics.lineStyle(4, 0xffffff);
        lockGraphics.strokeCircle(CENTER_X, CENTER_Y, 100);

        // dibujar indicador de cerradura girando
        lockGraphics.lineStyle(6, 0x00ffff);
        let lockRad = Phaser.Math.DegToRad(this.lockRotation - 90);
        let lx = CENTER_X + Math.cos(lockRad) * 80;
        let ly = CENTER_Y + Math.sin(lockRad) * 80;
        lockGraphics.strokeLineShape(new Phaser.Geom.Line(CENTER_X, CENTER_Y, lx, ly));

        // dibujar pica (línea desde el centro)
        pickGraphics.lineStyle(4, 0xffff00);
        let rad = Phaser.Math.DegToRad(this.pickAngle - 90);
        let x = CENTER_X + Math.cos(rad) * 90;
        let y = CENTER_Y + Math.sin(rad) * 90;
        pickGraphics.strokeLineShape(new Phaser.Geom.Line(CENTER_X, CENTER_Y, x, y));

        // girar la cerradura (simulación)
        if (turnKey.isDown) {
            let center = (this.sweetMin + this.sweetMax) / 2;
            let dist = Math.abs(this.pickAngle - center);
            let tolerance = (this.sweetMax - this.sweetMin) / 2;

            if (dist <= tolerance) {
                this.tension = Math.max(this.tension - delta * 0.5, 0);
                let factor = 1 - dist / tolerance;
                this.rotationSpeed = factor * 0.1 * delta;
                this.lockRotation += this.rotationSpeed;

                if (this.lockRotation >= 90) {
                    console.log('¡Éxito! Cerradura abierta');
                    this.testingGame();
                }
            } else {
                this.tension += delta * 0.5;
                this.rotationSpeed = 0;
                if (this.tension > this.maxTension) {
                    console.log('¡Pica rota!');
                    this.testingGame();
                }
            }
        } else {
            this.tension = Math.max(this.tension - delta * 0.2, 0);
            this.rotationSpeed = 0;
        }

        // dibujar barra de tensión
        let barWidth = Phaser.Math.Clamp((this.tension / this.maxTension) * 200, 0, 200);
        // barra roja rellena
        tensionGraphics.fillStyle(0xff0000);
        tensionGraphics.fillRect(this.CENTER_X - 100, this.CENTER_Y + 120, barWidth, 20);
        // borde de la barra
        tensionGraphics.lineStyle(2, 0xffffff);
        tensionGraphics.strokeRect(this.CENTER_X - 100, this.CENTER_Y + 120, 200, 20);
    }

    testingGame() {
        this.scene.restart();
    }
}
