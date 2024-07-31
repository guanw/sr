import * as PIXI from "pixi.js";
import { Entity } from '../Entity';

export const enemySpeed: number = 1;

class Enemy extends Entity {
    private sprite: PIXI.Graphics;

    constructor(app: PIXI.Application) {
        super();
        const appWidth = app.stage.width;
        const appHeight = app.stage.height;
        this.sprite = new PIXI.Graphics();
        this.sprite.fill(0xff0000)
        this.sprite.beginFill(0xff33ee);
        this.sprite.drawCircle(0, 0, 10);
        this.sprite.endFill();
        this.sprite.x = Math.random() * appWidth - app.stage.x;
        this.sprite.y = Math.random() * appHeight - app.stage.y;
        app.stage.addChild(this.sprite);
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

    public destroy(app: PIXI.Application) {
        app.stage.removeChild(this.sprite);
    }

    public moveTowardsPlayer(
        playerX: number,
        playerY: number,
    ) {
        const enemyX = this.getX();
        const enemyY = this.getY();
        const dx = playerX - enemyX;
        const dy = playerY - enemyY;
        const angle = Math.atan2(dy, dx);
        const vx = Math.cos(angle) * enemySpeed;
        const vy = Math.sin(angle) * enemySpeed;
        this.setPos(enemyX+vx, enemyY+vy);
    }
}

export { Enemy };