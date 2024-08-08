import * as PIXI from "pixi.js";
import { Enemy } from "./Enemy";
import { globalState } from "../states/events";
import { Entity } from "./Entity";
import Application from "./Application";
import { MainLayer } from "../layer/MainLayer";
import { Item } from "./Items/Item";
import {
  MAX_HEALTH,
  AVATAR_SIZE,
  ENEMY_ATTACK_VALUE,
  COLLECT_ITEM_RANGE,
  HP_POTION_INCREASE,
  HP_TEXT_X_OFFSET,
  HP_TEXT_Y_OFFSET,
  INITIAL_SWORD_SIZE,
  SWORD_WIDTH,
} from "../utils/Constants";

const avatarMetaData = {
  hp_system: {
    value: MAX_HEALTH,
    bar: new PIXI.Graphics(),
  },
};

export class Avatar extends Entity {
  public static instance: Avatar;
  public sprite: PIXI.Sprite;
  static healthBarContainer = new PIXI.Graphics();
  static healthBar = new PIXI.Graphics();

  private constructor(app: PIXI.Application, texture: PIXI.Texture) {
    super();
    const appWidth: number = app.screen.width;
    const appHeight: number = app.screen.height;
    this.sprite = new PIXI.Sprite(texture);
    this.sprite.anchor.set(0.5);
    this.sprite.x = appWidth / 2;
    this.sprite.y = appHeight / 2;
    app.stage.addChild(this.sprite);
    this.renderAvatarHP();
  }

  public static async genInstance(): Promise<Avatar> {
    if (!Avatar.instance) {
      const instance = await Application.genInstance();
      const asset = await PIXI.Assets.load(
        "https://pixijs.com/assets/bunny.png"
      );
      Avatar.instance = new Avatar(instance.app, asset);
      await this.genInitializeHPSystem();
    }
    return Avatar.instance;
  }

  getX(): number {
    return this.sprite.x;
  }
  getY(): number {
    return this.sprite.y;
  }
  setX(x: number): void {
    this.sprite.x = x;
  }
  setY(y: number): void {
    this.sprite.y = y;
  }
  getDisplacement(): number {
    return AVATAR_SIZE / 2;
  }

  /**
   * collision with enemy
   */
  public async genCheckCollisionWithEnemyAndReduceHealth(
    enemies: Map<string, Enemy>
  ) {
    enemies.forEach(async (_, key) => {
      const enemy = enemies.get(key);
      if (enemy === undefined) {
        return;
      }
      if (enemy.isCollidedWith(this)) {
        await this.genCollide();
      }
    });
  }

  private async genCollide(): Promise<void> {
    const instance = await Application.genInstance();
    const app = instance.app;
    this.updateHealth(avatarMetaData.hp_system.value - ENEMY_ATTACK_VALUE);
    if (avatarMetaData.hp_system.value <= 0) {
      this.updateHealth(0);
      globalState.isGameOver = true;
      const gameOverText = new PIXI.Text("Game Over", {
        fontSize: 48,
        fill: 0xff0000,
        align: "center",
      });
      gameOverText.anchor.set(0.5);
      gameOverText.x = app.screen.width / 2 - app.stage.x;
      gameOverText.y = app.screen.height / 2 - app.stage.y;
      app.stage.addChild(gameOverText);
    }
  }

  public async genCheckCollectingItems(items: Map<string, Item>) {
    items.forEach(async (_, key) => {
      const item = items.get(key);
      if (item === undefined) {
        return;
      }
      if (item.isCollidedWith(this, COLLECT_ITEM_RANGE)) {
        await item.genCollide();
        items.delete(key);
      }
    });
  }

  public static async genInitializeHPSystem() {
    avatarMetaData.hp_system.bar = this.healthBarContainer;
    this.healthBarContainer.beginFill(0xff0000);
    this.healthBarContainer.drawRect(0, 0, 100, 10);
    this.healthBarContainer.endFill();
    this.healthBarContainer.x = 80;
    this.healthBarContainer.y = 110;

    const style = new PIXI.TextStyle({
      fontSize: 12,
    });
    const healthText = new PIXI.Text({
      text: "hp",
      style,
    });
    healthText.x = -20;
    healthText.y = -2;
    this.healthBarContainer.addChild(healthText);

    this.healthBar.beginFill(0x00ff00);
    this.healthBar.drawRect(0, 0, 100, 10);
    this.healthBar.endFill();
    this.healthBarContainer.addChild(this.healthBar);

    const instance = await Application.genInstance();
    // add health bar container
    instance.app.stage.addChild(avatarMetaData.hp_system.bar);
  }

  public increaseHP() {
    this.updateHealth(
      Math.min(100, HP_POTION_INCREASE + avatarMetaData.hp_system.value)
    );
  }

  private updateHealth(newHealth: number) {
    avatarMetaData.hp_system.value = newHealth;
    Avatar.healthBar.width = (avatarMetaData.hp_system.value / 100) * 100;
  }

  private renderAvatarHP() {
    avatarMetaData.hp_system.bar.x = this.sprite.x - HP_TEXT_X_OFFSET;
    avatarMetaData.hp_system.bar.y = this.sprite.y - HP_TEXT_Y_OFFSET;
  }

  public async genPerformAttack(enemies: Map<string, Enemy>) {
    const instance = await Application.genInstance();
    const mainLayer = await MainLayer.genInstance();
    if (this.sprite && this.sprite.parent) {
      const sword = new Avatar.Sword(
        instance.app,
        mainLayer.layer,
        this.sprite
      );

      // Check for collision with enemies
      enemies.forEach((_, key) => {
        const enemy = enemies.get(key);
        if (enemy === undefined) {
          return;
        }

        if (sword.isCollidedWith(enemy)) {
          enemy.destroy(mainLayer.layer);
          enemies.delete(key);
        }
      });
    }
  }

  public getHealth_DEBUG_TOOL_ONLY(): number {
    return avatarMetaData.hp_system.value;
  }

  static Sword = class {
    private app: PIXI.Application;
    private container: PIXI.Container;
    private instance: PIXI.Graphics;
    public constructor(
      app: PIXI.Application,
      container: PIXI.Container,
      avatar: PIXI.Sprite
    ) {
      this.app = app;
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

    isCollidedWith(ent: Entity): boolean {
      const enemyPoint = new PIXI.Point(
        ent.getX() +
          ent.getDisplacement() +
          this.app.stage.x -
          this.getDisplacement(),
        ent.getY() + ent.getDisplacement() + this.app.stage.y
      );
      return this.instance
        .getBounds()
        .containsPoint(enemyPoint.x, enemyPoint.y);
    }
  };
}
