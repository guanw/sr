import * as PIXI from "pixi.js";
import { v4 as uuidv4 } from "uuid";
import { Avatar } from "../entity/Avatar";
import { Bomb } from "../entity/Items/Bomb";
import { Potion } from "../entity/Items/Potion";
import { Item } from "../entity/Items/Item";
import { ItemsSerialization, MainLayer } from "../layer/MainLayer";

class ItemsStateManager {
  private items: Map<string, Item>;
  public constructor() {
    this.items = new Map<string, Item>();
  }

  public async genAddItem(layer: PIXI.Container) {
    const uuid = uuidv4();
    const n = this.getRandomInteger(2);
    const user = await Avatar.genInstance();
    switch (n) {
      case 1:
        this.items.set(
          uuid,
          await Bomb.create(layer, user.getX(), user.getY())
        );
        break;
      case 2:
        this.items.set(
          uuid,
          await Potion.create(layer, user.getX(), user.getY())
        );
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

  public async resetAllItems(items: ItemsSerialization) {
    const mainLayer = await MainLayer.genInstance();
    await this.destroyAllItems();
    for (const key in items) {
      const item = items[key];
      switch (item.type) {
        case "potion":
          Potion.create(mainLayer.layer, item.x, item.y);
          break;
        case "bomb":
          Bomb.create(mainLayer.layer, item.x, item.y);
          break;
        default:
      }
    }
  }

  public async destroyAllItems(): Promise<void> {
    const mainLayer = await MainLayer.genInstance();
    this.items.forEach((item) => {
      item.destroy(mainLayer.layer);
    });
    this.items.clear();
  }
}

export const itemsStateManager = new ItemsStateManager();
