import * as PIXI from "pixi.js";
import { Enemy } from "./Enemy";
import { Entity } from "./Entity";
import Application from "./Application";
import { MainLayer } from "../layer/MainLayer";
import {
  MAX_HEALTH,
  AVATAR_DISPLACEMENT,
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
import { GameEventManager } from "../states/events/GameStateManager";

export const avatarMetaData = {
  hp_system: {
    value: MAX_HEALTH,
    bar: new PIXI.Graphics(),
  },
  scoring_sytem: {
    value: 0,
  },
};

export class Avatar extends Entity {
  public static instance: Avatar;
  public walkingSprite: PIXI.AnimatedSprite;
  public attackingSprite: PIXI.AnimatedSprite;
  private static healthBarContainer = new PIXI.Graphics();
  static healthBar = new PIXI.Graphics();

  private constructor(
    walkingTexture: PIXI.Texture[],
    attackTexture: PIXI.Texture[]
  ) {
    super();
    this.walkingSprite = this.initSprite(walkingTexture);
    this.attackingSprite = this.initSprite(attackTexture);
    this.attackingSprite.alpha = 0;
    this.walkingSprite.alpha = 1;
    this.renderAvatarHP();
  }

  private initSprite(texture: PIXI.Texture[]) {
    const sprite = new PIXI.AnimatedSprite(texture);
    sprite.anchor.set(0.5);
    sprite.width = AVATAR_FRAME_SIZE;
    sprite.height = AVATAR_FRAME_SIZE;
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
      mainLayer.layer.addChild(Avatar.instance.walkingSprite);
      mainLayer.layer.addChild(Avatar.instance.attackingSprite);
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
    return this.walkingSprite.x;
  }
  getY(): number {
    return this.walkingSprite.y;
  }
  setDeltaX(deltaX: number): void {
    this.walkingSprite.x -= deltaX;
    this.attackingSprite.x -= deltaX;
  }
  setDeltaY(deltaY: number): void {
    this.walkingSprite.y -= deltaY;
    this.attackingSprite.y -= deltaY;
  }
  getDisplacement(): number {
    return AVATAR_DISPLACEMENT;
  }

  async walk() {
    this.walkingSprite.alpha = 1;
    this.attackingSprite.alpha = 0;
  }

  async attack() {
    this.walkingSprite.alpha = 0;
    this.attackingSprite.alpha = 1;

    // Automatically switch back to walking after attack animation finishes
    this.attackingSprite.onLoop = async () => {
      this.walkingSprite.alpha += 0.5;
      this.walkingSprite.alpha = Math.max(this.walkingSprite.alpha, 1);
      this.attackingSprite.alpha -= 0.5;
      this.attackingSprite.alpha = Math.min(this.attackingSprite.alpha, 0);
    };
  }

  public async genCollide(): Promise<void> {
    const gameEventManager = GameEventManager.getInstance();
    this.updateHealth(avatarMetaData.hp_system.value - ENEMY_ATTACK_VALUE);
    if (avatarMetaData.hp_system.value <= 0) {
      gameEventManager.emit(new GameOverEvent());
    }
  }

  public getBounds(): PIXI.Bounds {
    return this.walkingSprite.getBounds();
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
    avatarMetaData.hp_system.bar.x = this.walkingSprite.x - HP_TEXT_X_OFFSET;
    avatarMetaData.hp_system.bar.y = this.walkingSprite.y - HP_TEXT_Y_OFFSET;
  }

  public async genPerformAttack(enemies: Map<string, Enemy>) {
    const instance = await Application.genInstance();
    const mainLayer = await MainLayer.genInstance();
    if (this.walkingSprite && this.walkingSprite.parent) {
      const sword = new Avatar.Sword(
        instance.app,
        mainLayer.layer,
        this.walkingSprite
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
