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

  public async refreshAllItems(
    items: ItemsSerialization,
    latestAvatarAbsoluteX: number,
    latestAvatarAbsoluteY: number
  ) {
    const mainLayer = await MainLayer.genInstance();
    const avatar = await Avatar.genInstance();
    const previousItemsState = itemsStateManager.getItems();

    // update existing items with new x,y
    previousItemsState.forEach((_, key) => {
      if (items[key] != undefined && previousItemsState.has(key)) {
        const latestItemAbsoluteX = items[key].x;
        const latestItemAbsoluteY = items[key].y;
        const previousItemAbsoluteX = previousItemsState.get(key)!.getX();
        const previousItemAbsoluteY = previousItemsState.get(key)!.getY();

        const previousAvatarAbsoluteX = avatar.getX();
        const previousAvatarAbsoluteY = avatar.getY();

        const relativeX = -(
          latestAvatarAbsoluteX -
          previousAvatarAbsoluteX -
          (latestItemAbsoluteX - previousItemAbsoluteX)
        );
        const relativeY = -(
          latestAvatarAbsoluteY -
          previousAvatarAbsoluteY -
          (latestItemAbsoluteY - previousItemAbsoluteY)
        );
        this.setRelativePos(key, relativeX, relativeY);
      }
    });

    // remove items that's doesn't exist in serialization
    previousItemsState.forEach((_, key) => {
      if (items[key] === undefined) {
        const item = previousItemsState.get(key);
        item?.destroy(mainLayer.layer);
      }
    });

    // add new items from serialization
    Object.keys(items).forEach(async (key) => {
      if (!previousItemsState.has(key)) {
        const { x, y, type } = items[key];
        await this.genAddItemAtPos(key, type, x, y);
      }
    });
  }

  private setRelativePos(
    key: string,
    relativeX: number,
    relativeY: number
  ): void {
    const item = this.items.get(key);
    item?.setPos(item.getX() + relativeX, item.getY() + relativeY);
  }

  private async genAddItemAtPos(
    key: string,
    type: string,
    x: number,
    y: number
  ) {
    const mainLayer = await MainLayer.genInstance();
    switch (type) {
      case "bomb":
        this.items.set(key, await Bomb.create(mainLayer.layer, x, y));
        break;
      case "potion":
        this.items.set(key, await Potion.create(mainLayer.layer, x, y));
        break;
    }
  }
}

export const itemsStateManager = new ItemsStateManager();
