import * as PIXI from "pixi.js";
import { Item } from "./Item";
import { ITEM_FRAME_SIZE } from "../../utils/Constants";
import { Avatar } from "../Avatar";
import { POTION_ASSET, ResourceLoader } from "../../ResourceLoader";

export class Potion extends Item {
  constructor(
    layer: PIXI.Container,
    x: number,
    y: number,
    texture: PIXI.Texture
  ) {
    super();
    this.sprite = new PIXI.Sprite(texture);
    this.sprite.width = ITEM_FRAME_SIZE;
    this.sprite.height = ITEM_FRAME_SIZE;
    [this.sprite.x, this.sprite.y] = this.placeItem(x, y);
    layer.addChild(this.sprite);
  }

  static async create(layer: PIXI.Container, x: number, y: number) {
    const resourceLoader = await ResourceLoader.genInstance();
    const texture = resourceLoader.getResource(POTION_ASSET);
    return new Potion(layer, x, y, texture);
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
    return ITEM_FRAME_SIZE / 2;
  }

  async genCollideCallback(): Promise<void> {
    const user = await Avatar.genInstance();
    user.increaseHP();
  }
}
