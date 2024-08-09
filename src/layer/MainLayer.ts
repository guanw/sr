import * as PIXI from "pixi.js";
import { Tiling } from "../entity/Tiling";
import { Avatar } from "../entity/Avatar";
import { DebugTool } from "../internal/DebugTool";
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

const AVATAR_ATTACK_INTERVAL = 2000;
const ENEMY_APPEAR_INTERVAL = 3000;
const ENEMY_ATTACK_INTERVAL = 500;
const COLLECT_ITEM_INTERVAL = 10;
const ITEM_RANDOM_APPEAR_INTERVAL = 10000;

export class MainLayer {
  public static instance: MainLayer;
  public layer: PIXI.Container;
  debugTool: DebugTool;
  gameEventManager: GameEventManager;

  constructor(tiling: Tiling, debugTool: DebugTool, user: Avatar) {
    this.layer = new PIXI.Container();
    this.debugTool = debugTool;
    this.gameEventManager = GameEventManager.getInstance();

    this.layer.addChild(tiling.tilingSprite);
    this.layer.addChild(this.debugTool.container);
    this.layer.addChild(user.sprite);
    this.layer.addChild(Avatar.healthBarContainer);
  }

  public static async genInstance(): Promise<MainLayer> {
    if (!MainLayer.instance) {
      const tiling = await Tiling.genInstance();
      const user: Avatar = await Avatar.genInstance();
      const debugTool = await DebugTool.genInstance();

      MainLayer.instance = new MainLayer(tiling, debugTool, user);

      // enemy related events
      timedEventsManager.addEvent(ENEMY_APPEAR_INTERVAL, async () => {
        MainLayer.instance.gameEventManager.emit(new GenerateNewEnemyEvent());
      });
      timedEventsManager.addEvent(AVATAR_ATTACK_INTERVAL, async () => {
        MainLayer.instance.gameEventManager.emit(
          new AvatarAttackEnemiesEvent()
        );
      });
      timedEventsManager.addEvent(ENEMY_ATTACK_INTERVAL, async () => {
        MainLayer.instance.gameEventManager.emit(
          new EnemiesAttackAvatarEvent()
        );
      });

      // item related events
      timedEventsManager.addEvent(ITEM_RANDOM_APPEAR_INTERVAL, async () => {
        MainLayer.instance.gameEventManager.emit(new GenerateNewItemEvent());
      });
      timedEventsManager.addEvent(COLLECT_ITEM_INTERVAL, async () => {
        MainLayer.instance.gameEventManager.emit(new CollectItemEvent());
      });
    }
    return MainLayer.instance;
  }

  async update() {
    this.gameEventManager.processEvents();

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

    MainLayer.instance.gameEventManager.emit(
      new EnemiesMoveTowardsAvatarEvent()
    );

    MainLayer.instance.gameEventManager.emit(new UpdateAttacksEvent());

    MainLayer.instance.gameEventManager.emit(new RefreshDebugToolEvent());

    timedEventsManager.update();
  }
}
