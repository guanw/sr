import * as PIXI from "pixi.js";
import { Entity } from "./Entity";
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  BASE_TILING_URL,
  RANDOM_TILING_URL,
  SAND_TILING_COUNT,
  PILLAR_BOTTOM_TILING_URL,
  PILLAR_MIDDLE_TILING_URL,
  PILLAR_TOP_TILING_URL,
  PILLAR_TILING_COUNT,
  TILING_SIZE,
} from "../utils/Constants";
import { MainLayer } from "../layer/MainLayer";
import { Position } from "./Application";

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

    const worldSize = GAME_HEIGHT * 15;
    for (let i = 0; i < SAND_TILING_COUNT; i++) {
      const startX = Math.random() * worldSize;
      const startY = Math.random() * worldSize;
      const sandSprites = this.createSprites(
        [textures[1]],
        [
          {
            x: 0,
            y: 0,
          },
        ],
        startX,
        startY
      );
      this.staticSprites = this.staticSprites.concat(sandSprites);
    }
    for (let i = 0; i < PILLAR_TILING_COUNT; i++) {
      const startX = Math.random() * worldSize;
      const startY = Math.random() * worldSize;
      const pillarSprites = this.createSprites(
        [textures[2], textures[3], textures[4]],
        [
          {
            x: 0,
            y: 0,
          },
          {
            x: 0,
            y: 1,
          },
          {
            x: 0,
            y: 2,
          },
        ],
        startX,
        startY
      );
      this.staticSprites = this.staticSprites.concat(pillarSprites);
    }
    this.staticSprites.forEach((staticSprite) => {
      layer.addChildAt(staticSprite, 0);
    });
    layer.addChildAt(this.tilingSprite, 0);
  }

  private createSprites(
    textures: PIXI.Texture[],
    offsets: Position[],
    startX: number,
    startY: number
  ): PIXI.Sprite[] {
    const sprites: PIXI.Sprite[] = [];
    textures.forEach((texture, i) => {
      sprites.push(
        new PIXI.Sprite({
          texture: texture,
          x: startX + offsets[i].x * TILING_SIZE,
          y: startY + offsets[i].y * TILING_SIZE,
          anchor: 0.5,
        })
      );
    });
    return sprites;
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
    const pillarTopTexture = await PIXI.Assets.load(PILLAR_TOP_TILING_URL);
    const pillarMiddleTexture = await PIXI.Assets.load(
      PILLAR_MIDDLE_TILING_URL
    );
    const pillarBottomTexture = await PIXI.Assets.load(
      PILLAR_BOTTOM_TILING_URL
    );
    return [
      baseTexture,
      randomGroundTexture,
      pillarTopTexture,
      pillarMiddleTexture,
      pillarBottomTexture,
    ];
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
