import * as PIXI from "pixi.js";
import {
  FALLBACK_BACKGROUND_COLOR,
  GAME_HEIGHT,
  GAME_WIDTH,
} from "../utils/Constants";

export type Position = {
  x: number;
  y: number;
};
class Application {
  private static instance: Application;
  public app: PIXI.Application;

  private constructor() {
    this.app = new PIXI.Application();
  }

  public static async genInstance(): Promise<Application> {
    if (!Application.instance) {
      Application.instance = new Application();
      await Application.instance.app.init({
        backgroundColor: FALLBACK_BACKGROUND_COLOR,
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
      });
      document.body.appendChild(Application.instance.app.canvas);
    }
    return Application.instance;
  }
}

export default Application;
