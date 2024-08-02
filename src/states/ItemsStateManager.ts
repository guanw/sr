// Items.ts

import { v4 as uuidv4 } from 'uuid';
import { Avatar } from '../entity/avatar';
import { Entity } from '../entity/Entity';
import { Bomb } from "../entity/Bomb";
import Application from "../entity/Application";


class ItemsStateManager {
    private items: Map<string, Entity>;
    public constructor() {
        this.items = new Map<string, Entity>();
    }

    public async genAddItem(user: Avatar) {
        const instance = await Application.getInstance();
        const uuid = uuidv4();
        // only add Bomb for now (this needs refactoring as ItemFactory (parent class) should not know what kind of item (child) this is)
        this.items.set(uuid, new Bomb(instance.app, user));
    }

    public getItems(): Map<string, Entity> {
        return this.items;
    }
}

export const itemsStateManager = new ItemsStateManager();