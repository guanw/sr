import * as PIXI from "pixi.js";

export const enemySpeed: number = 1;


export class EnemyFactory {
    private enemies: Map<string, Enemy>;
    private app: PIXI.Application;

    public constructor(app: PIXI.Application) {
        this.app = app;
        this.enemies = new Map<string, Enemy>();
    }

    public addEnemy() {
        this.enemies.set(this.enemies.size.toString(), new Enemy(this.app));
    }

    public getEnemies(): Map<string, Enemy> {
        return this.enemies;
    }
}

export class Enemy {
    private sprite: PIXI.Graphics;
    private app: PIXI.Application;

    constructor(app: PIXI.Application) {

        this.app = app;
        const appWidth = app.stage.width;
        const appHeight = app.stage.height;
        this.sprite = new PIXI.Graphics();
        this.sprite.fill(0xff0000)
        this.sprite.beginFill(0xff33ee);
        this.sprite.drawCircle(0, 0, 10);
        this.sprite.endFill();
        this.sprite.x = Math.random() * appWidth;
        this.sprite.y = Math.random() * appHeight;
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

type Enemies = {
    [key: string]: PIXI.Graphics;
};