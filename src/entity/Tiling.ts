import * as PIXI from "pixi.js";
import Application from "./Application";
import { Entity } from "./Entity";

export class Tiling extends Entity {
    public instance: PIXI.TilingSprite;
    private constructor(app: PIXI.Application, texture: PIXI.Texture) {
        super();
        this.instance = new PIXI.TilingSprite({
            texture,
            width: app.screen.width,
            height: app.screen.height,
        });
        app.stage.addChild(this.instance);
    }

    public static async create() {
        const instance = await Application.genInstance();
        const texture = await PIXI.Assets.load('https://pixijs.com/assets/p2.jpeg');
        return new Tiling(instance.app, texture);
    }

    getX(): number {
        return this.instance.tilePosition.x;
    }
    getY(): number {
        return this.instance.tilePosition.y;
    }
    setX(x: number): void {
        this.instance.tilePosition.x = x;
    }
    setY(y: number): void {
        this.instance.tilePosition.y = y;
    }
    protected destroy(layer: PIXI.Container<PIXI.ContainerChild>): void {
        // no-op
    }
}