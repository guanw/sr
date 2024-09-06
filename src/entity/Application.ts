import * as PIXI from "pixi.js";
import { FALLBACK_BACKGROUND_COLOR, GAME_SIZE } from "../utils/Constants";
import { Avatar } from "./Avatar";

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
        width: GAME_SIZE,
        height: GAME_SIZE,
      });
      document.body.appendChild(Application.instance.app.canvas);
    }
    return Application.instance;
  }

  public async genHandleGameOver() {
    const avatar = await Avatar.genInstance();
    avatar.updateHealth(0);
    const gameOverText = new PIXI.Text("Game Over", {
      fontSize: 48,
      fill: 0xff0000,
      align: "center",
    });
    gameOverText.anchor.set(0.5);
    gameOverText.x = this.app.screen.width / 2 - this.app.stage.x;
    gameOverText.y = this.app.screen.height / 2 - this.app.stage.y;
    this.app.stage.addChild(gameOverText);
  }
}

export default Application;
