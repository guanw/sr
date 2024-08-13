import * as PIXI from "pixi.js";
import { Enemy } from "./Enemy";
import { Entity } from "./Entity";
import Application from "./Application";
import { MainLayer } from "../layer/MainLayer";
import {
  MAX_HEALTH,
  AVATAR_SIZE,
  ENEMY_ATTACK_VALUE,
  HP_POTION_INCREASE,
  HP_TEXT_X_OFFSET,
  HP_TEXT_Y_OFFSET,
  INITIAL_SWORD_SIZE,
  SWORD_WIDTH,
  AVATAR_FRAME_SIZE,
  AVATAR_NUM_OF_FRAME,
  AVATAR_URL,
  AVATAR_ANIMATION_SPEED,
} from "../utils/Constants";
import { GameOverEvent } from "../states/events/GameEvent";

const avatarMetaData = {
  hp_system: {
    value: MAX_HEALTH,
    bar: new PIXI.Graphics(),
  },
};

export class Avatar extends Entity {
  public static instance: Avatar;
  public sprite: PIXI.AnimatedSprite;
  private static healthBarContainer = new PIXI.Graphics();
  static healthBar = new PIXI.Graphics();

  private constructor(app: PIXI.Application, texture: PIXI.Texture[]) {
    super();
    const appWidth: number = app.screen.width;
    const appHeight: number = app.screen.height;
    this.sprite = new PIXI.AnimatedSprite(texture);
    this.sprite.anchor.set(0.5);
    this.sprite.width = 75;
    this.sprite.height = 75;
    this.sprite.animationSpeed = AVATAR_ANIMATION_SPEED;
    this.sprite.play();
    this.sprite.x = appWidth / 2;
    this.sprite.y = appHeight / 2;
    this.renderAvatarHP();
  }

  public static async genInstance(): Promise<Avatar> {
    if (!Avatar.instance) {
      const instance = await Application.genInstance();
      const texture = await PIXI.Assets.load(AVATAR_URL);
      const frames = [];
      const frameWidth = AVATAR_FRAME_SIZE;
      const frameHeight = AVATAR_FRAME_SIZE;
      const numberOfFrames = AVATAR_NUM_OF_FRAME;
      for (let i = 0; i < numberOfFrames; i++) {
        const rect = new PIXI.Rectangle(
          i * frameWidth,
          0,
          frameWidth,
          frameHeight
        );
        frames.push(
          new PIXI.Texture({ source: texture.baseTexture, frame: rect })
        );
      }
      Avatar.instance = new Avatar(instance.app, frames);
      await this.genInitializeHPSystem();
      const mainLayer = await MainLayer.genInstance();
      mainLayer.layer.addChild(Avatar.instance.sprite);
      mainLayer.layer.addChild(Avatar.healthBarContainer);
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

  public async genCollide(): Promise<void> {
    this.updateHealth(avatarMetaData.hp_system.value - ENEMY_ATTACK_VALUE);
    if (avatarMetaData.hp_system.value <= 0) {
      MainLayer.instance.gameEventManager.emit(new GameOverEvent());
    }
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
  }

  public increaseHP() {
    this.updateHealth(
      Math.min(100, HP_POTION_INCREASE + avatarMetaData.hp_system.value)
    );
  }

  public updateHealth(newHealth: number) {
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
