
const ENTITY_COLLIDE_RANGE = 3;
export abstract class Entity {
    abstract getX(): number;
    abstract getY(): number;
    collide(ent: Entity, range=ENTITY_COLLIDE_RANGE): boolean {
        const currentX = this.getX();
        const currentY = this.getY();
        const otherX = ent.getX();
        const otherY = ent.getY();
        const distance = Math.sqrt((currentX - otherX) ** 2 + (currentY - otherY) ** 2);
        return distance <= range;
    }
}