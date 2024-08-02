import * as PIXI from 'pixi.js';

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
            width: 800,
            height: 600,
          });
        document.body.appendChild(Application.instance.app.canvas);
    }
    return Application.instance;
  }
}

export default Application;