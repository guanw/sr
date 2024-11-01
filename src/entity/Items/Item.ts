import * as PIXI from "pixi.js";
import { MainLayer } from "../../layer/MainLayer";
import { Entity } from "../Entity";
import { GAME_WINDOW_SIZE, AVATAR_LOCATION } from "../../utils/Constants";

export abstract class Item extends Entity {
  sprite!: PIXI.Sprite;

  public get width(): number {
    return this.sprite.width;
  }
  public get height(): number {
    return this.sprite.height;
  }
  public setPos(x: number, y: number) {
    this.sprite.x = x;
    this.sprite.y = y;
  }
  placeItem(centerX: number, centerY: number): [number, number] {
    return [
      centerX - AVATAR_LOCATION.x + Math.random() * GAME_WINDOW_SIZE,
      centerY - AVATAR_LOCATION.y + Math.random() * GAME_WINDOW_SIZE,
    ];
  }

  async genCollide(): Promise<void> {
    const mainLayer = await MainLayer.genInstance();
    this.destroy(mainLayer.layer);
    await this.genCollideCallback();
  }
  async genCollideCallback(): Promise<void> {}

  public destroy(layer: PIXI.Container) {
    layer.removeChild(this.sprite);
  }
}
