import { AVATAR_SPEED } from "../utils/Constants";

const ENTITY_COLLIDE_RANGE = 5;
export abstract class Entity {
  public abstract getDisplacement(): number;
  public abstract getX(): number;
  public abstract getY(): number;
  public abstract setDeltaX(x: number): void;
  public abstract setDeltaY(y: number): void;

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
  isCollidedWith(ent: Entity, range = ENTITY_COLLIDE_RANGE): boolean {
    const displacement = this.getDisplacement() / 2;
    const currentX = this.getX() + displacement;
    const currentY = this.getY() + displacement;

    const ent_displacement = ent.getDisplacement() / 2;
    const otherX = ent.getX() + ent_displacement;
    const otherY = ent.getY() + ent_displacement;
    const distance = Math.sqrt(
      (currentX - otherX) ** 2 + (currentY - otherY) ** 2
    );
    return distance <= range;
  }
}
