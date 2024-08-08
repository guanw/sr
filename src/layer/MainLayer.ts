import * as PIXI from "pixi.js";
import { Tiling } from "../entity/Tiling";
import { Avatar } from "../entity/Avatar";
import { DebugTool } from "../internal/DebugTool";
import { timedEventsManager } from "../timeEventsManager";
import enemiesStateManager from "../states/EnemyStateManager";
import { itemsStateManager } from "../states/ItemsStateManager";
import attackStateManager from "../states/AttackStateManager";
import {
  AvatarAttackEnemiesEvent,
  GameEventManager,
} from "../states/events/GameEvent";

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
      const debugTool = await DebugTool.create();

      MainLayer.instance = new MainLayer(tiling, debugTool, user);

      // enemy related events
      timedEventsManager.addEvent(ENEMY_APPEAR_INTERVAL, async () => {
        await enemiesStateManager.genAddEnemy();
      });
      timedEventsManager.addEvent(AVATAR_ATTACK_INTERVAL, async () => {
        MainLayer.instance.gameEventManager.emit(
          new AvatarAttackEnemiesEvent()
        );
      });
      timedEventsManager.addEvent(ENEMY_ATTACK_INTERVAL, async () => {
        const enemies = enemiesStateManager.getEnemies();
        await user.genCheckCollisionWithEnemyAndReduceHealth(enemies);
      });

      // item related events
      timedEventsManager.addEvent(ITEM_RANDOM_APPEAR_INTERVAL, async () => {
        await itemsStateManager.genAddItem(MainLayer.instance.layer);
      });
      timedEventsManager.addEvent(COLLECT_ITEM_INTERVAL, async () => {
        const items = itemsStateManager.getItems();
        await user.genCheckCollectingItems(items);
      });
    }
    return MainLayer.instance;
  }

  async update() {
    const enemies = enemiesStateManager.getEnemies();
    enemies.forEach(async (enemy) => {
      if (enemy !== undefined) await enemy.genMoveTowardsAvatar();
    });

    attackStateManager.updateAttacks();

    timedEventsManager.update();

    await this.debugTool.genUpdate();

    this.gameEventManager.processEvents();
  }
}
