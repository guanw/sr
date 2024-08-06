import { AVATAR_SPEED } from '../utils/Constants';

const ENTITY_COLLIDE_RANGE = 5;
export abstract class Entity {
    public abstract getDisplacement(): number;
    public abstract getX(): number;
    public abstract getY(): number;
    public abstract setX(x: number): void;
    public abstract setY(y: number): void;

    public moveLeft(): void {
        this.setX(this.getX() - AVATAR_SPEED);
    }

    public moveRight(): void {
        this.setX(this.getX() + AVATAR_SPEED);
    }

    public moveDown(): void {
        this.setY(this.getY() + AVATAR_SPEED);
    }

    public moveUp(): void {
        this.setY(this.getY() - AVATAR_SPEED);
    }

    // override this for collision detection
    isCollidedWith(ent: Entity, range=ENTITY_COLLIDE_RANGE): boolean {
        const displacement = this.getDisplacement() / 2;
        const currentX = this.getX() + displacement;
        const currentY = this.getY() + displacement;

        const ent_displacement = ent.getDisplacement() / 2;
        const otherX = ent.getX() + ent_displacement;
        const otherY = ent.getY() + ent_displacement;
        const distance = Math.sqrt((currentX - otherX) ** 2 + (currentY - otherY) ** 2);
        return distance <= range;
    }
}