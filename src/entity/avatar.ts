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
  GAME_WIDTH,
  GAME_HEIGHT,
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
  private walkingSprite: PIXI.AnimatedSprite;
  private attackingSprite: PIXI.AnimatedSprite;
  public currentSprite: PIXI.AnimatedSprite;
  private static healthBarContainer = new PIXI.Graphics();
  static healthBar = new PIXI.Graphics();

  private constructor(
    walkingTexture: PIXI.Texture[],
    attackTexture: PIXI.Texture[]
  ) {
    super();
    this.walkingSprite = this.initSprite(walkingTexture);
    this.attackingSprite = this.initSprite(attackTexture);
    this.currentSprite = this.walkingSprite;
    this.renderAvatarHP();
  }

  private initSprite(texture: PIXI.Texture[]) {
    const sprite = new PIXI.AnimatedSprite(texture);
    sprite.anchor.set(0.5);
    sprite.width = 75;
    sprite.height = 75;
    sprite.animationSpeed = AVATAR_ANIMATION_SPEED;
    sprite.play();
    sprite.x = GAME_WIDTH / 2;
    sprite.y = GAME_HEIGHT / 2;
    return sprite;
  }

  public static async genInstance(): Promise<Avatar> {
    if (!Avatar.instance) {
      const texture = await PIXI.Assets.load(AVATAR_URL);
      const walkingFrames = await Avatar.genLoadTexture(texture, 0);
      const attackFrames = await Avatar.genLoadTexture(texture, 6);
      Avatar.instance = new Avatar(walkingFrames, attackFrames);
      await this.genInitializeHPSystem();
      const mainLayer = await MainLayer.genInstance();
      mainLayer.layer.addChild(Avatar.instance.currentSprite);
      mainLayer.layer.addChild(Avatar.healthBarContainer);
    }
    return Avatar.instance;
  }

  private static async genLoadTexture(texture: PIXI.Texture, row: number) {
    const frames = [];
    const frameWidth = AVATAR_FRAME_SIZE;
    const frameHeight = AVATAR_FRAME_SIZE;
    const numberOfFrames = AVATAR_NUM_OF_FRAME;
    for (let i = 0; i < numberOfFrames; i++) {
      const rect = new PIXI.Rectangle(
        i * frameWidth,
        row * frameWidth,
        frameWidth,
        frameHeight
      );
      frames.push(
        new PIXI.Texture({ source: texture.baseTexture, frame: rect })
      );
    }
    return frames;
  }

  getX(): number {
    return this.currentSprite.x;
  }
  getY(): number {
    return this.currentSprite.y;
  }
  setX(x: number): void {
    this.currentSprite.x = x;
  }
  setY(y: number): void {
    this.currentSprite.y = y;
  }
  getDisplacement(): number {
    return AVATAR_SIZE / 2;
  }

  async walk() {
    if (this.currentSprite !== this.walkingSprite) {
      await this.switchSprite(this.walkingSprite);
    }
  }

  async attack() {
    if (this.currentSprite !== this.attackingSprite) {
      await this.switchSprite(this.attackingSprite);

      // Automatically switch back to walking after attack animation finishes
      this.attackingSprite.onComplete = async () => {
        await this.switchSprite(this.walkingSprite);
      };
    }
  }

  private async switchSprite(newSprite: PIXI.AnimatedSprite) {
    const mainLayer = await MainLayer.genInstance();
    mainLayer.layer.removeChild(this.currentSprite);
    this.currentSprite = newSprite;
    mainLayer.layer.addChild(this.currentSprite);
    this.currentSprite.play();
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
    avatarMetaData.hp_system.bar.x = this.currentSprite.x - HP_TEXT_X_OFFSET;
    avatarMetaData.hp_system.bar.y = this.currentSprite.y - HP_TEXT_Y_OFFSET;
  }

  public async genPerformAttack(enemies: Map<string, Enemy>) {
    const instance = await Application.genInstance();
    const mainLayer = await MainLayer.genInstance();
    if (this.currentSprite && this.currentSprite.parent) {
      const sword = new Avatar.Sword(
        instance.app,
        mainLayer.layer,
        this.currentSprite
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
