import * as PIXI from "pixi.js";
import { Avatar, avatarMetaData } from "../entity/Avatar";
import { globalState } from "../states/events";
import { Tiling } from "../entity/Tiling";
import { MainLayer } from "../layer/MainLayer";
import { DEBUG_BOUND_COLOR, GAME_HEIGHT, GAME_WIDTH } from "../utils/Constants";

export class DebugTool {
  private static instance: DebugTool;
  public container: PIXI.Container;
  private text: PIXI.Text;

  // avatar bound box
  private avatarContainer = new PIXI.Container();
  private avatarBoundingBox!: PIXI.Graphics;

  // TODO
  // tiling bound box
  // item bound box
  // enemy bound box

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
      this.instance.container.x = GAME_WIDTH / 2;
      this.instance.container.y = GAME_HEIGHT / 2;
    }
    return this.instance;
  }

  public async toggle() {
    globalState.isDebugToolVisible = !globalState.isDebugToolVisible;
    this.container.visible = globalState.isDebugToolVisible;

    const mainLayer = await MainLayer.genInstance();
    if (this.container.visible) {
      this.avatarBoundingBox = this.createBoundingBox(this.avatarContainer);
      mainLayer.layer.addChild(this.avatarContainer);
    } else {
      mainLayer.layer.removeChild(this.avatarContainer);
    }
  }

  public async genUpdate() {
    const tiling = await Tiling.genInstance();
    const avatar = await Avatar.genInstance();
    const hp = avatar.getHealth_DEBUG_TOOL_ONLY();
    this.text.text = `
      Position: (${-tiling.getX()}, ${-tiling.getY()})
      HP: ${hp}
      killed enemies: ${avatarMetaData.scoring_sytem.value}
    `;

    this.updateBoundingBox(this.avatarBoundingBox, avatar.walkingSprite);
  }

  private createBoundingBox(container: PIXI.Container): PIXI.Graphics {
    const graphics = new PIXI.Graphics();
    container.addChild(graphics);
    return graphics;
  }

  // Function to update the bounding box position
  public updateBoundingBox(graphics: PIXI.Graphics, sprite: PIXI.Sprite) {
    const bounds = sprite.getBounds();
    graphics.clear();
    graphics.moveTo(bounds.minX, bounds.minY);
    graphics.lineTo(bounds.maxX, bounds.minY);
    graphics.lineTo(bounds.maxX, bounds.maxY);
    graphics.lineTo(bounds.minX, bounds.maxY);
    graphics.lineTo(bounds.minX, bounds.minY);
    graphics.stroke({ width: 3, color: DEBUG_BOUND_COLOR });
  }
}
