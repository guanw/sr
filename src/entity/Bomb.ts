import * as PIXI from "pixi.js";
import { Entity } from "./Entity";
import enemiesStateManager from "../states/EnemyStateManager";
import { Avatar } from "./avatar";
import { MainLayer } from "../layer/MainLayer";

export class Bomb extends Entity {
    name = "bomb";
    constructor(layer: PIXI.Container, avatar: Avatar) {
        super();
        this.instance = new PIXI.Graphics();
        this.instance.fill(0x002200);
        this.instance.beginFill(0x002200);
        this.instance.drawCircle(0, 0, 10);
        this.instance.endFill();
        this.instance.x = (avatar.getX() - 400) + Math.random() * 800;
        this.instance.y = (avatar.getY() - 300) + Math.random() * 600;
        layer.addChild(this.instance);
    }

    getX(): number {
        return this.instance.x;
    }

    getY(): number {
        return this.instance.y;
    }

    async genUponCollide(): Promise<void> {
        const mainLayer = await MainLayer.genInstance();
        this.destroy(mainLayer.layer);
        enemiesStateManager.destroyAllEnemies();
    }
}