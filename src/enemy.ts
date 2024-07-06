import * as PIXI from "pixi.js";

export const enemySpeed: number = 1;

function createEnemy(app: PIXI.Application<PIXI.Renderer>, appWidth: number, appHeight: number):PIXI.Graphics {
    const item = new PIXI.Graphics();
    item.fill(0xff0000)
    item.beginFill(0xff33ee);
    item.drawCircle(0, 0, 10);
    item.endFill();
    item.x = Math.random() * appWidth;
    item.y = Math.random() * appHeight;
    app.stage.addChild(item);
    return item;
}

export function createEnemies(app: PIXI.Application<PIXI.Renderer>) {
    const appWidth = app.screen.width;
    const appHeight = app.screen.height;
    const enemies = [];
    for (let i = 0; i < 3; i++) {
        enemies.push(createEnemy(app, appWidth, appHeight));
    }
    return enemies;
}