import * as PIXI from "pixi.js";
import { Entity } from "./Entity";
import {
  ENEMY_ANIMATION_SPEED,
  ENEMY_ATTACK_VALUE,
  ENEMY_FRAME_NUMBER,
  ENEMY_FRAME_SIZE,
  ENEMY_SPEED,
  GAME_WINDOW_SIZE,
} from "../utils/Constants";
import { Avatar, avatarMetaData } from "./Avatar";
import { ENEMY_ASSET, resourceLoader } from "../ResourceLoader";

class Enemy extends Entity {
  sprite: PIXI.AnimatedSprite;
  public attackPower: number;
  private constructor(
    layer: PIXI.Container,
    frames: PIXI.Texture[],
    // override x,y for enemy initial position, this is used by multi-player feature
    x: number | null = null,
    y: number | null = null
  ) {
    super();

    this.attackPower = Math.ceil(Math.random() * ENEMY_ATTACK_VALUE);
    this.sprite = new PIXI.AnimatedSprite(frames);
    this.sprite.animationSpeed = ENEMY_ANIMATION_SPEED;
    this.sprite.play();
    this.sprite.x =
      x ?? Math.random() * GAME_WINDOW_SIZE - GAME_WINDOW_SIZE / 2;
    this.sprite.y =
      y ?? Math.random() * GAME_WINDOW_SIZE - GAME_WINDOW_SIZE / 2;
    layer.addChild(this.sprite);
  }

  static async create(
    layer: PIXI.Container,
    x: number | null = null,
    y: number | null = null
  ) {
    const texture = resourceLoader.getResource(ENEMY_ASSET);
    const frames = [];
    const frameWidth = ENEMY_FRAME_SIZE;
    const frameHeight = ENEMY_FRAME_SIZE;
    const numberOfFrames = ENEMY_FRAME_NUMBER;
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
    return new Enemy(layer, frames, x, y);
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
    return ENEMY_FRAME_SIZE / 2;
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

  public destroy(layer: PIXI.Container) {
    avatarMetaData.scoring_sytem.value += 1;
    layer.removeChild(this.sprite);
  }

  public async genMoveTowardsAvatar() {
    const user = await Avatar.genInstance();
    const enemyX = this.getX();
    const enemyY = this.getY();
    const dx = user.getX() - user.getDisplacement() - enemyX;
    const dy = user.getY() - user.getDisplacement() - enemyY;
    const angle = Math.atan2(dy, dx);
    const vx = Math.cos(angle) * ENEMY_SPEED;
    const vy = Math.sin(angle) * ENEMY_SPEED;
    this.setPos(enemyX + vx, enemyY + vy);
  }
}

export { Enemy };
