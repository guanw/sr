import * as PIXI from "pixi.js";
import { Entity } from "../Entity";
import { TILING_LAYER, TILING_SIZE } from "../../utils/Constants";

export class Tile extends Entity {
  sprite: PIXI.Sprite;

  constructor(
    layer: PIXI.Container,
    x: number,
    y: number,
    texture: PIXI.Texture
  ) {
    super();
    this.sprite = new PIXI.Sprite(texture);
    this.sprite.width = TILING_SIZE;
    this.sprite.height = TILING_SIZE;
    this.sprite.x = x;
    this.sprite.y = y;
    layer.addChildAt(this.sprite, TILING_LAYER);
  }

  setDeltaX(deltaX: number): void {
    this.sprite.x += deltaX;
  }
  setDeltaY(deltaY: number): void {
    this.sprite.y += deltaY;
  }
  getX(): number {
    return this.sprite.x;
  }
  getY(): number {
    return this.sprite.y;
  }
  getDisplacement(): number {
    return TILING_SIZE / 2;
  }

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
}
