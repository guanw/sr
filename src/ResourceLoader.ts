import * as PIXI from "pixi.js";
import { LoadingView } from "./entity/LoadingView";
import { ENEMY_URL } from "./utils/Constants";

export class ResourceLoader {
  private static instance: ResourceLoader;
  private loader = new PIXI.Loader();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private resources: Record<string, any> | undefined;

  public static async genInstance(): Promise<ResourceLoader> {
    if (!ResourceLoader.instance) {
      ResourceLoader.instance = new ResourceLoader();
      const loadingView = await LoadingView.genInstance();
      setTimeout(async () => {
        ResourceLoader.instance.resources = await PIXI.Assets.load(
          [ENEMY_URL],
          (progress: number) => {
            loadingView.update(progress * 100);
          }
        );
        loadingView.hide();
      }, 2000);
    }
    return ResourceLoader.instance;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getResource(name: string): any | undefined {
    return this.resources ? this.resources[name] : undefined;
  }
}
