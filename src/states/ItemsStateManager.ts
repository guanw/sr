import * as PIXI from "pixi.js";
import { v4 as uuidv4 } from 'uuid';
import { Avatar } from '../entity/Avatar';
import { Bomb } from "../entity/Items/Bomb";
import { Potion } from "../entity/Items/Potion";
import { Item } from "../entity/Items/Item";


class ItemsStateManager {
    private items: Map<string, Item>;
    public constructor() {
        this.items = new Map<string, Item>();
    }

    public async genAddItem(layer: PIXI.Container) {
        const uuid = uuidv4();
        const n = this.getRandomInteger(2);
        const user = await Avatar.genInstance();
        switch(n) {
            case 1:
                this.items.set(uuid, await Bomb.create(layer, user));
                break;
            case 2:
                this.items.set(uuid, await Potion.create(layer, user));
                break;
            default:
        }
    }

    private getRandomInteger(n: number): number {
        return Math.floor(Math.random() * n) + 1;
    }

    public getItems(): Map<string, Item> {
        return this.items;
    }
}

export const itemsStateManager = new ItemsStateManager();