import * as PIXI from "pixi.js";
import { Entity } from "./Entity";
import {
  GAME_SIZE,
  BASE_TILING_URL,
  BACKGROUND_LAYER,
} from "../utils/Constants";
import { MainLayer } from "../layer/MainLayer";

export class Background extends Entity {
  private background: PIXI.TilingSprite;
  public static instance: Background;
  private constructor(textures: PIXI.Texture[], layer: PIXI.Container) {
    super();
    this.background = new PIXI.TilingSprite({
      texture: textures[0],
      width: GAME_SIZE,
      height: GAME_SIZE,
    });

    layer.addChildAt(this.background, BACKGROUND_LAYER);
  }

  public static async genInstance() {
    if (!Background.instance) {
      const mainLayer = await MainLayer.genInstance();
      const tilings = await Background.genLoad();
      Background.instance = new Background(tilings, mainLayer.layer);
    }
    return Background.instance;
  }

  private static async genLoad() {
    const baseTexture = await PIXI.Assets.load(BASE_TILING_URL);
    return [baseTexture];
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
