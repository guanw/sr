import { Wind } from "../../entity/Attacks/Wind";
import { Avatar } from "../../entity/Avatar";
import { Tiling } from "../../entity/Tiling";
import { DebugTool } from "../../internal/DebugTool";
import { MainLayer } from "../../layer/MainLayer";
import { PlaygroundLayer } from "../../layer/PlaygroundLayer";
import { Menu } from "../../menu";
import {
  AVATAR_LOCATION,
  COLLECT_ITEM_RANGE,
  WIND_DISPLACEMENT,
} from "../../utils/Constants";
import attackStateManager from "../AttackStateManager";
import enemiesStateManager from "../EnemyStateManager";
import { itemsStateManager } from "../ItemsStateManager";
import { avatarKeys, globalState } from "../events";
import {
  AvatarInitiateAttackEvent,
  GameEvent,
  KeyDownEvent,
  KeyUpEvent,
} from "./GameEvent";

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
        const keyDownEvent = event as KeyDownEvent;
        const key = keyDownEvent.event.key;
        if (key === "m" || key === "M") {
          await this.handleToggleMenu();
        }

        if (key === "d" || key === "D") {
          await this.handleToggleDebugTool();
        }

        if (key in avatarKeys) {
          await this.handleAvatarMoveKeyDownEvent(keyDownEvent.event);
        }

        if (key === "p" || key === "P") {
          globalState.isPlaygroundActive = !globalState.isPlaygroundActive;
          const mainLayer = await MainLayer.genInstance();
          const playgroundLayer = await PlaygroundLayer.genInstance();
          mainLayer.layer.visible = !globalState.isPlaygroundActive;
          playgroundLayer.layer.visible = globalState.isPlaygroundActive;
        }
        break;
      }
      case "KEY_UP": {
        const moveKeyUpEvent = event as KeyUpEvent;
        await this.handleAvatarMoveKeyUpEvent(moveKeyUpEvent.event);
        break;
      }
      case "GENERATE_NEW_ENEMY": {
        await this.handleGenerateNewEnemy();
        break;
      }
      case "ENEMIES_ATTACK_AVATAR": {
        await this.handleEnemiesAttackAvatar();
        break;
      }
      case "GENERATE_NEW_ITEM": {
        await this.handleGenerateNewItem();
        break;
      }
      case "COLLECT_ITEM": {
        await this.handleCollectItem();
        break;
      }
      case "GAME_OVER": {
        await this.handleGameOver();
        break;
      }
      case "ENEMIES_MOVE_TOWARDS_AVATAR": {
        await this.handleEnemiesMoveTowardsAvatar();
        break;
      }
      case "UPDATE_ATTACKS": {
        await this.handleUpdateAttacks();
        break;
      }
      case "REFRESH_DEBUG_TOOL": {
        await this.handleRefreshDebugTool();
        break;
      }
      case "AVATAR_INITIATE_ATTACK": {
        const attackEvent = event as AvatarInitiateAttackEvent;
        await this.handleAvatarInitiateAttack(attackEvent.event);
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

  private async handleToggleDebugTool() {
    const debugTool = await DebugTool.genInstance();
    debugTool.toggle();
  }
  private async handleRefreshDebugTool() {
    if (!globalState.isDebugToolVisible) {
      return;
    }
    const debugTool = await DebugTool.genInstance();
    await debugTool.genUpdate();
  }

  private async handleAvatarMoveKeyUpEvent(e: KeyboardEvent) {
    if (e.key in avatarKeys) {
      avatarKeys[e.key] = false;
    }
  }

  private async handleGenerateNewEnemy() {
    await enemiesStateManager.genAddEnemy();
  }

  private async handleEnemiesAttackAvatar() {
    const enemies = enemiesStateManager.getEnemies();
    const user: Avatar = await Avatar.genInstance();
    enemies.forEach(async (_, key) => {
      const enemy = enemies.get(key);
      if (enemy === undefined) {
        return;
      }
      if (enemy.isCollidedWith(user)) {
        await user.genCollide();
      }
    });
  }

  private async handleGenerateNewItem() {
    await itemsStateManager.genAddItem(MainLayer.instance.layer);
  }

  private async handleCollectItem() {
    const items = itemsStateManager.getItems();
    const user: Avatar = await Avatar.genInstance();
    items.forEach(async (_, key) => {
      const item = items.get(key);
      if (item === undefined) {
        return;
      }
      if (item.isCollidedWith(user, COLLECT_ITEM_RANGE)) {
        await item.genCollide();
        items.delete(key);
      }
    });
  }

  private async handleGameOver() {
    globalState.isGameOver = true;
  }

  private async handleUpdateAttacks() {
    attackStateManager.updateAttacks();
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

  private async handleEnemiesMoveTowardsAvatar(): Promise<void> {
    const enemies = enemiesStateManager.getEnemies();
    enemies.forEach(async (enemy) => {
      if (enemy !== undefined) await enemy.genMoveTowardsAvatar();
    });
  }

  private async handleAvatarInitiateAttack(event: MouseEvent): Promise<void> {
    const wind = await Wind.create(
      AVATAR_LOCATION.x - WIND_DISPLACEMENT,
      AVATAR_LOCATION.y - WIND_DISPLACEMENT,
      event.clientX,
      event.clientY
    );
    attackStateManager.addAttack(wind);
    MainLayer.instance.layer.addChild(wind.instance);
  }
}
