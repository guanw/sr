import * as PIXI from "pixi.js";
import { Entity } from "../Entity";
import { Avatar } from "../Avatar";
import { MainLayer } from "../../layer/MainLayer";
import { AVATAR_SPEED, ITEM_FRAME_SIZE } from "../../utils/Constants";

export class Potion extends Entity {
    sprite: PIXI.Sprite;

    constructor(layer: PIXI.Container, avatar: Avatar, texture: PIXI.Texture) {
        super();
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.width = ITEM_FRAME_SIZE;
        this.sprite.height = ITEM_FRAME_SIZE;
        this.sprite.x = (avatar.getX() - 400) + Math.random() * 800;
        this.sprite.y = (avatar.getY() - 300) + Math.random() * 600;
        layer.addChild(this.sprite);
    }

    static async create(layer: PIXI.Container, avatar: Avatar) {
        const texture = await PIXI.Assets.load('https://guanw.github.io/sr_assets/items/Potion01.png');
        return new Potion(layer, avatar, texture);
    }

    public moveLeft() {
        this.sprite.x -= AVATAR_SPEED;
    }
    public moveRight() {
        this.sprite.x += AVATAR_SPEED;
    }
    public moveDown() {
        this.sprite.y -= AVATAR_SPEED;
    }
    public moveUp() {
        this.sprite.y += AVATAR_SPEED;
    }

    getX(): number {
        return this.sprite.x;
    }

    getY(): number {
        return this.sprite.y;
    }

    public destroy(layer: PIXI.Container) {
        layer.removeChild(this.sprite);
    }

    async genUponCollide(): Promise<void> {
        const mainLayer = await MainLayer.genInstance();
        this.destroy(mainLayer.layer);
        const user = await Avatar.genInstance();
        user.increaseHP();
    }
}