import * as PIXI from "pixi.js";
import { Entity } from './Entity';

export const enemySpeed: number = 1;

class Enemy extends Entity {
    constructor(app: PIXI.Application, layer: PIXI.Container) {
        super();
        const appWidth = app.stage.width;
        const appHeight = app.stage.height;
        this.instance = new PIXI.Graphics();
        this.instance.fill(0xff0000)
        this.instance.beginFill(0xff33ee);
        this.instance.drawCircle(0, 0, 10);
        this.instance.endFill();
        this.instance.x = Math.random() * appWidth - app.stage.x;
        this.instance.y = Math.random() * appHeight - app.stage.y;
        layer.addChild(this.instance);
    }

    public getX(): number {
        return this.instance.x;
    }

    public getY(): number {
        return this.instance.y;
    }

    public setPos(x: number, y: number) {
        this.instance.x = x;
        this.instance.y = y;
    }

    public destroy(layer: PIXI.Container) {
        layer.removeChild(this.instance);
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
        const vx = Math.cos(angle) * enemySpeed;
        const vy = Math.sin(angle) * enemySpeed;
        this.setPos(enemyX+vx, enemyY+vy);
    }
}

export { Enemy };