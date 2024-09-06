import * as PIXI from "pixi.js";
import { Avatar, avatarMetaData } from "../entity/Avatar";
import { globalState } from "../states/events";
import { Tiling } from "../entity/Tiling";
import { MainLayer } from "../layer/MainLayer";
import { DEBUG_BOUND_COLOR, GAME_SIZE } from "../utils/Constants";
import Application from "../entity/Application";

export class DebugTool {
  private static instance: DebugTool;
  public container: PIXI.Container;
  private avatarText: PIXI.Text;

  // avatar bound box
  private avatarContainer = new PIXI.Container();
  private avatarBoundingBox!: PIXI.Graphics;

  // tiling bound box
  private tilingBoundingBoxes: PIXI.Graphics[] = [];

  // TODO P1
  // item bound box
  // enemy bound box

  constructor() {
    this.container = new PIXI.Container();
    this.avatarText = new PIXI.Text("", { fill: "white" });
    this.container.addChild(this.avatarText);
    this.container.visible = globalState.isDebugToolVisible;
  }

  static async genInstance() {
    if (!this.instance) {
      const mainLayer = await MainLayer.genInstance();
      const tool = new DebugTool();
      mainLayer.layer.addChild(tool.container);
      this.instance = tool;
      this.instance.container.x = GAME_SIZE / 2;
      this.instance.container.y = GAME_SIZE / 2;
    }
    return this.instance;
  }

  public async toggle() {
    globalState.isDebugToolVisible = !globalState.isDebugToolVisible;
    this.container.visible = globalState.isDebugToolVisible;

    const mainLayer = await MainLayer.genInstance();
    if (this.container.visible) {
      // add bounding box for avatar
      this.avatarBoundingBox = this.createBoundingBox(this.avatarContainer);
      mainLayer.layer.addChild(this.avatarContainer);

      const avatar = await Avatar.genInstance();
      this.updateBoundingBox(this.avatarBoundingBox, avatar.walkingSprite);

      const tiling = await Tiling.genInstance();
      // add bounding box for tilings
      tiling.staticSprites.forEach((staticSprite) => {
        // this.tilingContainers.push(staticSprite);
        const tilingBoundingBox = this.createBoundingBox(staticSprite);
        this.tilingBoundingBoxes.push(tilingBoundingBox);
        mainLayer.layer.addChild(tilingBoundingBox);
      });
    } else {
      // remove bounding box for avatar
      mainLayer.layer.removeChild(this.avatarContainer);

      // remove bounding box for tilings
      this.tilingBoundingBoxes.forEach((tilingBoundingBox) => {
        tilingBoundingBox.clear();
      });
    }
  }

  public async genUpdate() {
    if (!globalState.isDebugToolVisible) {
      return;
    }
    const tiling = await Tiling.genInstance();
    const avatar = await Avatar.genInstance();
    const app = await Application.genInstance();
    const hp = avatar.getHealth_DEBUG_TOOL_ONLY();
    this.avatarText.text = `
      Relative Position: (${-tiling.getX()}, ${-tiling.getY()})
      Absoluate: (${avatar.getX()}, ${avatar.getY()})
      Stage Position: (${app.app.stage.x}, ${app.app.stage.y})
      HP: ${hp}
      killed enemies: ${avatarMetaData.scoring_sytem.value}
    `;

    this.tilingBoundingBoxes.forEach((boundingBox, i) => {
      this.updateBoundingBox(boundingBox, tiling.staticSprites[i]);
    });
  }

  private createBoundingBox(container: PIXI.Container): PIXI.Graphics {
    const graphics = new PIXI.Graphics();
    container.addChild(graphics);
    return graphics;
  }

  // Function to update the bounding box position
  public updateBoundingBox(graphics: PIXI.Graphics, sprite: PIXI.Sprite) {
    if (sprite == undefined) {
      return;
    }
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
