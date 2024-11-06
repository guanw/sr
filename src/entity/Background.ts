import * as PIXI from "pixi.js";
import { Entity } from "./Entity";
import { GAME_WINDOW_SIZE, BACKGROUND_LAYER } from "../utils/Constants";
import { mainLayer } from "../layer/MainLayer";
import { BACKGROUND_ASSET, resourceLoader } from "../ResourceLoader";

class Background extends Entity {
  private background!: PIXI.TilingSprite;

  public async genInitialize() {
    const tiling = resourceLoader.getResource(BACKGROUND_ASSET);
    this.background = new PIXI.TilingSprite({
      texture: tiling,
      width: GAME_WINDOW_SIZE,
      height: GAME_WINDOW_SIZE,
    });

    mainLayer.layer.addChildAt(this.background, BACKGROUND_LAYER);
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

const background = new Background();
export { background };
