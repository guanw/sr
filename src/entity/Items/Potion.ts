import * as PIXI from "pixi.js";
import { Item } from "./Item";
import { Avatar } from "../Avatar";
import { MainLayer } from "../../layer/MainLayer";
import { ITEM_FRAME_SIZE, POTION_URL } from "../../utils/Constants";

export class Potion extends Item {

    constructor(layer: PIXI.Container, avatar: Avatar, texture: PIXI.Texture) {
        super();
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.width = ITEM_FRAME_SIZE;
        this.sprite.height = ITEM_FRAME_SIZE;
        [this.sprite.x, this.sprite.y] = this.placeItem(avatar.getX(), avatar.getY())
        layer.addChild(this.sprite);
    }

    static async create(layer: PIXI.Container, avatar: Avatar) {
        const texture = await PIXI.Assets.load(POTION_URL);
        return new Potion(layer, avatar, texture);
    }

    setX(x: number): void {
        this.sprite.x = x;
    }
    setY(y: number): void {
        this.sprite.y = y;
    }
    getX(): number {
        return this.sprite.x;
    }
    getY(): number {
        return this.sprite.y;
    }
    getDisplacement(): number {
        return ITEM_FRAME_SIZE/2;
    }

    async genCollideCallback(): Promise<void> {
        const user = await Avatar.genInstance();
        user.increaseHP();
    }
}