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
  RefreshDebugToolEvent,
  UpdateAttacksEvent,
} from "../states/events/GameEvent";
import { GameEventManager } from "../states/events/GameStateManager";
import { globalState } from "../states/events";
import Application from "../entity/Application";
import { ENABLE_MULTI_PLAYER } from "../utils/Knobs";
import enemiesStateManager from "../states/EnemyStateManager";
import SocketClient from "../utils/SocketClient";
import { Avatar } from "../entity/Avatar";
import { Sword } from "../entity/Attacks/Sword";

const AVATAR_ATTACK_INTERVAL = 2000;
const ENEMY_APPEAR_INTERVAL = 3000;
const ENEMY_ATTACK_INTERVAL = 500;
const COLLECT_ITEM_INTERVAL = 10;
const ITEM_RANDOM_APPEAR_INTERVAL = 10000;

interface EnemyObject {
  x: number;
  y: number;
}
export type EnemiesSerialization = { [key: string]: EnemyObject };
type gameStateSnapShot = {
  enemies: EnemiesSerialization;
  [key: string]: unknown;
};

export class MainLayer {
  public static instance: MainLayer;
  public layer: PIXI.Container;

  constructor() {
    this.layer = new PIXI.Container();
  }

  public static async genInstance(): Promise<MainLayer> {
    const socketClient = SocketClient.getInstance();
    const avatar = await Avatar.genInstance();
    if (!MainLayer.instance) {
      MainLayer.instance = new MainLayer();
      const gameEventManager = GameEventManager.getInstance();
      // enemy related events
      timedEventsManager.addEvent(ENEMY_APPEAR_INTERVAL, async () => {
        if (!ENABLE_MULTI_PLAYER) {
          gameEventManager.emit(new GenerateNewEnemyEvent());
        } else {
          socketClient.emit("handleGenerateNewEnemy", {});
        }
      });

      if (ENABLE_MULTI_PLAYER) {
        socketClient.on("update", (data: unknown) => {
          const structuredData = data as gameStateSnapShot;
          const enemies = structuredData["enemies"];
          enemiesStateManager.resetAllEnemies(enemies);
        });
      }

      timedEventsManager.addEvent(AVATAR_ATTACK_INTERVAL, async () => {
        if (!ENABLE_MULTI_PLAYER) {
          gameEventManager.emit(new AvatarAttackEnemiesEvent());
        } else {
          socketClient.emit("handleAvatarAttackEnemiesEvent", {});
          new Sword(this.instance.layer, avatar.walkingSprite);
        }
      });

      timedEventsManager.addEvent(ENEMY_ATTACK_INTERVAL, async () => {
        if (!ENABLE_MULTI_PLAYER) {
          gameEventManager.emit(new EnemiesAttackAvatarEvent());
        } else {
          socketClient.emit("handleEnemiesAttackAvatar", {});
        }
      });

      // item related events
      timedEventsManager.addEvent(ITEM_RANDOM_APPEAR_INTERVAL, async () => {
        gameEventManager.emit(new GenerateNewItemEvent());
      });
      timedEventsManager.addEvent(COLLECT_ITEM_INTERVAL, async () => {
        gameEventManager.emit(new CollectItemEvent());
      });
    }
    return MainLayer.instance;
  }

  async update() {
    const gameEventManager = GameEventManager.getInstance();
    const isGamePaused = globalState.isGamePaused;
    const isGameOver = globalState.isGameOver;
    if (isGamePaused) {
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

    gameEventManager.emit(new MoveAvatarEvent());

    gameEventManager.emit(new UpdateAttacksEvent());

    gameEventManager.emit(new RefreshDebugToolEvent());

    timedEventsManager.update();
  }
}
