import * as PIXI from "pixi.js";
import Application from "./Application";
import { Entity } from "./Entity";
import { TILING_URL } from "../utils/Constants";

export class Tiling extends Entity {
  public tilingSprite: PIXI.TilingSprite;
  public static instance: Tiling;
  private constructor(app: PIXI.Application, texture: PIXI.Texture) {
    super();
    this.tilingSprite = new PIXI.TilingSprite({
      texture,
      width: app.screen.width,
      height: app.screen.height,
    });
    app.stage.addChild(this.tilingSprite);
  }

  public static async genInstance() {
    if (!Tiling.instance) {
      const instance = await Application.genInstance();
      const texture = await PIXI.Assets.load(TILING_URL);
      Tiling.instance = new Tiling(instance.app, texture);
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
