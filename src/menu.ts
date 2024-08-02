import * as PIXI from "pixi.js";
import Application from "./entity/Application";

export class Menu {
    private container: PIXI.Container;
    constructor(app: PIXI.Application<PIXI.Renderer>) {
        this.container = new PIXI.Container();
        const menuBackground = new PIXI.Graphics();
        menuBackground.beginFill(0x000000, 0.5);
        menuBackground.drawRect(-app.stage.x, -app.stage.y, app.screen.width, app.screen.height);
        menuBackground.endFill();
        this.container.addChild(menuBackground);

        const menuText = new PIXI.Text('Game Paused. Press "M" to resume.', {
            fontSize: 24,
            fill: 0xffffff,
            align: 'center'
        });
        menuText.anchor.set(0.5);
        menuText.x = (app.screen.width / 2);
        menuText.y = (app.screen.height / 2);
        this.container.addChild(menuText);

        app.stage.addChild(this.container);
        this.container.visible = false; // Hide the menu initially
    }

    public async genUpdateMenuPosition() {
        const instance = await Application.getInstance();
        this.container.x = -instance.app.stage.x;
        this.container.y = -instance.app.stage.y;
    }

    public setMenuVisibility(isVisible: boolean) {
        this.container.visible = isVisible;
    }
}
