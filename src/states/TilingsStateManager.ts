import { Tiling } from "../entity/Tiling";
import * as PIXI from "pixi.js";
import { Avatar } from "../entity/Avatar";
import { TilingsSerialization } from "../layer/MainLayer";

class TilingsStateManager {
  // TODO rename Tiling to Tilings and abstract Tiling into its own class
  private tilings: Tiling | undefined;
  public initTilingsState(tilings: Tiling) {
    this.tilings = tilings;
  }

  public getTilings(): PIXI.Sprite[] | undefined {
    return this.tilings?.staticSprites;
  }

  //   public async refreshAllTilings(
  //     tilings: TilingsSerialization,
  //     latestAvatarAbsoluteX: number,
  //     latestAvatarAbsoluteY: number
  //   ) {
  //     const avatar = await Avatar.genInstance();
  //     const previousAvatarAbsoluteX = avatar.getX();
  //     const previousAvatarAbsoluteY = avatar.getY();
  //     const previousTilingsState = tilingsStateManager.getTilings();

  //     // update existing items with new x,y
  //     previousTilingsState.forEach((_, key) => {
  //       if (items[key] != undefined && previousTilingsState.has(key)) {
  //         const latestItemAbsoluteX = items[key].x;
  //         const latestItemAbsoluteY = items[key].y;
  //         const previousItemAbsoluteX = previousTilingsState.get(key)!.getX();
  //         const previousItemAbsoluteY = previousTilingsState.get(key)!.getY();

  //         const relativeX = -(
  //           latestAvatarAbsoluteX -
  //           previousAvatarAbsoluteX -
  //           (latestItemAbsoluteX - previousItemAbsoluteX)
  //         );
  //         const relativeY = -(
  //           latestAvatarAbsoluteY -
  //           previousAvatarAbsoluteY -
  //           (latestItemAbsoluteY - previousItemAbsoluteY)
  //         );
  //         this.setRelativePos(key, relativeX, relativeY);
  //       }
  //     });
  //   }

  private setRelativePos(
    tilingSprite: PIXI.Sprite,
    relativeX: number,
    relativeY: number
  ): void {
    tilingSprite.x += relativeX;
    tilingSprite.y += relativeY;
  }
}

export const tilingsStateManager = new TilingsStateManager();
