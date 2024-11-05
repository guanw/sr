import { Avatar } from "../../entity/Avatar";
import { DebugTool } from "../../internal/DebugTool";
import { MainLayer } from "../../layer/MainLayer";
import { PlaygroundLayer } from "../../layer/PlaygroundLayer";
import { Menu } from "../../menu";
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
import { Background } from "../../entity/Background";
import { tilingsStateManager } from "../TilingsStateManager";
import SkillSlot from "../../entity/SkillSlot";
import { AVATAR_SPEED } from "../../utils/Constants";

const SKILL_SLOT_KEYS = "1234567890";

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

    if (globalState.isGamePaused) {
      return;
    }
  }

  private async handleEvent(event: GameEvent) {
    switch (event.type) {
      case "AVATAR_ATTACK_ENEMIES":
        await this.handleAvatarAttackEnemies();
        break;
      case "KEY_DOWN": {
        const keyDownEvent = event as KeyDownEvent;
        const key = keyDownEvent.event.key;
        if (key === "m" || key === "M") {
          await this.handleToggleMenu();
          return;
        }

        if (key === "d" || key === "D") {
          await this.handleToggleDebugTool();
          return;
        }

        if (key in avatarKeys) {
          await this.handleAvatarMoveKeyDownEvent(keyDownEvent.event);
          return;
        }

        if (key === "p" || key === "P") {
          globalState.isPlaygroundActive = !globalState.isPlaygroundActive;
          const mainLayer = await MainLayer.genInstance();
          const playgroundLayer = await PlaygroundLayer.genInstance();
          mainLayer.layer.visible = !globalState.isPlaygroundActive;
          playgroundLayer.layer.visible = globalState.isPlaygroundActive;
          return;
        }

        if (SKILL_SLOT_KEYS.includes(key)) {
          const skillSlot = await SkillSlot.genInstance();
          const skillIndex = parseInt(key) - 1;
          skillSlot.triggerSkill(skillIndex);
          return;
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
      case "AVATAR_INITIATE_ATTACK": {
        const attackEvent = event as AvatarInitiateAttackEvent;
        await this.handleAvatarInitiateAttack(attackEvent.event);
        break;
      }
      case "MOVE_AVATAR": {
        await this.genHandleMoveUser(avatarKeys);
      }
    }
  }

  private async handleAvatarAttackEnemies() {
    const avatar = await Avatar.genInstance();
    const enemies = enemiesStateManager.getEnemies();
    await avatar.genPerformAttack(enemies);
  }

  private async handleAvatarMoveKeyDownEvent(e: KeyboardEvent) {
    if (e.key in avatarKeys) {
      avatarKeys[e.key] = true;
      const user: Avatar = await Avatar.genInstance();
      user.walk();
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
    await debugTool.toggle();
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
    let enemyBumpsAvatar = false;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_, enemy] of enemies.entries()) {
      if (enemy === undefined) {
        return;
      }
      if (enemy.isCollidedWith(user)) {
        await user.genCollide(enemy.attackPower);
        enemyBumpsAvatar = true;
      }
    }
    user.speed = enemyBumpsAvatar ? (AVATAR_SPEED * 2.0) / 3 : AVATAR_SPEED;
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
      if (item.isCollidedWith(user)) {
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

  public async genHandleMoveUser(avatarKeys: { [key: string]: boolean }) {
    // Move user based on key states
    if (avatarKeys.ArrowLeft) {
      const collidedWithTiles =
        await tilingsStateManager.genCheckCollisionWithAvatar("left");
      if (collidedWithTiles) {
        return;
      }
      await this.genMoveUserLeft();
    }
    if (avatarKeys.ArrowRight) {
      const collidedWithTiles =
        await tilingsStateManager.genCheckCollisionWithAvatar("right");
      if (collidedWithTiles) {
        return;
      }
      await this.genMoveUserRight();
    }
    if (avatarKeys.ArrowUp) {
      const collidedWithTiles =
        await tilingsStateManager.genCheckCollisionWithAvatar("up");
      if (collidedWithTiles) {
        return;
      }
      await this.genMoveUserUp();
    }
    if (avatarKeys.ArrowDown) {
      const collidedWithTiles =
        await tilingsStateManager.genCheckCollisionWithAvatar("down");
      if (collidedWithTiles) {
        return;
      }
      await this.genMoveUserDown();
    }
  }

  private async genMoveUserLeft() {
    const avatar = await Avatar.genInstance();
    const background = await Background.genInstance();
    const items = itemsStateManager.getItems();
    const enemies = enemiesStateManager.getEnemies();
    const tiles = tilingsStateManager.getTilings();
    background.moveRight(avatar.speed);
    items.forEach((item) => {
      item.moveRight(avatar.speed);
    });
    enemies.forEach((enemy) => {
      enemy.moveRight(avatar.speed);
    });
    tiles.forEach((tile) => {
      tile.moveRight(avatar.speed);
    });
  }

  private async genMoveUserRight() {
    const avatar = await Avatar.genInstance();
    const background = await Background.genInstance();
    const items = itemsStateManager.getItems();
    const enemies = enemiesStateManager.getEnemies();
    const tiles = tilingsStateManager.getTilings();
    background.moveLeft(avatar.speed);
    items.forEach((item) => {
      item.moveLeft(avatar.speed);
    });
    enemies.forEach((enemy) => {
      enemy.moveLeft(avatar.speed);
    });
    tiles.forEach((tile) => {
      tile.moveLeft(avatar.speed);
    });
  }

  private async genMoveUserUp() {
    const avatar = await Avatar.genInstance();
    const background = await Background.genInstance();
    const items = itemsStateManager.getItems();
    const enemies = enemiesStateManager.getEnemies();
    const tiles = tilingsStateManager.getTilings();
    background.moveDown(avatar.speed);
    items.forEach((item) => {
      item.moveDown(avatar.speed);
    });
    enemies.forEach((enemy) => {
      enemy.moveDown(avatar.speed);
    });
    tiles.forEach((tile) => {
      tile.moveDown(avatar.speed);
    });
  }

  private async genMoveUserDown() {
    const avatar = await Avatar.genInstance();
    const background = await Background.genInstance();
    const items = itemsStateManager.getItems();
    const enemies = enemiesStateManager.getEnemies();
    const tiles = tilingsStateManager.getTilings();
    background.moveUp(avatar.speed);
    items.forEach((item) => {
      item.moveUp(avatar.speed);
    });
    enemies.forEach((enemy) => {
      enemy.moveUp(avatar.speed);
    });
    tiles.forEach((tile) => {
      tile.moveUp(avatar.speed);
    });
  }

  private async handleEnemiesMoveTowardsAvatar(): Promise<void> {
    const enemies = enemiesStateManager.getEnemies();
    enemies.forEach(async (enemy) => {
      if (enemy !== undefined) await enemy.genMoveTowardsAvatar();
    });
  }

  private async handleAvatarInitiateAttack(event: MouseEvent): Promise<void> {
    await attackStateManager.genAddAttack(event.clientX, event.clientY);
    const user: Avatar = await Avatar.genInstance();
    await user.attack();
  }
}
