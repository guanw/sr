import * as PIXI from "pixi.js";
import { GAME_HEIGHT, GAME_WIDTH } from "../utils/Constants";
import { MainLayer } from "../layer/MainLayer";

export class LoadingView {
  private static instance: LoadingView;
  private loadingText: PIXI.Text;
  private loadingBar: PIXI.Graphics;
  private stage: PIXI.Container;

  public static async genInstance(
    stage: PIXI.Container | null = null
  ): Promise<LoadingView> {
    if (!LoadingView.instance && stage != null) {
      LoadingView.instance = new LoadingView(stage);
    }
    return LoadingView.instance;
  }

  private constructor(stage: PIXI.Container) {
    this.stage = stage;

    // Create a loading text
    this.loadingText = new PIXI.Text("Loading...", {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0xffffff,
    });
    this.loadingText.anchor.set(0.5);
    this.loadingText.x = GAME_WIDTH / 2;
    this.loadingText.y = GAME_HEIGHT / 2 - 30;

    // Create a loading bar
    this.loadingBar = new PIXI.Graphics();
    this.loadingBar.beginFill(0xffffff);
    this.loadingBar.drawRect(0, 0, 300, 20);
    this.loadingBar.endFill();
    this.loadingBar.x = GAME_WIDTH / 2 - 150;
    this.loadingBar.y = GAME_HEIGHT / 2;

    // Add elements to the stage
    this.stage.addChild(this.loadingText);
    this.stage.addChild(this.loadingBar);
  }

  public update(progress: number) {
    this.loadingBar.scale.x = progress / 100;
  }

  public async hide() {
    this.stage.removeChild(this.loadingText);
    this.stage.removeChild(this.loadingBar);
    const mainLayer = await MainLayer.genInstance();
    mainLayer.layer.visible = true;
  }
}
