// Entity.ts

import * as PIXI from "pixi.js";

const ENTITY_COLLIDE_RANGE = 3;
export abstract class Entity {
    protected instance!: PIXI.Graphics;
    abstract getX(): number;
    abstract getY(): number;

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
    uponCollide(app: PIXI.Application): void {
        this.destroy(app);
    }

    public destroy(app: PIXI.Application) {
        app.stage.removeChild(this.instance);
    }
}