import * as PIXI from "pixi.js";
import { Avatar } from "../entity/Avatar";
import { globalState } from "../states/events";
import Application from "../entity/Application";
import { Tiling } from "../entity/Tiling";

export class DebugTool {
  private static instance: DebugTool;
  public container: PIXI.Container;
  private text: PIXI.Text;

  constructor() {
    this.container = new PIXI.Container();
    this.text = new PIXI.Text("", { fill: "white" });
    this.container.addChild(this.text);
    this.container.visible = globalState.isDebugToolVisible;
  }

  static async genInstance() {
    if (!this.instance) {
      const instance = await Application.genInstance();
      const tool = new DebugTool();
      instance.app.stage.addChild(tool.container);
      this.instance = tool;
      this.instance.container.x = instance.app.screen.width / 2;
      this.instance.container.y = instance.app.screen.height / 2;
    }
    return this.instance;
  }

  public toggle() {
    globalState.isDebugToolVisible = !globalState.isDebugToolVisible;
    this.container.visible = globalState.isDebugToolVisible;
  }

  public async genUpdate() {
    const tiling = await Tiling.genInstance();
    const avatar = await Avatar.genInstance();
    const hp = avatar.getHealth_DEBUG_TOOL_ONLY();
    this.text.text = `Position: (${-tiling.getX()}, ${-tiling.getY()})\nHP: ${hp}\n`;
  }
}
