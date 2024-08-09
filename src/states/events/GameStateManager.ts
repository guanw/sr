import { Avatar } from "../../entity/Avatar";
import { Tiling } from "../../entity/Tiling";
import { Menu } from "../../menu";
import enemiesStateManager from "../EnemyStateManager";
import { itemsStateManager } from "../ItemsStateManager";
import { avatarKeys, globalState } from "../events";
import { GameEvent, KeyDownEvent, KeyUpEvent } from "./GameEvent";

export class GameEventManager {
  private static instance: GameEventManager;
  private eventQueue: GameEvent[] = [];

  private constructor() {}

  public static getInstance(): GameEventManager {
    if (!GameEventManager.instance) {
      GameEventManager.instance = new GameEventManager();
    }
    return GameEventManager.instance;
  }

  public emit(event: GameEvent) {
    this.eventQueue.push(event);
  }

  public async processEvents() {
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      if (event) {
        await this.handleEvent(event);
      }
    }

    /* TODO start multi-player game genMoveUser should be executed on client side */
    if (globalState.isGamePaused) {
      return;
    }
    await this.genMoveUser();
    /* TODO end multi-player game genMoveUser should be executed on client side */
  }

  private async handleEvent(event: GameEvent) {
    switch (event.type) {
      case "AVATAR_ATTACK_ENEMIES":
        await this.handleAvatarAttackEnemiesEvent();
        break;
      case "KEY_DOWN": {
        const KeyDownEvent = event as KeyDownEvent;
        if (KeyDownEvent.event.key === "m" || KeyDownEvent.event.key === "M") {
          await this.handleToggleMenu();
        }

        if (KeyDownEvent.event.key in avatarKeys) {
          await this.handleAvatarMoveKeyDownEvent(KeyDownEvent.event);
        }

        break;
      }
      case "KEY_UP": {
        const moveKeyUpEvent = event as KeyUpEvent;
        await this.handleAvatarMoveKeyUpEvent(moveKeyUpEvent.event);
        break;
      }
    }
  }

  private async handleAvatarAttackEnemiesEvent() {
    const avatar = await Avatar.genInstance();
    const enemies = enemiesStateManager.getEnemies();
    await avatar.genPerformAttack(enemies);
  }

  private async handleAvatarMoveKeyDownEvent(e: KeyboardEvent) {
    if (e.key in avatarKeys) {
      avatarKeys[e.key] = true;
    }
  }

  private async handleToggleMenu() {
    globalState.isGamePaused = !globalState.isGamePaused;
    const menu = await Menu.genInstance();
    menu.setMenuVisibility(globalState.isGamePaused);
    if (globalState.isGamePaused) {
      menu.genUpdateMenuPosition();
    }
  }

  private async handleAvatarMoveKeyUpEvent(e: KeyboardEvent) {
    if (e.key in avatarKeys) {
      avatarKeys[e.key] = false;
    }
  }

  private async genMoveUser() {
    const background = await Tiling.genInstance();
    const items = itemsStateManager.getItems();
    const enemies = enemiesStateManager.getEnemies();
    // Move user based on key states
    if (avatarKeys.ArrowLeft) {
      background.moveRight();
      items.forEach((item) => {
        item.moveRight();
      });
      enemies.forEach((enemy) => {
        enemy.moveRight();
      });
    }
    if (avatarKeys.ArrowRight) {
      background.moveLeft();
      items.forEach((item) => {
        item.moveLeft();
      });
      enemies.forEach((enemy) => {
        enemy.moveLeft();
      });
    }
    if (avatarKeys.ArrowUp) {
      background.moveDown();
      items.forEach((item) => {
        item.moveDown();
      });
      enemies.forEach((enemy) => {
        enemy.moveDown();
      });
    }
    if (avatarKeys.ArrowDown) {
      background.moveUp();
      items.forEach((item) => {
        item.moveUp();
      });
      enemies.forEach((enemy) => {
        enemy.moveUp();
      });
    }
  }
}
