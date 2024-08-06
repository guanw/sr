import * as PIXI from "pixi.js";
import { MainLayer } from "../../layer/MainLayer";
import { Entity } from "../Entity";

export abstract class Item extends Entity {
    async genUponCollide(): Promise<void> {
        const mainLayer = await MainLayer.genInstance();
        this.destroy(mainLayer.layer);
    }

    protected abstract destroy(layer: PIXI.Container): void;
}