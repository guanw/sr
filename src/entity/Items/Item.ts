import * as PIXI from "pixi.js";
import { MainLayer } from "../../layer/MainLayer";
import { Entity } from "../Entity";
import { AVATAR_LOCATION, GAME_HEIGHT, GAME_WIDTH } from "../Application";

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