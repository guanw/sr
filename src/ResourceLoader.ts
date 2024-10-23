import * as PIXI from "pixi.js";
import { LoadingView } from "./entity/LoadingView";
import {
  AVATAR_URL,
  BASE_TILING_URL,
  BOMB_URL,
  ENEMY_URL,
  POTION_URL,
  WIND_URL,
} from "./utils/Constants";

export const ENEMY_ASSET = "enemy";
export const AVATAR_ASSET = "avatar";
export const BACKGROUND_ASSET = "background";
export const WIND_ASSET = "wind";
export const BOMB_ASSET = "bomb";
export const POTION_ASSET = "potion";

export interface SetupResponse {
  background_tile_url: string;
}

export class ResourceLoader {
  private static instance: ResourceLoader;
  private loader = new PIXI.Loader();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private resources: Record<string, any> | undefined;

  public static async genInstance(
    setupResponse: SetupResponse | null = null
  ): Promise<ResourceLoader> {
    if (!ResourceLoader.instance) {
      ResourceLoader.instance = new ResourceLoader();
      await LoadingView.genInstance();
      PIXI.Assets.add({ alias: ENEMY_ASSET, src: ENEMY_URL });
      PIXI.Assets.add({ alias: AVATAR_ASSET, src: AVATAR_URL });
      PIXI.Assets.add({
        alias: BACKGROUND_ASSET,
        src: setupResponse?.background_tile_url ?? BASE_TILING_URL,
      });
      PIXI.Assets.add({ alias: WIND_ASSET, src: WIND_URL });
      PIXI.Assets.add({ alias: BOMB_ASSET, src: BOMB_URL });
      PIXI.Assets.add({ alias: POTION_ASSET, src: POTION_URL });

      ResourceLoader.instance.resources = await PIXI.Assets.load([
        ENEMY_ASSET,
        AVATAR_ASSET,
        BACKGROUND_ASSET,
        WIND_ASSET,
        BOMB_ASSET,
      ]);
    }
    return ResourceLoader.instance;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getResource(name: string): any | undefined {
    return this.resources ? this.resources[name] : undefined;
  }
}
