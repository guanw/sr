import * as PIXI from "pixi.js";
import { Entity } from './Entity';
import { AVATAR_SPEED, ENEMY_ANIMATION_SPEED, ENEMY_FRAME_NUMBER, ENEMY_FRAME_SIZE, ENEMY_SPEED } from '../utils/Constants'

class Enemy extends Entity {
    sprite: PIXI.AnimatedSprite
    private constructor(app: PIXI.Application, layer: PIXI.Container, frames: PIXI.Texture[]) {
        super();
        const appWidth = app.stage.width;
        const appHeight = app.stage.height;
        this.sprite = new PIXI.AnimatedSprite(frames);
        this.sprite.animationSpeed = ENEMY_ANIMATION_SPEED;
        this.sprite.play();
        this.sprite.x = Math.random() * appWidth - app.stage.x;
        this.sprite.y = Math.random() * appHeight - app.stage.y;
        layer.addChild(this.sprite);
    }

    static async create(app: PIXI.Application, layer: PIXI.Container) {
        const texture = await PIXI.Assets.load('https://guanw.github.io/sr_assets/slime_run.png');
        const frames = [];
        const frameWidth = ENEMY_FRAME_SIZE;
        const frameHeight = ENEMY_FRAME_SIZE;
        const numberOfFrames = ENEMY_FRAME_NUMBER;
        for (let i = 0; i < numberOfFrames; i++) {
            const rect = new PIXI.Rectangle(i * frameWidth, 0, frameWidth, frameHeight);
            frames.push(new PIXI.Texture({source: texture.baseTexture, frame: rect}));
        }
        return new Enemy(app, layer, frames);
    }

    public moveLeft() {
        this.sprite.x -= AVATAR_SPEED;
    }
    public moveRight() {
        this.sprite.x += AVATAR_SPEED;
    }
    public moveDown() {
        this.sprite.y -= AVATAR_SPEED;
    }
    public moveUp() {
        this.sprite.y += AVATAR_SPEED;
    }

    public getX(): number {
        return this.sprite.x;
    }

    public getY(): number {
        return this.sprite.y;
    }

    public setPos(x: number, y: number) {
        this.sprite.x = x;
        this.sprite.y = y;
    }

    public destroy(layer: PIXI.Container) {
        layer.removeChild(this.sprite);
    }

    public moveTowards(
        playerX: number,
        playerY: number,
    ) {
        const enemyX = this.getX();
        const enemyY = this.getY();
        const dx = playerX - enemyX;
        const dy = playerY - enemyY;
        const angle = Math.atan2(dy, dx);
        const vx = Math.cos(angle) * ENEMY_SPEED;
        const vy = Math.sin(angle) * ENEMY_SPEED;
        this.setPos(enemyX+vx, enemyY+vy);
    }
}

export { Enemy };