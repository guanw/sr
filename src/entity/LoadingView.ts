import * as PIXI from "pixi.js";
import {
  GAME_WINDOW_SIZE,
  LOADING_VIEW_FILL_COLOR,
  LOADING_VIEW_FONT_NAME,
  LOADING_VIEW_FONT_SIZE,
  LOADING_VIEW_TEXT,
} from "../utils/Constants";
import { mainLayer } from "../layer/MainLayer";

export class LoadingView {
  private loadingText: PIXI.Text;
  private loadingBar: PIXI.Graphics;
  private stage: PIXI.Container;

  constructor() {
    this.stage = mainLayer.layer;

    // Create a loading text
    this.loadingText = new PIXI.Text(LOADING_VIEW_TEXT, {
      fontFamily: LOADING_VIEW_FONT_NAME,
      fontSize: LOADING_VIEW_FONT_SIZE,
      fill: LOADING_VIEW_FILL_COLOR,
    });
    this.loadingText.anchor.set(0.5);
    this.loadingText.x = GAME_WINDOW_SIZE / 2;
    this.loadingText.y = GAME_WINDOW_SIZE / 2 - 30;

    this.loadingBar = new PIXI.Graphics();
    this.loadingBar.beginFill(0xffffff);
    this.loadingBar.drawRect(0, 0, 300, 20);
    this.loadingBar.endFill();
    this.loadingBar.x = GAME_WINDOW_SIZE / 2 - 150;
    this.loadingBar.y = GAME_WINDOW_SIZE / 2;

    this.stage.addChild(this.loadingText);
    this.stage.addChild(this.loadingBar);
  }

  public async hide() {
    this.stage.removeChild(this.loadingText);
    this.stage.removeChild(this.loadingBar);
    mainLayer.layer.visible = true;
  }
}

const loadingView = new LoadingView();
export { loadingView };
