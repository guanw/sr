import * as PIXI from 'pixi.js';
import { Enemy } from './Enemy';
import { Helper } from '../utils/Helper';

export class AttackPower {
    circle: PIXI.Graphics;
    speed: number;
    direction: { x: number; y: number; };
    isExploded: boolean;
    constructor(x: number, y: number, targetX: number, targetY: number) {
        this.circle = new PIXI.Graphics();
        this.circle.beginFill(0xFF0000); // Red color for the attack circle
        this.circle.drawCircle(0, 0, 10); // Radius of 10
        this.circle.endFill();
        this.circle.x = x;
        this.circle.y = y;
        this.speed = 5;

        // Calculate the direction vector
        const dx = targetX - x;
        const dy = targetY - y;
        const length = Math.sqrt(dx * dx + dy * dy);
        this.direction = { x: dx / length, y: dy / length };
        this.isExploded = false;
    }

    move() {
        this.circle.x += this.direction.x * this.speed;
        this.circle.y += this.direction.y * this.speed;
    }

    checkCollision(enemies: Map<string, Enemy>) {
        enemies.forEach((enemy) => {
            if (Helper.boundsIntersect(this.circle.getBounds(), enemy.sprite.getBounds())) {
                this.explode();
                // enemy.kill();
            }
        });
    }

    explode() {
        // Explosion logic
        this.isExploded = true;
        const explosion = new PIXI.Graphics();
        explosion.beginFill(0xFFFF00); // Yellow color for explosion
        explosion.drawCircle(0, 0, 30); // Explosion radius
        explosion.endFill();
        explosion.x = this.circle.x;
        explosion.y = this.circle.y;

        setTimeout(() => {
            explosion.destroy();
        }, 500); // Explosion effect duration

        this.circle.parent.addChild(explosion);
        this.circle.destroy();
    }
}
