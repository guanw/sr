import * as PIXI from "pixi.js";
import { Avatar, avatarMetaData } from "../entity/Avatar";
import { globalState } from "../states/events";
import { MainLayer } from "../layer/MainLayer";
import { DEBUG_BOUND_COLOR, GAME_WINDOW_SIZE } from "../utils/Constants";
import Application from "../entity/Application";
import { tilingsStateManager } from "../states/TilingsStateManager";
import { Plugin } from "../PluginManager";

export class DebugTool extends Plugin {
  private static instance: DebugTool;
  public container!: PIXI.Container;
  private avatarText!: PIXI.Text;

  private avatarBoundingBox!: PIXI.Graphics;
  private tilingBoundingBoxes: { [key: string]: PIXI.Graphics } = {};

  // TODO P1
  // item bound box
  // enemy bound box

  static async genInstance() {
    if (!this.instance) {
      const tool = new DebugTool();
      this.instance = tool;
    }
    return this.instance;
  }

  async genInitialize(): Promise<void> {
    this.container = new PIXI.Container();
    this.avatarText = new PIXI.Text("", { fill: "white" });
    this.container.addChild(this.avatarText);
    this.container.visible = globalState.isDebugToolVisible;

    const mainLayer = await MainLayer.genInstance();
    mainLayer.layer.addChild(this.container);
    this.container.x = GAME_WINDOW_SIZE / 2;
    this.container.y = GAME_WINDOW_SIZE / 2;
  }

  async genUpdate(): Promise<void> {
    if (!globalState.isDebugToolVisible) {
      return;
    }
    const avatar = await Avatar.genInstance();
    const app = await Application.genInstance();
    const hp = avatar.getHealth_DEBUG_TOOL_ONLY();
    this.avatarText.text = `
      Absoluate: (${avatar.getX()}, ${avatar.getY()})
      Stage Position: (${app.app.stage.x}, ${app.app.stage.y})
      HP: ${hp}
      killed enemies: ${avatarMetaData.scoring_sytem.value}
    `;

    const tiles = await tilingsStateManager.getTilings();
    // update bounding box for tilings
    Object.keys(this.tilingBoundingBoxes).forEach((key) => {
      this.updateBoundingBox(
        this.tilingBoundingBoxes[key],
        tiles.get(key)?.sprite
      );
    });
  }

  public async toggle() {
    globalState.isDebugToolVisible = !globalState.isDebugToolVisible;
    this.container.visible = globalState.isDebugToolVisible;

    const mainLayer = await MainLayer.genInstance();
    if (this.container.visible) {
      await this.genRenderBoundingBox(mainLayer);
    } else {
      this.hideBoundingBox();
    }
  }

  private async genRenderBoundingBox(mainLayer: MainLayer) {
    const avatar = await Avatar.genInstance();
    // add bounding box for avatar
    this.avatarBoundingBox = this.createBoundingBox(avatar.walkingSprite);
    this.updateBoundingBox(this.avatarBoundingBox, avatar.walkingSprite);
    mainLayer.layer.addChild(this.avatarBoundingBox);

    // add bounding box for tilings
    const tiles = await tilingsStateManager.getTilings();
    tiles.forEach((tile, key) => {
      const tilingBoundingBox = this.createBoundingBox(tile.sprite);
      this.tilingBoundingBoxes[key] = tilingBoundingBox;
      mainLayer.layer.addChild(tilingBoundingBox);
    });
  }

  private hideBoundingBox() {
    // remove bounding box for avatar
    this.avatarBoundingBox.clear();

    // remove bounding box for tilings
    Object.keys(this.tilingBoundingBoxes).forEach((key) => {
      this.tilingBoundingBoxes[key].clear();
    });
  }

  private createBoundingBox(container: PIXI.Container): PIXI.Graphics {
    const graphics = new PIXI.Graphics();
    container.addChild(graphics);
    return graphics;
  }

  // Function to update the bounding box position
  public updateBoundingBox(
    graphics: PIXI.Graphics,
    sprite: PIXI.Sprite | undefined
  ) {
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
