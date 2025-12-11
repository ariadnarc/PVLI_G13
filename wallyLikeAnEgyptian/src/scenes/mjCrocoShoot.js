/**
 * JSdoc por aquí cuando
 * 
 * 
 * acabe
 */
import { DIFICULTADES } from '../config/MinigameData.js';

export default class CrocoShoot extends Phaser.Scene {
    constructor() {
        super('CrocoShoot');
    }
    init(){
        // lo de las dificultades pa luego
    }
    preload() {
        // this.load.spritesheet BALISTA
        // this.load.spritesheet COCODRILO
        // 1 FRAME DEL PLAYER EN IDLE
        // this.load.image FLECHA
        // FONDO
    }

    create() {
        // --- CONTROLES ---
        this.keys = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE
        }); //

        // --- CONSTANTES ---
        this.GRAVITY = 600;
        this.SHOOT_SPEED = 400;
        this.MIN_ANGLE = -10;   // cono de 90 grados (ejemplo)
        this.MAX_ANGLE = 80;
        this.shootCooldown = 450; // ms
        this.canShoot = true;

        // --- JUGADOR ---
        this.player = this.add.rectangle(80, 300, 30, 60, 0x0088ff); // marcador
        this.player.angle = 20; // Apunta un poco hacia arriba

        // --- GRÁFICOS ---
        this.trajectory = this.add.graphics();

        // --- GRUPO DE FLECHAS ---
        this.arrows = this.physics.add.group();

        // Física general
        this.physics.world.gravity.y = this.GRAVITY;
    }

    update(time, delta) {

        // ----- ROTACIÓN DEL JUGADOR -----
        if (this.keys.left.isDown) {
            this.player.angle -= 1.5;
        }
        if (this.keys.right.isDown) {
            this.player.angle += 1.5;
        }

        // Limitar ángulo al cono permitido
        this.player.angle = Phaser.Math.Clamp(this.player.angle, this.MIN_ANGLE, this.MAX_ANGLE);

        // ----- TRAJECTORIA -----
        if (this.canShoot) {
            this.drawTrajectory();
        } else {
            this.trajectory.clear();
        }

        // ----- DISPARO -----
        if (Phaser.Input.Keyboard.JustDown(this.keys.space) && this.canShoot) {
            this.shootArrow();
        }
    }

    // ---------------------------------------------------------
    //     DISPARAR FLECHAS (con cooldown)
    // ---------------------------------------------------------
    shootArrow() {
        this.canShoot = false;
        this.trajectory.clear();

        const angleRad = Phaser.Math.DegToRad(this.player.angle);

        let arrow = this.physics.add.image(this.player.x + 25, this.player.y, null);
        arrow.setDisplaySize(20, 6);
        arrow.setTint(0xffffff);

        arrow.setVelocity(
            Math.cos(angleRad) * this.SHOOT_SPEED,
            Math.sin(angleRad) * this.SHOOT_SPEED
        );

        arrow.rotation = angleRad;

        this.arrows.add(arrow);

        // Reactivar disparo
        this.time.delayedCall(this.shootCooldown, () => {
            this.canShoot = true;
        });
    }

    // ---------------------------------------------------------
    //     TRAJECTORIA PREDICTIVA (preview parabólico)
    // ---------------------------------------------------------
    drawTrajectory() {
        this.trajectory.clear();
        this.trajectory.lineStyle(2, 0xffffff, 0.8);

        const angleRad = Phaser.Math.DegToRad(this.player.angle);
        const speed = this.SHOOT_SPEED;
        const gravity = this.GRAVITY;

        const startX = this.player.x + 25;
        const startY = this.player.y;

        let prevX = startX;
        let prevY = startY;

        const STEPS = 40;
        const TIME_STEP = 0.05;

        for (let t = 0; t < STEPS; t++) {
            const time = t * TIME_STEP;

            const x = startX + Math.cos(angleRad) * speed * time;
            const y = startY + Math.sin(angleRad) * speed * time + 0.5 * gravity * time * time;

            // si se sale de pantalla, paramos
            if (x < 0 || x > this.game.config.width || y > this.game.config.height) break;

            this.trajectory.strokeLineShape(new Phaser.Geom.Line(prevX, prevY, x, y));

            prevX = x;
            prevY = y;
        }
    }
}
