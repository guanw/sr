import * as PIXI from "pixi.js";
import { v4 as uuidv4 } from "uuid";
import { Tile } from "../entity/Tiles/Tile";
import {
  GAME_SIZE,
  PILLAR_TILING_COUNT,
  SAND_TILING_COUNT,
  TILING_SIZE,
} from "../utils/Constants";
import { MainLayer, TilingsSerialization } from "../layer/MainLayer";
import { Direction, Helper } from "../utils/Helper";
import { Avatar } from "../entity/Avatar";
import { ENABLE_COLLISION } from "../utils/Knobs";
import {
  BASE_TILING_ASSET,
  PILLAR_BOTTOM_TILING_ASSET,
  PILLAR_MIDDLE_TILING_ASSET,
  PILLAR_TOP_TILING_ASSET,
  RANDOM_TILING_ASSET,
  ResourceLoader,
} from "../ResourceLoader";
import { Logger } from "../utils/Logger";

// NOTE: this needs to match TILING on sr-server
enum TILING {
  SAND = "SAND",
  TOP_PILLAR = "TOP_PILLAR",
  MIDDLE_PILLAR = "MIDDLE_PILLAR",
  BOTTOM_PILLAR = "BOTTOM_PILLAR",
}

class TilingsStateManager {
  private tiles: Map<string, Tile>;
  public constructor() {
    this.tiles = new Map<string, Tile>();
  }

  public async genInitializeOnlineTilings(
    tilings: TilingsSerialization | undefined
  ) {
    if (tilings === undefined) {
      const logger = Logger.getInstance();
      logger.log("tilings not available from server", "warn");
      return;
    }
    const mainLayer = await MainLayer.genInstance();
    const textures = await TilingsStateManager.genLoadTiling();

    Object.keys(tilings).forEach((key) => {
      const tile = tilings[key];
      const x = tile.x;
      const y = tile.y;
      switch (tile.type) {
        case TILING.SAND: {
          const sandTile = new Tile(mainLayer.layer, x, y, textures[1]);
          this.tiles.set(key, sandTile);
          break;
        }
        case TILING.TOP_PILLAR: {
          const pillarTopTile = new Tile(mainLayer.layer, x, y, textures[4]);
          this.tiles.set(key, pillarTopTile);
          break;
        }
        case TILING.MIDDLE_PILLAR: {
          const pillarMiddleTile = new Tile(mainLayer.layer, x, y, textures[3]);
          this.tiles.set(key, pillarMiddleTile);
          break;
        }
        case TILING.BOTTOM_PILLAR: {
          const pillarBottomTile = new Tile(mainLayer.layer, x, y, textures[2]);
          this.tiles.set(key, pillarBottomTile);
          break;
        }
      }
    });

    console.log("online tiles: ", this.tiles);
  }

  public async genInitializeOfflineTilings() {
    const worldSize = GAME_SIZE * 15;
    const textures = await TilingsStateManager.genLoadTiling();
    const mainLayer = await MainLayer.genInstance();

    // initialize sand tiles
    for (let i = 0; i < SAND_TILING_COUNT; i++) {
      const x = Math.random() * worldSize;
      const y = Math.random() * worldSize;
      const sandTile = new Tile(mainLayer.layer, x, y, textures[1]);
      const uuid = uuidv4();
      this.tiles.set(uuid, sandTile);
    }

    // initialize pillar tiles
    for (let i = 0; i < PILLAR_TILING_COUNT; i++) {
      const x = Math.random() * worldSize;
      const y = Math.random() * worldSize;
      const pillarBottomTile = new Tile(mainLayer.layer, x, y, textures[4]);
      const pillarMiddleTile = new Tile(
        mainLayer.layer,
        x,
        y + TILING_SIZE,
        textures[3]
      );
      const pillarTopTile = new Tile(
        mainLayer.layer,
        x,
        y + TILING_SIZE * 2,
        textures[2]
      );
      let uuid = uuidv4();
      this.tiles.set(uuid, pillarBottomTile);
      uuid = uuidv4();
      this.tiles.set(uuid, pillarMiddleTile);
      uuid = uuidv4();
      this.tiles.set(uuid, pillarTopTile);

      console.log("offline tiles: ", this.tiles);
    }
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

  public getTilings(): Map<string, Tile> {
    return this.tiles;
  }

  public async genCheckCollisionWithAvatar(
    direction: Direction
  ): Promise<boolean> {
    const avatar = await Avatar.genInstance();
    for (const tuple of this.tiles) {
      if (this.isCollision(avatar, tuple[1].sprite, direction)) {
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

  public async refreshAllTilings(
    tilings: TilingsSerialization,
    latestAvatarAbsoluteX: number,
    latestAvatarAbsoluteY: number
  ) {
    const avatar = await Avatar.genInstance();
    const previousAvatarAbsoluteX = avatar.getX();
    const previousAvatarAbsoluteY = avatar.getY();
    const previousTilingsState = tilingsStateManager.getTilings();

    // update existing items with new x,y
    for (const key of previousTilingsState.keys()) {
      const previousTileState = previousTilingsState.get(key);
      if (!tilings || !previousTileState || !(key in tilings)) {
        return;
      }

      const latestTilingAbsoluteX = tilings[key].x;
      const latestTilingAbsoluteY = tilings[key].y;
      const previousTilingAbsoluteX = previousTileState.getX();
      const previousTilingAbsoluteY = previousTileState.getY();

      const relativeX = -(
        latestAvatarAbsoluteX -
        previousAvatarAbsoluteX -
        (latestTilingAbsoluteX - previousTilingAbsoluteX)
      );
      const relativeY = -(
        latestAvatarAbsoluteY -
        previousAvatarAbsoluteY -
        (latestTilingAbsoluteY - previousTilingAbsoluteY)
      );
      this.setRelativePos(key, relativeX, relativeY);
    }
  }

  private setRelativePos(
    key: string,
    relativeX: number,
    relativeY: number
  ): void {
    const tile = this.tiles.get(key);
    tile?.setDeltaX(relativeX);
    tile?.setDeltaY(relativeY);
  }
}
const tilingsStateManager = new TilingsStateManager();
export { tilingsStateManager };
