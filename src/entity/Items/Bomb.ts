import * as PIXI from "pixi.js";
import { Item } from "./Item";
import enemiesStateManager from "../../states/EnemyStateManager";
import { ITEM_FRAME_SIZE } from "../../utils/Constants";
import { ENABLE_MULTI_PLAYER } from "../../utils/Knobs";
import { BOMB_ASSET, resourceLoader } from "../../ResourceLoader";

export class Bomb extends Item {
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
    if (!ENABLE_MULTI_PLAYER) {
      [this.sprite.x, this.sprite.y] = this.placeItem(x, y);
    } else {
      this.sprite.x = x;
      this.sprite.y = y;
    }
    layer.addChild(this.sprite);
  }

  static async create(layer: PIXI.Container, x: number, y: number) {
    const texture = resourceLoader.getResource(BOMB_ASSET);
    return new Bomb(layer, x, y, texture);
  }

  getX(): number {
    return this.sprite.x;
  }
  getY(): number {
    return this.sprite.y;
  }
  setDeltaX(deltaX: number): void {
    this.sprite.x += deltaX;
  }
  setDeltaY(deltaY: number): void {
    this.sprite.y += deltaY;
  }
  getDisplacement(): number {
    return ITEM_FRAME_SIZE / 2;
  }

  async genCollideCallback(): Promise<void> {
    enemiesStateManager.destroyAllEnemies();
  }
}
