import * as PIXI from 'pixi.js';
import { Helper } from '../../utils/Helper';
import { MainLayer } from '../../layer/MainLayer';
import enemiesStateManager from '../../states/EnemyStateManager';
import attackStateManager from '../../states/AttackStateManager';

export class Wind {
    instance: PIXI.AnimatedSprite;
    speed: number;
    direction: { x: number; y: number; };
    isExploded: boolean;
    private constructor(frames: PIXI.Texture[], x: number, y: number, targetX: number, targetY: number) {
        this.speed = 5;
        this.instance = new PIXI.AnimatedSprite(frames);
        this.instance.animationSpeed = 0.1;
        this.instance.play();
        this.instance.x = x;
        this.instance.y = y;
        this.isExploded = false;

        // Calculate the direction vector
        this.direction = Helper.calculateDirection(x, y, targetX, targetY, 32);
    }

    public static async create(x: number, y: number, targetX: number, targetY: number) {
        const texture = await PIXI.Assets.load('https://guanw.github.io/sr_assets/smoke/px_5.png');
        const frames = [];
        const frameWidth = 64; // Width of a single frame in pixels
        const frameHeight = 64; // Height of a single frame in pixels
        const numberOfFrames = 16; // Number of frames in the animation
        for (let i = 0; i < numberOfFrames; i++) {
            const rect = new PIXI.Rectangle(i * frameWidth, 0, frameWidth, frameHeight);
            frames.push(new PIXI.Texture({source: texture.baseTexture, frame: rect}));
        }

        return new Wind(frames, x, y, targetX, targetY);
    }

    move() {
        this.instance.x += this.direction.x * this.speed;
        this.instance.y += this.direction.y * this.speed;
    }

    checkCollision(windKey: string) {
        const attackBounds = Helper.isValidObject(this.instance) ? this.instance.getBounds() : null;
        if (!attackBounds) {
            return;
        }

        const enemies = enemiesStateManager.getEnemies();
        enemies.forEach((enemy, key) => {
            const enemyBounds = Helper.isValidObject(enemy.sprite) ? enemy.sprite.getBounds() : null;
            if (!enemyBounds) {
                return;
            }

            if (Helper.boundsIntersect(attackBounds, enemyBounds)) {
                enemy.destroy(MainLayer.instance.layer);
                enemies.delete(key);
                this.explode();
                attackStateManager.removeAttack(windKey);
            }
        });
    }

    explode() {
        // add Explosion logic
        this.isExploded = true;
        // const explosion = new PIXI.Graphics();
        // explosion.beginFill(0xFFFF00); // Yellow color for explosion
        // explosion.drawCircle(0, 0, 30); // Explosion radius
        // explosion.endFill();
        // explosion.x = this.instance.x;
        // explosion.y = this.instance.y;

        // setTimeout(() => {
        //     explosion.destroy();
        // }, 500); // Explosion effect duration

        // this.instance.parent.addChild(explosion);
        this.instance.destroy();
    }
}
