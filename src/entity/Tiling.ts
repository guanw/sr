import * as PIXI from "pixi.js";
import { Entity } from "./Entity";
import {
  GAME_SIZE,
  SAND_TILING_COUNT,
  PILLAR_TILING_COUNT,
  TILING_SIZE,
  TILING_LAYER,
} from "../utils/Constants";
import { MainLayer, TilingObject } from "../layer/MainLayer";
import { Position } from "./Application";
import { Avatar } from "./Avatar";
import { Direction, Helper } from "../utils/Helper";
import { ENABLE_COLLISION } from "../utils/Knobs";
import {
  BASE_TILING_ASSET,
  PILLAR_BOTTOM_TILING_ASSET,
  PILLAR_MIDDLE_TILING_ASSET,
  PILLAR_TOP_TILING_ASSET,
  RANDOM_TILING_ASSET,
  ResourceLoader,
} from "../ResourceLoader";
import { tilingsStateManager } from "../states/TilingsStateManager";

export class Tiling extends Entity {
  public staticSprites: PIXI.Sprite[] = [];
  public static instance: Tiling;
  private constructor(
    layer: PIXI.Container,
    textures: PIXI.Texture[],
    tilings_location: [TilingObject] | null = null
  ) {
    super();

    if (tilings_location === null) {
      this.initiateOfflineTilings(textures, layer);
      return;
    }

    this.initiateOnlineTilings(textures, layer, tilings_location);
  }

  private initiateOfflineTilings(
    textures: PIXI.Texture[],
    layer: PIXI.Container
  ) {
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

  private initiateOnlineTilings(
    textures: PIXI.Texture[],
    layer: PIXI.Container,
    tilings_location: [TilingObject]
  ) {
    tilings_location.forEach((element) => {
      switch (element.type) {
        case "SAND": {
          const sandSprites = this.createSprites(
            [textures[1]],
            [
              {
                x: 0,
                y: 0,
              },
            ],
            element["x"],
            element["y"]
          );
          this.staticSprites = this.staticSprites.concat(sandSprites);
          break;
        }
        case "PILLAR": {
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
            element["x"],
            element["y"]
          );
          this.staticSprites = this.staticSprites.concat(pillarSprites);
        }
      }
    });
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

  public static async genInstance(
    tilings_location: [TilingObject] | null = null
  ) {
    if (!Tiling.instance) {
      const mainLayer = await MainLayer.genInstance();
      const tilings = await Tiling.genLoadTiling();
      Tiling.instance = new Tiling(mainLayer.layer, tilings, tilings_location);
      tilingsStateManager.initTilingsState(Tiling.instance);
    }
    return Tiling.instance;
  }

  private static async genLoadTiling() {
    const resourceLoader = await ResourceLoader.genInstance();
    const baseTexture = resourceLoader.getResource(BASE_TILING_ASSET);
    const randomGroundTexture = resourceLoader.getResource(RANDOM_TILING_ASSET);
    const pillarTopTexture = resourceLoader.getResource(
      PILLAR_TOP_TILING_ASSET
    );
    const pillarMiddleTexture = resourceLoader.getResource(
      PILLAR_MIDDLE_TILING_ASSET
    );
    const pillarBottomTexture = resourceLoader.getResource(
      PILLAR_BOTTOM_TILING_ASSET
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
    return 0;
  }
  getY(): number {
    return 0;
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

  public async genCheckCollisionWithAvatar(
    direction: Direction
  ): Promise<boolean> {
    const avatar = await Avatar.genInstance();
    for (const sprite of this.staticSprites) {
      if (this.isCollision(avatar, sprite, direction)) {
        return true;
      }
    }
    return false;
  }

  private isCollision(
    avatar: Avatar,
    sprite: PIXI.Sprite,
    direction: Direction
  ): boolean {
    if (!ENABLE_COLLISION) {
      return false;
    }
    const avatarBounds = avatar.getBounds();
    const spriteBounds = sprite.getBounds();
    return Helper.DirectedboundsIntersect(
      avatarBounds,
      spriteBounds,
      direction
    );
  }
}
