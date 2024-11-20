import * as PIXI from "pixi.js";
import { timedEventsManager } from "../timeEventsManager";
import {
  AvatarAttackEnemiesEvent,
  CollectItemEvent,
  EnemiesAttackAvatarEvent,
  EnemiesMoveTowardsAvatarEvent,
  GenerateNewEnemyEvent,
  GenerateNewItemEvent,
  MoveAvatarEvent,
  UpdateAttacksEvent,
} from "../states/events/GameEvent";
import { GameEventManager } from "../states/events/GameStateManager";
import {
  globalState,
  isGamePaused,
  resumeGame,
  setIsGamePaused,
} from "../states/events";
import Application from "../entity/Application";
import { ENABLE_MULTI_PLAYER } from "../utils/Knobs";
import enemiesStateManager from "../states/EnemyStateManager";
import { SocketClient } from "../utils/SocketClient";
import { Avatar } from "../entity/Avatar";
import { Sword } from "../entity/Attacks/Sword";
import {
  ENEMY_APPEAR_INTERVAL,
  AVATAR_ATTACK_INTERVAL,
  ENEMY_ATTACK_INTERVAL,
  ITEM_RANDOM_APPEAR_INTERVAL,
  COLLECT_ITEM_INTERVAL,
} from "../utils/Constants";
import { itemsStateManager } from "../states/ItemsStateManager";
import avatarsStateManager from "../states/AvatarsStateManager";
import { tilingsStateManager } from "../states/TilingsStateManager";
import { Plugin } from "../PluginManager";
import { menu } from "../menu";

interface EnemyObject {
  x: number;
  y: number;
}
interface ItemObject {
  x: number;
  y: number;
  type: string;
}
interface AvatarObject {
  x: number;
  y: number;
  hp: number;
}
export interface TilingObject {
  x: number;
  y: number;
  type: string; // matches enum TILING
}
export type EnemiesSerialization = { [key: string]: EnemyObject };
export type ItemsSerialization = { [key: string]: ItemObject };
export type AvatarsSerialization = { [key: string]: AvatarObject };
export type TilingsSerialization = { [key: string]: TilingObject };
type GameStateSnapShot = {
  enemies: EnemiesSerialization;
  avatars: AvatarsSerialization;
  items: ItemsSerialization;
  tilings: TilingsSerialization;
  gameStopped: boolean;
  [key: string]: unknown;
};

class MainLayer implements Plugin {
  public layer: PIXI.Container;

  constructor() {
    this.layer = new PIXI.Container();
  }

