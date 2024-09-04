import * as PIXI from "pixi.js";
import { LoadingView } from "./entity/LoadingView";
import { AVATAR_URL, ENEMY_URL } from "./utils/Constants";

export const ENEMY_ASSET = "enemy";
export const AVATAR_ASSET = "avatar";

export class ResourceLoader {
  private static instance: ResourceLoader;
  private loader = new PIXI.Loader();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private resources: Record<string, any> | undefined;

  public static async genInstance(): Promise<ResourceLoader> {
    if (!ResourceLoader.instance) {
      ResourceLoader.instance = new ResourceLoader();
      const loadingView = await LoadingView.genInstance();
      PIXI.Assets.add({ alias: ENEMY_ASSET, src: ENEMY_URL });
      PIXI.Assets.add({ alias: AVATAR_ASSET, src: AVATAR_URL });
      ResourceLoader.instance.resources = await PIXI.Assets.load([
        ENEMY_ASSET,
        AVATAR_ASSET,
      ]);
    }
    return ResourceLoader.instance;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getResource(name: string): any | undefined {
    return this.resources ? this.resources[name] : undefined;
  }
}
