import * as PIXI from "pixi.js";
import Application from "./Application";
import { Entity } from "./Entity";
import { GAME_HEIGHT, GAME_WIDTH, TILING_URL } from "../utils/Constants";
import { MainLayer } from "../layer/MainLayer";

export class Tiling extends Entity {
  public tilingSprite: PIXI.TilingSprite;
  public static instance: Tiling;
  private constructor(texture: PIXI.Texture) {
    super();
    this.tilingSprite = new PIXI.TilingSprite({
      texture,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
    });
  }

  public static async genInstance() {
    if (!Tiling.instance) {
      const mainLayer = await MainLayer.genInstance();
      const texture = await PIXI.Assets.load(TILING_URL);
      Tiling.instance = new Tiling(texture);
      mainLayer.layer.addChildAt(Tiling.instance.tilingSprite, 0);
    }
    return Tiling.instance;
  }

  getX(): number {
    return this.tilingSprite.tilePosition.x;
  }
  getY(): number {
    return this.tilingSprite.tilePosition.y;
  }
  setX(x: number): void {
    this.tilingSprite.tilePosition.x = x;
  }
  setY(y: number): void {
    this.tilingSprite.tilePosition.y = y;
  }
  getDisplacement(): number {
    throw new Error("Tiling Should not need to implement");
  }
}
