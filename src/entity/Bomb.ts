import * as PIXI from "pixi.js";
import { Entity } from "./Entity";
import enemiesStateManager from "../states/EnemyStateManager";
import { Avatar } from "./avatar";
import { MainLayer } from "../layer/MainLayer";
import { AVATAR_SPEED } from "../utils/Constants";

export class Bomb extends Entity {
    sprite: PIXI.Sprite;

    constructor(layer: PIXI.Container, avatar: Avatar, texture: PIXI.Texture) {
        super();
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.x = (avatar.getX() - 400) + Math.random() * 800;
        this.sprite.y = (avatar.getY() - 300) + Math.random() * 600;
        layer.addChild(this.sprite);
    }

    static async create(layer: PIXI.Container, avatar: Avatar) {
        const texture = await PIXI.Assets.load('https://guanw.github.io/sr_assets/items/Skull.png');
        return new Bomb(layer, avatar, texture);
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
        enemiesStateManager.destroyAllEnemies();
    }
}