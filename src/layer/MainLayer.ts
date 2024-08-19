import * as PIXI from "pixi.js";
import { timedEventsManager } from "../timeEventsManager";
import {
  AvatarAttackEnemiesEvent,
  CollectItemEvent,
  EnemiesAttackAvatarEvent,
  EnemiesMoveTowardsAvatarEvent,
  GenerateNewEnemyEvent,
  GenerateNewItemEvent,
  RefreshDebugToolEvent,
  UpdateAttacksEvent,
} from "../states/events/GameEvent";
import { GameEventManager } from "../states/events/GameStateManager";
import { globalState } from "../states/events";
import Application from "../entity/Application";
import { ENABLE_MULTI_PLAYER } from "../utils/Knobs";

const AVATAR_ATTACK_INTERVAL = 2000;
const ENEMY_APPEAR_INTERVAL = 3000;
const ENEMY_ATTACK_INTERVAL = 500;
const COLLECT_ITEM_INTERVAL = 10;
const ITEM_RANDOM_APPEAR_INTERVAL = 10000;

export class MainLayer {
  public static instance: MainLayer;
  public layer: PIXI.Container;

  constructor() {
    this.layer = new PIXI.Container();
  }

  public static async genInstance(): Promise<MainLayer> {
    if (!MainLayer.instance) {
      MainLayer.instance = new MainLayer();
      const gameEventManager = GameEventManager.getInstance();
      // enemy related events
      timedEventsManager.addEvent(ENEMY_APPEAR_INTERVAL, async () => {
        if (ENABLE_MULTI_PLAYER) {
          // TODO emit the events to socket.io server
        } else {
          gameEventManager.emit(new GenerateNewEnemyEvent());
        }
      });
      timedEventsManager.addEvent(AVATAR_ATTACK_INTERVAL, async () => {
        gameEventManager.emit(new AvatarAttackEnemiesEvent());
      });
      timedEventsManager.addEvent(ENEMY_ATTACK_INTERVAL, async () => {
        gameEventManager.emit(new EnemiesAttackAvatarEvent());
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

    gameEventManager.emit(new EnemiesMoveTowardsAvatarEvent());

    gameEventManager.emit(new UpdateAttacksEvent());

    gameEventManager.emit(new RefreshDebugToolEvent());

    timedEventsManager.update();
  }
}
