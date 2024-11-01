import * as PIXI from "pixi.js";
import { Enemy } from "./Enemy";
import { Entity } from "./Entity";
import { MainLayer } from "../layer/MainLayer";
import {
  MAX_HEALTH,
  AVATAR_DISPLACEMENT,
  HP_POTION_INCREASE,
  HP_TEXT_X_OFFSET,
  HP_TEXT_Y_OFFSET,
  AVATAR_FRAME_SIZE,
  AVATAR_NUM_OF_FRAME,
  AVATAR_ANIMATION_SPEED,
  GAME_WINDOW_SIZE,
  AVATAR_SIZE,
} from "../utils/Constants";
import { GameOverEvent } from "../states/events/GameEvent";
import { GameEventManager } from "../states/events/GameStateManager";
import { Sword } from "./Attacks/Sword";
import { AVATAR_ASSET, ResourceLoader } from "../ResourceLoader";
import avatarsStateManager from "../states/AvatarsStateManager";

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
  public attackingSprite: PIXI.AnimatedSprite | undefined;
  private static healthBarContainer = new PIXI.Graphics();
  static healthBar = new PIXI.Graphics();

  private constructor(
    isMainAvatar: boolean,
    walkingTexture: PIXI.Texture[],
    attackTexture: PIXI.Texture[] = []
  ) {
    super();

    if (isMainAvatar) {
      this.walkingSprite = this.initSprite(walkingTexture);
      this.attackingSprite = this.initSprite(attackTexture);
      this.attackingSprite.alpha = 0;
      this.walkingSprite.alpha = 1;
      this.renderAvatarHP();
    } else {
      this.walkingSprite = this.initSprite(walkingTexture);
      this.walkingSprite.alpha = 1;
    }
  }

  static async create(layer: PIXI.Container, x: number, y: number) {
    const resourceLoader = await ResourceLoader.genInstance();
    const texture = resourceLoader.getResource(AVATAR_ASSET);
    const walkingFrames = await Avatar.genLoadTexture(texture, 0);
    const avatar = new Avatar(false, walkingFrames, []);
    avatar.walkingSprite.x = x;
    avatar.walkingSprite.y = y;
    layer.addChild(avatar.walkingSprite);
    return avatar;
  }

  private initSprite(texture: PIXI.Texture[]) {
    const sprite = new PIXI.AnimatedSprite(texture);
    sprite.anchor.set(0.5);
    sprite.width = AVATAR_SIZE;
    sprite.height = AVATAR_SIZE;
    sprite.animationSpeed = AVATAR_ANIMATION_SPEED;
    sprite.play();
    sprite.x = GAME_WINDOW_SIZE / 2;
    sprite.y = GAME_WINDOW_SIZE / 2;
    return sprite;
  }

  public static async genInstance(): Promise<Avatar> {
    if (!Avatar.instance) {
      const resourceLoader = await ResourceLoader.genInstance();
      const texture = resourceLoader.getResource(AVATAR_ASSET);
      const walkingFrames = await Avatar.genLoadTexture(texture, 0);
      const attackFrames = await Avatar.genLoadTexture(texture, 6);
      Avatar.instance = new Avatar(true, walkingFrames, attackFrames);
      await this.genInitializeHPSystem();
      const mainLayer = await MainLayer.genInstance();
      mainLayer.layer.addChild(Avatar.instance.walkingSprite);
      if (Avatar.instance.attackingSprite) {
        mainLayer.layer.addChild(Avatar.instance.attackingSprite);
      }
      mainLayer.layer.addChild(Avatar.healthBarContainer);
    }
    return Avatar.instance;
  }

  private static async genLoadTexture(texture: PIXI.Texture, row: number) {
    const frames = [];
    for (let i = 0; i < AVATAR_NUM_OF_FRAME; i++) {
      const rect = new PIXI.Rectangle(
        i * AVATAR_FRAME_SIZE,
        row * AVATAR_FRAME_SIZE,
        AVATAR_FRAME_SIZE,
        AVATAR_FRAME_SIZE
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
  public setPos(x: number, y: number) {
    this.walkingSprite.x = x;
    this.walkingSprite.y = y;
  }
  setDeltaX(deltaX: number): void {
    this.walkingSprite.x -= deltaX;
    this.attackingSprite!.x -= deltaX;
  }
  setDeltaY(deltaY: number): void {
    this.walkingSprite.y -= deltaY;
    this.attackingSprite!.y -= deltaY;
  }
  getDisplacement(): number {
    return AVATAR_DISPLACEMENT;
  }
  public get width(): number {
    return this.walkingSprite.width;
  }
  public get height(): number {
    return this.walkingSprite.width;
  }

  async walk() {
    this.walkingSprite.alpha = 1;
    this.attackingSprite!.alpha = 0;
  }

  async attack() {
    this.walkingSprite.alpha = 0;
    this.attackingSprite!.alpha = 1;

    // Automatically switch back to walking after attack animation finishes
    this.attackingSprite!.onLoop = async () => {
      this.walkingSprite.alpha += 0.5;
      this.walkingSprite.alpha = Math.max(this.walkingSprite.alpha, 1);
      this.attackingSprite!.alpha -= 0.5;
      this.attackingSprite!.alpha = Math.min(this.attackingSprite!.alpha, 0);
    };
  }

  public destroy(layer: PIXI.Container) {
    layer.removeChild(this.walkingSprite);
    if (this.attackingSprite) {
      layer.removeChild(this.attackingSprite);
    }
  }

  public async genCollide(enemyAttackPower: number): Promise<void> {
    this.updateHealth(avatarMetaData.hp_system.value - enemyAttackPower);
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
    const gameEventManager = GameEventManager.getInstance();
    if (avatarMetaData.hp_system.value <= 0) {
      gameEventManager.emit(new GameOverEvent());
    }
  }

  private renderAvatarHP() {
    avatarMetaData.hp_system.bar.x = this.walkingSprite.x - HP_TEXT_X_OFFSET;
    avatarMetaData.hp_system.bar.y = this.walkingSprite.y - HP_TEXT_Y_OFFSET;
  }

  public async genPerformAttack(enemies: Map<string, Enemy>) {
    const mainLayer = await MainLayer.genInstance();
    if (this.walkingSprite && this.walkingSprite.parent) {
      const sword = new Sword(mainLayer.layer, this.walkingSprite);

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
}
