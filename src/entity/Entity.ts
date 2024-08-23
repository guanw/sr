import { AVATAR_SPEED } from "../utils/Constants";

export abstract class Entity {
  public abstract getDisplacement(): number;
  public abstract getX(): number;
  public abstract getY(): number;
  public abstract setDeltaX(x: number): void;
  public abstract setDeltaY(y: number): void;
  public abstract get width(): number;
  public abstract get height(): number;

  public moveLeft(offset = 1): void {
    this.setDeltaX(-AVATAR_SPEED * offset);
  }

  public moveRight(offset = 1): void {
    this.setDeltaX(AVATAR_SPEED * offset);
  }

  public moveDown(offset = 1): void {
    this.setDeltaY(AVATAR_SPEED * offset);
  }

  public moveUp(offset = 1): void {
    this.setDeltaY(-AVATAR_SPEED * offset);
  }

  // override this for collision detection
  isCollidedWith(ent: Entity): boolean {
    return (
      this.getX() < ent.getX() + ent.width &&
      this.getX() + this.width > ent.getX() &&
      this.getY() < ent.getY() + ent.height &&
      this.getY() + this.height > ent.getY()
    );
  }
}
