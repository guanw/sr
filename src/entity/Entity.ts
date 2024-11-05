export abstract class Entity {
  public abstract getDisplacement(): number;
  public abstract getX(): number;
  public abstract getY(): number;
  public abstract setDeltaX(x: number): void;
  public abstract setDeltaY(y: number): void;
  public abstract get width(): number;
  public abstract get height(): number;

  public moveLeft(speed: number): void {
    this.setDeltaX(-speed);
  }

  public moveRight(speed: number): void {
    this.setDeltaX(speed);
  }

  public moveDown(speed: number): void {
    this.setDeltaY(speed);
  }

  public moveUp(speed: number): void {
    this.setDeltaY(-speed);
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
