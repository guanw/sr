import * as PIXI from "pixi.js";
import { Avatar } from "../entity/Avatar";
import { globalState } from "../states/events";
import { Tiling } from "../entity/Tiling";
import { MainLayer } from "../layer/MainLayer";

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
      const mainLayer = await MainLayer.genInstance();
      const tool = new DebugTool();
      mainLayer.layer.addChild(tool.container);
      this.instance = tool;
      this.instance.container.x = 400;
      this.instance.container.y = 300;
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
