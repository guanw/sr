import * as PIXI from 'pixi.js';

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;
export type Position = {
  x: number,
  y: number
};
export const AVATAR_LOCATION: Position = {x:GAME_WIDTH/2, y:GAME_HEIGHT/2};
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
            backgroundColor: 0x1099bb,
            width: GAME_WIDTH,
            height: GAME_HEIGHT,
          });
        document.body.appendChild(Application.instance.app.canvas);
    }
    return Application.instance;
  }
}

export default Application;