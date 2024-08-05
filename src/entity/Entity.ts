import * as PIXI from "pixi.js";
import { MainLayer } from '../layer/MainLayer';
import { AVATAR_SPEED } from '../utils/Constants';

const ENTITY_COLLIDE_RANGE = 5;
export abstract class Entity {

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
        const currentX = this.getX();
        const currentY = this.getY();
        const otherX = ent.getX();
        const otherY = ent.getY();
        const distance = Math.sqrt((currentX - otherX) ** 2 + (currentY - otherY) ** 2);
        return distance <= range;
    }

    // override this function for special effect
    async genUponCollide(): Promise<void> {
        const mainLayer = await MainLayer.genInstance();
        this.destroy(mainLayer.layer);
    }

    protected abstract destroy(layer: PIXI.Container): void;
}