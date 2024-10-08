import * as PIXI from "pixi.js";
import { Enemy } from "../Enemy";
import { Helper } from "../../utils/Helper";

const SPEED = 5;
export class Bullet {
  instance: PIXI.Graphics;
  speed: number;
  direction: { x: number; y: number };
  isExploded: boolean;
  constructor(x: number, y: number, targetX: number, targetY: number) {
    this.instance = new PIXI.Graphics();
    this.instance.beginFill(0xff0000); // Red color for the attack circle
    this.instance.drawCircle(0, 0, 10); // Radius of 10
    this.instance.endFill();
    this.instance.x = x;
    this.instance.y = y;
    this.speed = SPEED;

    this.direction = Helper.calculateDirection(x, y, targetX, targetY, 16);
    this.isExploded = false;
  }

  move() {
    this.instance.x += this.direction.x * this.speed;
    this.instance.y += this.direction.y * this.speed;
  }

  checkCollision(enemies: Map<string, Enemy>) {
    enemies.forEach((enemy) => {
      if (
        Helper.boundsIntersect(
          this.instance.getBounds(),
          enemy.sprite.getBounds()
        )
      ) {
        this.explode();
      }
    });
  }

  explode() {
    // Explosion logic
    this.isExploded = true;
    const explosion = new PIXI.Graphics();
    explosion.beginFill(0xffff00); // Yellow color for explosion
    explosion.drawCircle(0, 0, 30); // Explosion radius
    explosion.endFill();
    explosion.x = this.instance.x;
    explosion.y = this.instance.y;

    setTimeout(() => {
      explosion.destroy();
    }, 500); // Explosion effect duration

    this.instance.parent.addChild(explosion);
    this.instance.destroy();
  }
}
