import * as PIXI from "pixi.js";

export type Direction = "left" | "right" | "up" | "down";
export class Helper {
  static boundsIntersect(bounds1: PIXI.Bounds, bounds2: PIXI.Bounds) {
    return (
      bounds1.x < bounds2.x + bounds2.width &&
      bounds1.x + bounds1.width > bounds2.x &&
      bounds1.y < bounds2.y + bounds2.height &&
      bounds1.y + bounds1.height > bounds2.y
    );
  }

  static DirectedboundsIntersect(
    bounds1: PIXI.Bounds,
    bounds2: PIXI.Bounds,
    direction: Direction
  ) {
    // Calculate the overlap in the X and Y axes
    const xOverlap =
      bounds1.x < bounds2.x + bounds2.width &&
      bounds1.x + bounds1.width > bounds2.x;
    const yOverlap =
      bounds1.y < bounds2.y + bounds2.height &&
      bounds1.y + bounds1.height > bounds2.y;

    // Add direction-based checks
    switch (direction) {
      case "left":
        // Check collision only when moving left
        return xOverlap && bounds1.x > bounds2.x && yOverlap;
      case "right":
        // Check collision only when moving right
        return xOverlap && bounds1.x < bounds2.x && yOverlap;
      case "up":
        // Check collision only when moving up
        return yOverlap && bounds1.y > bounds2.y && xOverlap;
      case "down":
        // Check collision only when moving down
        return yOverlap && bounds1.y < bounds2.y && xOverlap;
      default:
        return false;
    }
  }

  static isValidObject(object: PIXI.AnimatedSprite) {
    return object && object.getBounds && object.getBounds();
  }

  static calculateDirection(
    x: number,
    y: number,
    targetX: number,
    targetY: number,
    displacement: number
  ) {
    const dx = targetX - x - displacement;
    const dy = targetY - y - displacement;
    const length = Math.sqrt(dx * dx + dy * dy);
    return { x: dx / length, y: dy / length };
  }
}
