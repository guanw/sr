import * as PIXI from "pixi.js";
import { v4 as uuidv4 } from 'uuid';
import { Entity } from './Entity';

export const enemySpeed: number = 1;


export class EnemyFactory {
    private enemies: Map<string, Enemy>;
    private app: PIXI.Application;

    public constructor(app: PIXI.Application) {
        this.app = app;
        this.enemies = new Map<string, Enemy>();
    }

    public addEnemy() {
        const uuid = uuidv4();
        this.enemies.set(uuid, new Enemy(this.app));
    }

    public getEnemies(): Map<string, Enemy> {
        return this.enemies;
    }
}

export class Enemy extends Entity {
    private sprite: PIXI.Graphics;
    private app: PIXI.Application;

    constructor(app: PIXI.Application) {

        super();
        this.app = app;
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

    public destroy() {
        this.app.stage.removeChild(this.sprite);
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