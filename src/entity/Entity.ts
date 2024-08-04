// Entity.ts

import * as PIXI from "pixi.js";
import { AVATAR_SPEED } from '../utils/Constants';
import { MainLayer } from "../layer/MainLayer";

const ENTITY_COLLIDE_RANGE = 5;
export abstract class Entity {
    protected instance!: PIXI.Graphics;
    abstract getX(): number;
    abstract getY(): number;
    public moveLeft() {
        this.instance.x -= AVATAR_SPEED;
    }
    public moveRight() {
        this.instance.x += AVATAR_SPEED;
    }
    public moveDown() {
        this.instance.y -= AVATAR_SPEED;
    }
    public moveUp() {
        this.instance.y += AVATAR_SPEED;
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

    public destroy(layer: PIXI.Container) {
        layer.removeChild(this.instance);
    }
}