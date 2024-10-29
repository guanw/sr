import * as PIXI from "pixi.js";
import { LoadingView } from "./entity/LoadingView";
import {
  AVATAR_URL,
  BASE_TILING_URL,
  BOMB_URL,
  ENEMY_URL,
  PILLAR_BOTTOM_TILING_URL,
  PILLAR_MIDDLE_TILING_URL,
  PILLAR_TOP_TILING_URL,
  POTION_URL,
  RANDOM_TILING_URL,
  WIND_URL,
} from "./utils/Constants";
import { TilingObject, TilingsSerialization } from "./layer/MainLayer";

export const ENEMY_ASSET = "enemy";
export const AVATAR_ASSET = "avatar";
export const BACKGROUND_ASSET = "background";
export const WIND_ASSET = "wind";
export const BOMB_ASSET = "bomb";
export const POTION_ASSET = "potion";
export const BASE_TILING_ASSET = "base_tiling";
export const RANDOM_TILING_ASSET = "random_tiling";
export const PILLAR_TOP_TILING_ASSET = "pillar_top_tiling";
export const PILLAR_MIDDLE_TILING_ASSET = "pillar_middle_tiling";
export const PILLAR_BOTTOM_TILING_ASSET = "pillar_bottom_tiling";

export interface SetupResponse {
  assets: AssetsResponse;
  tilings: TilingsSerialization;
}

export interface AssetsResponse {
  background_tile_url: string;
  enemy_url: string;
  avatar_url: string;
  wind_url: string;
  bomb_url: string;
  potion_url: string;
  base_tiling_url: string;
  random_tiling_url: string;
  pillar_top_tiling_url: string;
  pillar_middle_tiling_url: string;
  pillar_bottom_tiling_url: string;
}

export class ResourceLoader {
  private static instance: ResourceLoader;
  private loader = new PIXI.Loader();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private resources: Record<string, any> | undefined;

  public static async genInstance(
    assetsResponse: AssetsResponse | null = null
  ): Promise<ResourceLoader> {
    if (!ResourceLoader.instance) {
      ResourceLoader.instance = new ResourceLoader();
      await LoadingView.genInstance();
      PIXI.Assets.add({
        alias: ENEMY_ASSET,
        src: assetsResponse?.enemy_url ?? ENEMY_URL,
      });
      PIXI.Assets.add({
        alias: AVATAR_ASSET,
        src: assetsResponse?.avatar_url ?? AVATAR_URL,
      });
      PIXI.Assets.add({
        alias: BACKGROUND_ASSET,
        src: assetsResponse?.background_tile_url ?? BASE_TILING_URL,
      });
      PIXI.Assets.add({
        alias: WIND_ASSET,
        src: assetsResponse?.wind_url ?? WIND_URL,
      });
      PIXI.Assets.add({
        alias: BOMB_ASSET,
        src: assetsResponse?.bomb_url ?? BOMB_URL,
      });
      PIXI.Assets.add({
        alias: POTION_ASSET,
        src: assetsResponse?.potion_url ?? POTION_URL,
      });
      PIXI.Assets.add({
        alias: BASE_TILING_ASSET,
        src: assetsResponse?.base_tiling_url ?? BASE_TILING_URL,
      });
      PIXI.Assets.add({
        alias: RANDOM_TILING_ASSET,
        src: assetsResponse?.random_tiling_url ?? RANDOM_TILING_URL,
      });
      PIXI.Assets.add({
        alias: PILLAR_TOP_TILING_ASSET,
        src: assetsResponse?.pillar_top_tiling_url ?? PILLAR_TOP_TILING_URL,
      });
      PIXI.Assets.add({
        alias: PILLAR_MIDDLE_TILING_ASSET,
        src:
          assetsResponse?.pillar_middle_tiling_url ?? PILLAR_MIDDLE_TILING_URL,
      });
      PIXI.Assets.add({
        alias: PILLAR_BOTTOM_TILING_ASSET,
        src:
          assetsResponse?.pillar_bottom_tiling_url ?? PILLAR_BOTTOM_TILING_URL,
      });

      ResourceLoader.instance.resources = await PIXI.Assets.load([
        ENEMY_ASSET,
        AVATAR_ASSET,
        BACKGROUND_ASSET,
        WIND_ASSET,
        BOMB_ASSET,
        BASE_TILING_ASSET,
        RANDOM_TILING_ASSET,
        PILLAR_TOP_TILING_ASSET,
        PILLAR_MIDDLE_TILING_ASSET,
        PILLAR_BOTTOM_TILING_ASSET,
      ]);
    }
    return ResourceLoader.instance;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getResource(name: string): any | undefined {
    return this.resources ? this.resources[name] : undefined;
  }
}
