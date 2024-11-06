import * as PIXI from "pixi.js";
import { Entity } from "./Entity";
import { GAME_WINDOW_SIZE, BACKGROUND_LAYER } from "../utils/Constants";
import { mainLayer } from "../layer/MainLayer";
import { BACKGROUND_ASSET, ResourceLoader } from "../ResourceLoader";

export class Background extends Entity {
  private background: PIXI.TilingSprite;
  public static instance: Background;
  private constructor(texture: PIXI.Texture, layer: PIXI.Container) {
    super();
    this.background = new PIXI.TilingSprite({
      texture: texture,
      width: GAME_WINDOW_SIZE,
      height: GAME_WINDOW_SIZE,
    });

    layer.addChildAt(this.background, BACKGROUND_LAYER);
  }

  public static async genInstance() {
    if (!Background.instance) {
      const resourceLoader = await ResourceLoader.genInstance();
      const tiling = resourceLoader.getResource(BACKGROUND_ASSET);
      Background.instance = new Background(tiling, mainLayer.layer);
    }
    return Background.instance;
  }

  getX(): number {
    return this.background.tilePosition.x;
  }
  getY(): number {
    return this.background.tilePosition.y;
  }
  setDeltaX(deltaX: number): void {
    this.background.tilePosition.x -= deltaX;
  }
  setDeltaY(deltaY: number): void {
    this.background.tilePosition.y -= deltaY;
  }
  getDisplacement(): number {
    throw new Error("Background Should not need to implement");
  }
  public get width(): number {
    throw new Error("Method not implemented.");
  }
  public get height(): number {
    throw new Error("Method not implemented.");
  }
}
