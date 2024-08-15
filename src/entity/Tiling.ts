import * as PIXI from "pixi.js";
import { Entity } from "./Entity";
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  BASE_TILING_URL,
  RANDOM_TILING_URL,
  TILING_COUNT,
} from "../utils/Constants";
import { MainLayer } from "../layer/MainLayer";

export class Tiling extends Entity {
  private tilingSprite: PIXI.TilingSprite;
  private staticSprites: PIXI.Sprite[] = [];
  public static instance: Tiling;
  private constructor(textures: PIXI.Texture[], layer: PIXI.Container) {
    super();
    this.tilingSprite = new PIXI.TilingSprite({
      texture: textures[0],
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
    });
    const worldSize = GAME_HEIGHT * 30;
    for (let i = 0; i < TILING_COUNT; i++) {
      const staticSprite = new PIXI.Sprite({
        texture: textures[1],
        x: Math.random() * worldSize,
        y: Math.random() * worldSize,
        anchor: 0.5,
      });
      this.staticSprites.push(staticSprite);
      layer.addChildAt(staticSprite, 0);
    }
    layer.addChildAt(this.tilingSprite, 0);
  }

  public static async genInstance() {
    if (!Tiling.instance) {
      const mainLayer = await MainLayer.genInstance();
      const tilings = await Tiling.genLoadTiling();
      Tiling.instance = new Tiling(tilings, mainLayer.layer);
    }
    return Tiling.instance;
  }

  private static async genLoadTiling() {
    const baseTexture = await PIXI.Assets.load(BASE_TILING_URL);
    const randomGroundTexture = await PIXI.Assets.load(RANDOM_TILING_URL);
    return [baseTexture, randomGroundTexture];
  }

  getX(): number {
    return this.tilingSprite.tilePosition.x;
  }
  getY(): number {
    return this.tilingSprite.tilePosition.y;
  }
  setDeltaX(deltaX: number): void {
    this.tilingSprite.tilePosition.x -= deltaX;
    this.staticSprites.forEach((sprite) => {
      sprite.x += deltaX;
    });
  }
  setDeltaY(deltaY: number): void {
    this.tilingSprite.tilePosition.y -= deltaY;
    this.staticSprites.forEach((sprite) => {
      sprite.y += deltaY;
    });
  }
  getDisplacement(): number {
    throw new Error("Tiling Should not need to implement");
  }
}
