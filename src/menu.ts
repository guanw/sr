import * as PIXI from "pixi.js";

class Menu {
  public container!: PIXI.Container;
  async genInitialize(app: PIXI.Application<PIXI.Renderer>) {
    this.container = new PIXI.Container();
    const menuBackground = new PIXI.Graphics();
    menuBackground.beginFill(0x000000, 0.5);
    menuBackground.drawRect(
      -app.stage.x,
      -app.stage.y,
      app.screen.width,
      app.screen.height
    );
    menuBackground.endFill();
    this.container.addChild(menuBackground);

    const menuText = new PIXI.Text('Game Paused. Press "M" to resume.', {
      fontSize: 24,
      fill: 0xffffff,
      align: "center",
    });
    menuText.anchor.set(0.5);
    menuText.x = app.screen.width / 2;
    menuText.y = app.screen.height / 2;
    this.container.addChild(menuText);

    app.stage.addChild(this.container);
    this.container.visible = false; // Hide the menu initially
  }

  public setMenuVisibility(isVisible: boolean) {
    this.container.visible = isVisible;
  }
}

const menu = new Menu();
export { menu };
