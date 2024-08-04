import * as PIXI from "pixi.js";

export class Helper {
    static boundsIntersect(bounds1: PIXI.Bounds, bounds2: PIXI.Bounds) {
        return bounds1.x < bounds2.x + bounds2.width &&
               bounds1.x + bounds1.width > bounds2.x &&
               bounds1.y < bounds2.y + bounds2.height &&
               bounds1.y + bounds1.height > bounds2.y;
    }
}