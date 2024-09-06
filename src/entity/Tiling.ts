import * as PIXI from "pixi.js";
import { Entity } from "./Entity";
import {
  GAME_SIZE,
  BASE_TILING_URL,
  RANDOM_TILING_URL,
  SAND_TILING_COUNT,
  PILLAR_BOTTOM_TILING_URL,
  PILLAR_MIDDLE_TILING_URL,
  PILLAR_TOP_TILING_URL,
  PILLAR_TILING_COUNT,
  TILING_SIZE,
  TILING_LAYER,
} from "../utils/Constants";
import { MainLayer } from "../layer/MainLayer";
import { Position } from "./Application";
import { Avatar } from "./Avatar";
import { Helper } from "../utils/Helper";
import { ENABLE_COLLISION } from "../utils/Knobs";
import { Background } from "./Background";

export class Tiling extends Entity {
  private background: Background;
  public staticSprites: PIXI.Sprite[] = [];
  public static instance: Tiling;
  private constructor(
    background: Background,
    textures: PIXI.Texture[],
    layer: PIXI.Container
  ) {
    super();
    this.background = background;

    const worldSize = GAME_SIZE * 15;
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
      layer.addChildAt(staticSprite, TILING_LAYER);
    });
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
      const background = await Background.genInstance();
      const mainLayer = await MainLayer.genInstance();
      const tilings = await Tiling.genLoadTiling();
      Tiling.instance = new Tiling(background, tilings, mainLayer.layer);
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
    return this.background.getX();
  }
  getY(): number {
    return this.background.getY();
  }
  setDeltaX(deltaX: number): void {
    this.staticSprites.forEach((sprite) => {
      sprite.x += deltaX;
    });
  }
  setDeltaY(deltaY: number): void {
    this.staticSprites.forEach((sprite) => {
      sprite.y += deltaY;
    });
  }
  getDisplacement(): number {
    throw new Error("Tiling Should not need to implement");
  }
  public get width(): number {
    throw new Error("Method not implemented.");
  }
  public get height(): number {
    throw new Error("Method not implemented.");
  }

  public async genCheckCollisionWithAvatar(): Promise<boolean> {
    const avatar = await Avatar.genInstance();
    for (const sprite of this.staticSprites) {
      if (this.isCollision(avatar, sprite)) {
        return true;
      }
    }
    return false;
  }

  private isCollision(avatar: Avatar, sprite: PIXI.Sprite): boolean {
    if (!ENABLE_COLLISION) {
      return false;
    }
    const avatarBounds = avatar.getBounds();
    const spriteBounds = sprite.getBounds();
    return Helper.boundsIntersect(avatarBounds, spriteBounds);
  }
}
