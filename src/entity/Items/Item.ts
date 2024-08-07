import * as PIXI from "pixi.js";
import { MainLayer } from "../../layer/MainLayer";
import { Entity } from "../Entity";
import { GAME_WIDTH, GAME_HEIGHT, AVATAR_LOCATION } from "../../utils/Constants";

export abstract class Item extends Entity {
    async genUponCollide(): Promise<void> {
        const mainLayer = await MainLayer.genInstance();
        this.destroy(mainLayer.layer);
    }

    placeItem(centerX: number, centerY: number): [number, number] {
        return [centerX - AVATAR_LOCATION.x + Math.random() * GAME_WIDTH,
        (centerY - AVATAR_LOCATION.y) + Math.random() * GAME_HEIGHT];
    }

    protected abstract destroy(layer: PIXI.Container): void;
}