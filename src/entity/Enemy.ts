import * as PIXI from "pixi.js";
import { Entity } from "./Entity";
import {
  ENEMY_ANIMATION_SPEED,
  ENEMY_FRAME_NUMBER,
  ENEMY_FRAME_SIZE,
  ENEMY_SPEED,
  GAME_HEIGHT,
  GAME_WIDTH,
} from "../utils/Constants";
import { Avatar, avatarMetaData } from "./Avatar";

class Enemy extends Entity {
  sprite: PIXI.AnimatedSprite;
  private constructor(
    app: PIXI.Application,
    layer: PIXI.Container,
    frames: PIXI.Texture[]
  ) {
    super();

    this.sprite = new PIXI.AnimatedSprite(frames);
    this.sprite.animationSpeed = ENEMY_ANIMATION_SPEED;
    this.sprite.play();
    this.sprite.x = Math.random() * GAME_WIDTH - GAME_WIDTH / 2;
    this.sprite.y = Math.random() * GAME_HEIGHT - GAME_HEIGHT / 2;
    layer.addChild(this.sprite);
  }

  static async create(app: PIXI.Application, layer: PIXI.Container) {
    const texture = await PIXI.Assets.load(
      "https://guanw.github.io/sr_assets/slime_run.png"
    );
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
    return new Enemy(app, layer, frames);
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
