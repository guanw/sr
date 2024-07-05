import * as PIXI from "pixi.js";

function addRandomItem(app, appWidth, appHeight) {
    const item = new PIXI.Graphics();
    item.fill(0xff0000)
    item.beginFill(0xff0000);
    item.drawCircle(0, 0, 10);
    item.endFill();
    item.x = Math.random() * appWidth;
    item.y = Math.random() * appHeight;
    app.stage.addChild(item);
}
export function createEnvironmentReferences(app) {
    const appWidth = app.screen.width;
    const appHeight = app.screen.height;
    for (let i = 0; i < 5; i++) {
        addRandomItem(app, appWidth, appHeight);
    }
}
