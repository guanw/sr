import * as PIXI from "pixi.js";
import { v4 as uuidv4 } from 'uuid';
import { Avatar } from './avatar';

export interface Item {
    name: string;
}

export class ItemFactory {
    private items: Map<string, Item>;
    private app: PIXI.Application;
    private user: Avatar;
    public constructor(app: PIXI.Application, user: Avatar) {
        this.app = app;
        this.items = new Map<string, Item>();
        this.user = user;
    }

    public addItem() {
        const uuid = uuidv4();
        this.items.set(uuid, new Bomb(this.app, this.user));
    }

    public getItems(): Map<string, Item> {
        return this.items;
    }
}

class Bomb implements Item {
    name = "bomb";
    private instance: PIXI.Graphics;
    constructor(app: PIXI.Application, avatar: Avatar) {
        this.instance = new PIXI.Graphics();
        this.instance.fill(0x002200);
        this.instance.beginFill(0x002200);
        this.instance.drawCircle(0, 0, 10);
        this.instance.endFill();
        this.instance.x = (avatar.getX() - 400) + Math.random() * 800;
        this.instance.y = (avatar.getY() - 300) + Math.random() * 600;
        app.stage.addChild(this.instance);
    }
}