  async genInitialize(): Promise<void> {
    const socketClient = SocketClient.getInstance();
    const avatar = await Avatar.genInstance();
    const gameEventManager = GameEventManager.getInstance();

    if (ENABLE_MULTI_PLAYER) {
      const roomName = await this.showRoomSelection();
      socketClient.emit("joinRoom", roomName);
      avatar.roomName = roomName;
    }

    // enemy related events
    timedEventsManager.addEvent(ENEMY_APPEAR_INTERVAL, async () => {
      if (!ENABLE_MULTI_PLAYER) {
        gameEventManager.emit(new GenerateNewEnemyEvent());
      } else {
        socketClient.emit("handleGenerateNewEnemy", {
          roomName: avatar.roomName,
        });
      }
    });

    timedEventsManager.addEvent(AVATAR_ATTACK_INTERVAL, async () => {
      if (!ENABLE_MULTI_PLAYER) {
        gameEventManager.emit(new AvatarAttackEnemiesEvent());
      } else {
        socketClient.emit("handleAvatarAttackEnemies", {
          avatarId: socketClient.getSocketId(),
          roomName: avatar.roomName,
        });
        new Sword(this.layer, avatar.walkingSprite);
      }
    });

    timedEventsManager.addEvent(ENEMY_ATTACK_INTERVAL, async () => {
      if (!ENABLE_MULTI_PLAYER) {
        gameEventManager.emit(new EnemiesAttackAvatarEvent());
      } else {
        socketClient.emit("handleEnemiesAttackAvatar", {
          roomName: avatar.roomName,
        });
      }
    });

    // item related events
    timedEventsManager.addEvent(ITEM_RANDOM_APPEAR_INTERVAL, async () => {
      if (!ENABLE_MULTI_PLAYER) {
        gameEventManager.emit(new GenerateNewItemEvent());
      } else {
        socketClient.emit("handleGenerateNewItem", {});
      }
    });
    timedEventsManager.addEvent(COLLECT_ITEM_INTERVAL, async () => {
      if (!ENABLE_MULTI_PLAYER) {
        gameEventManager.emit(new CollectItemEvent());
      } else {
        socketClient.emit("handleCollectItem", {
          avatarId: socketClient.getSocketId(),
          roomName: avatar.roomName,
        });
      }
    });

    if (ENABLE_MULTI_PLAYER) {
      socketClient.on("update", async (data: unknown) => {
        const structuredData = data as GameStateSnapShot;
        this.syncGameState(structuredData);

        const avatarsData = structuredData["avatars"];
        const playerAvatar = avatarsData[socketClient.getSocketId()!];
        if (!playerAvatar) {
          return;
        }
        const latestAvatarAbsoluteX = playerAvatar.x;
        const latestAvatarAbsoluteY = playerAvatar.y;
        const avatarHp = playerAvatar.hp;
        const avatar = await Avatar.genInstance();
        avatar.updateHealth(avatarHp);

        avatarsStateManager.syncAllAvatars(
          avatarsData,
          socketClient.getSocketId()!
        );

        enemiesStateManager.syncAllEnemies(
          structuredData["enemies"],
          latestAvatarAbsoluteX,
          latestAvatarAbsoluteY
        );

        itemsStateManager.syncAllItems(
          structuredData["items"],
          latestAvatarAbsoluteX,
          latestAvatarAbsoluteY
        );

        tilingsStateManager.syncAllTilings(
          structuredData["tilings"],
          latestAvatarAbsoluteX,
          latestAvatarAbsoluteY
        );
      });
    }
  }

  private async showRoomSelection(): Promise<string> {
    return new Promise((resolve) => {
      const roomSelection = document.getElementById("room-selection")!;
      const roomInput = document.getElementById(
        "room-input"
      ) as HTMLInputElement;
      const roomSubmit = document.getElementById("room-submit")!;

      roomSelection.style.display = "flex";
      const game = document.getElementById("game-canvas")!;

      roomSubmit.addEventListener("click", () => {
        const roomName = roomInput.value.trim();
        if (roomName) {
          roomSelection.style.display = "none";
          game.style.display = "flex";
          resumeGame();
          resolve(roomName);
        } else {
          alert("Please enter a room name.");
        }
      });
    });
  }

  /* pause game if gameStopped is true */
  private syncGameState(structuredData: GameStateSnapShot) {
    setIsGamePaused(structuredData.gameStopped);
    menu.setMenuVisibility(isGamePaused());
  }

  async genUpdate(): Promise<void> {
    if (globalState.isPlaygroundActive) {
      return;
    }
    const gameEventManager = GameEventManager.getInstance();
    const avatar = await Avatar.genInstance();
    const gamePaused = isGamePaused();
    const isGameOver = globalState.isGameOver;
    if (gamePaused) {
      return;
    }
    if (isGameOver) {
      const app = await Application.genInstance();
      await app.genHandleGameOver();
      return;
    }

    if (!ENABLE_MULTI_PLAYER) {
      gameEventManager.emit(new EnemiesMoveTowardsAvatarEvent());
    } else {
      const socketClient = SocketClient.getInstance();
      socketClient.emit("handleEnemiesMoveTowardsAvatar", {});
    }

    if (!ENABLE_MULTI_PLAYER) {
      gameEventManager.emit(new MoveAvatarEvent());
    } else {
      const socketClient = SocketClient.getInstance();
      socketClient.emit("handleMoveAvatar", {
        avatarId: socketClient.getSocketId(),
        roomName: avatar.roomName,
      });
    }

    gameEventManager.emit(new UpdateAttacksEvent());

    timedEventsManager.update();
  }
}

const mainLayer = new MainLayer();
export { mainLayer };
