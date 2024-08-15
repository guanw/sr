import * as PIXI from "pixi.js";
import { Item } from "./Item";
import enemiesStateManager from "../../states/EnemyStateManager";
import { Avatar } from "../Avatar";
import { BOMB_URL, ITEM_FRAME_SIZE } from "../../utils/Constants";

export class Bomb extends Item {
  constructor(layer: PIXI.Container, avatar: Avatar, texture: PIXI.Texture) {
    super();
    this.sprite = new PIXI.Sprite(texture);
    this.sprite.width = ITEM_FRAME_SIZE;
    this.sprite.height = ITEM_FRAME_SIZE;
    [this.sprite.x, this.sprite.y] = this.placeItem(
      avatar.getX(),
      avatar.getY()
    );
    layer.addChild(this.sprite);
  }

  static async create(layer: PIXI.Container, avatar: Avatar) {
    const texture = await PIXI.Assets.load(BOMB_URL);
    return new Bomb(layer, avatar, texture);
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
