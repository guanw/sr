import * as PIXI from "pixi.js";
import { AVATAR_SPEED } from '../utils/Constants';

export class Tiling {
    private instance: PIXI.TilingSprite;
    private constructor(app: PIXI.Application, texture: PIXI.Texture) {
        this.instance = new PIXI.TilingSprite({
            texture,
            width: app.screen.width,
            height: app.screen.height,
        });
        app.stage.addChild(this.instance);
    }

    public static async create(app: PIXI.Application) {
        const texture = await PIXI.Assets.load('https://pixijs.com/assets/p2.jpeg');
        return new Tiling(app, texture);
    }

    public moveLeft() {
        this.instance.tilePosition.x -= AVATAR_SPEED;
    }
    public moveRight() {
        this.instance.tilePosition.x += AVATAR_SPEED;
    }
    public moveDown() {
        this.instance.tilePosition.y -= AVATAR_SPEED;
    }
    public moveUp() {
        this.instance.tilePosition.y += AVATAR_SPEED;
    }
}