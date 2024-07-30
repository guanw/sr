import * as PIXI from "pixi.js";
import { v4 as uuidv4 } from 'uuid';
import { Avatar } from './avatar';
import { Entity } from './Entity';

export abstract class CollectableItem extends Entity {
    protected app!: PIXI.Application;
    protected instance!: PIXI.Graphics;
    public abstract effectCallback(): void;
    public destroy() {
        this.app.stage.removeChild(this.instance);
    }
}

export class ItemFactory {
    private items: Map<string, CollectableItem>;
    private app: PIXI.Application;
    private user: Avatar;
    public constructor(app: PIXI.Application, user: Avatar) {
        this.app = app;
        this.items = new Map<string, CollectableItem>();
        this.user = user;
    }

    public addItem() {
        const uuid = uuidv4();
        // only add Bomb for now (this needs refactoring as ItemFactory (parent class) should not know what kind of item (child) this is)
        this.items.set(uuid, new Bomb(this.app, this.user, () => {}));
    }

    public getItems(): Map<string, CollectableItem> {
        return this.items;
    }
}

class Bomb extends CollectableItem {
    name = "bomb";
    constructor(app: PIXI.Application, avatar: Avatar, callback: () => void) {
        super();
        this.app = app;
        this.effectCallback = callback;
        this.instance = new PIXI.Graphics();
        this.instance.fill(0x002200);
        this.instance.beginFill(0x002200);
        this.instance.drawCircle(0, 0, 10);
        this.instance.endFill();
        this.instance.x = (avatar.getX() - 400) + Math.random() * 800;
        this.instance.y = (avatar.getY() - 300) + Math.random() * 600;
        this.app.stage.addChild(this.instance);
    }

    getX(): number {
        return this.instance.x;
    }

    getY(): number {
        return this.instance.y;
    }

    public effectCallback(): void {

    }
}