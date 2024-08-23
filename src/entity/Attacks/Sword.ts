import { INITIAL_SWORD_SIZE, SWORD_WIDTH } from "../../utils/Constants";
import * as PIXI from "pixi.js";
import { Helper } from "../../utils/Helper";
import { Enemy } from "../Enemy";

export class Sword {
  private container: PIXI.Container;
  private instance: PIXI.Graphics;
  public constructor(container: PIXI.Container, avatar: PIXI.Sprite) {
    this.container = container;
    this.instance = new PIXI.Graphics();
    this.instance.moveTo(
      avatar.x - INITIAL_SWORD_SIZE / 2,
      avatar.y - INITIAL_SWORD_SIZE / 2
    );
    this.instance.lineTo(
      avatar.x + INITIAL_SWORD_SIZE / 2,
      avatar.y - INITIAL_SWORD_SIZE / 2
    );
    this.instance.lineTo(
      avatar.x + INITIAL_SWORD_SIZE / 2,
      avatar.y + INITIAL_SWORD_SIZE / 2
    );
    this.instance.lineTo(
      avatar.x - INITIAL_SWORD_SIZE / 2,
      avatar.y + INITIAL_SWORD_SIZE / 2
    );
    this.instance.lineTo(
      avatar.x - INITIAL_SWORD_SIZE / 2,
      avatar.y - INITIAL_SWORD_SIZE / 2
    );
    this.instance.stroke({ width: SWORD_WIDTH, color: 0xffd900 });
    this.container.addChild(this.instance);
    // Remove sword after a short delay e.g 200ms
    setTimeout(() => {
      this.container.removeChild(this.instance);
    }, 200);
  }

  getDisplacement(): number {
    return INITIAL_SWORD_SIZE / 2;
  }

  isCollidedWith(enemy: Enemy): boolean {
    const avatarBounds = this.instance.getBounds();
    const enemyBounds = enemy.sprite.getBounds();
    return Helper.boundsIntersect(avatarBounds, enemyBounds);
  }
}
