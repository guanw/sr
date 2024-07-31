// Items.ts

import * as PIXI from "pixi.js";
import { v4 as uuidv4 } from 'uuid';
import { Avatar } from './entity/avatar';
import { Entity } from './entity/Entity';
import enemiesStateManager from './states/EnemyStateManager';


export class ItemFactory {
    private items: Map<string, Entity>;
    private app: PIXI.Application;
    private user: Avatar;
    public constructor(app: PIXI.Application, user: Avatar) {
        this.app = app;
        this.items = new Map<string, Entity>();
        this.user = user;
    }

    public addItem() {
        const uuid = uuidv4();
        // only add Bomb for now (this needs refactoring as ItemFactory (parent class) should not know what kind of item (child) this is)
        this.items.set(uuid, new Bomb(this.app, this.user));
    }

    public getItems(): Map<string, Entity> {
        return this.items;
    }
}

export class Bomb extends Entity {
    name = "bomb";
    constructor(app: PIXI.Application, avatar: Avatar) {
        super();
        this.instance = new PIXI.Graphics();
        this.instance.fill(0x002200);
        this.instance.beginFill(0x002200);
        this.instance.drawCircle(0, 0, 10);
        this.instance.endFill();
        this.instance.x = (avatar.getX() - 400) + Math.random() * 800;
        this.instance.y = (avatar.getY() - 300) + Math.random() * 600;
        app.stage.addChild(this.instance);
    }

    getX(): number {
        return this.instance.x;
    }

    getY(): number {
        return this.instance.y;
    }

    uponCollide(app: PIXI.Application): void {
        this.destroy(app);
        enemiesStateManager.destroyAllEnemies(app);
    }
}