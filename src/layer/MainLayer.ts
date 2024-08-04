import * as PIXI from 'pixi.js';
import { Tiling } from '../entity/Tiling';
import { Avatar } from '../entity/avatar';
import { DebugTool } from '../internal/DebugTool';
import { timedEventsManager } from '../timeEventsManager';
import enemiesStateManager from '../states/EnemyStateManager';
import { itemsStateManager } from '../states/ItemsStateManager';
import { moveUser } from '../states/events';

const AVATAR_ATTACK_INTERVAL = 2000;
const ENEMY_APPEAR_INTERVAL = 3000;
const ENEMY_ATTACK_INTERVAL = 500;
const COLLECT_ITEM_INTERVAL = 10;
const ITEM_RANDOM_APPEAR_INTERVAL = 10000;

export class MainLayer {
    public static instance: MainLayer;
    public layer: PIXI.Container
    user: Avatar;
    debugTool: DebugTool;
    tiling: Tiling;

    constructor(tiling: Tiling,  debugTool: DebugTool, user: Avatar) {
        this.layer = new PIXI.Container();
        this.tiling = tiling;
        this.debugTool = debugTool;
        this.user = user;

        this.layer.addChild(this.tiling.instance);
        this.layer.addChild(this.debugTool.container);
        this.layer.addChild(this.user.sprite);
        this.layer.addChild(Avatar.healthBarContainer);
    }

    public static async genInstance(): Promise<MainLayer> {
        if (!MainLayer.instance) {
            const tiling = await Tiling.create();
            const user: Avatar = await Avatar.create();
            const debugTool = await DebugTool.create(tiling, user);

            MainLayer.instance = new MainLayer(tiling, debugTool, user);

            // enemy related events
            timedEventsManager.addEvent(ENEMY_APPEAR_INTERVAL, async () => {
                await enemiesStateManager.genAddEnemy(MainLayer.instance.layer);
            });
            timedEventsManager.addEvent(AVATAR_ATTACK_INTERVAL, async () => {
                const enemies = enemiesStateManager.getEnemies();
                await user.genPerformAttack(enemies);
            });
            timedEventsManager.addEvent(ENEMY_ATTACK_INTERVAL, async () => {
                const enemies = enemiesStateManager.getEnemies();
                await user.genCheckCollisionWithEnemyAndReduceHealth(enemies);
            });

            // item related events
            timedEventsManager.addEvent(ITEM_RANDOM_APPEAR_INTERVAL, async () => {
                await itemsStateManager.genAddItem(MainLayer.instance.layer, user);
            });
            timedEventsManager.addEvent(COLLECT_ITEM_INTERVAL, async () => {
                const items = itemsStateManager.getItems();
                await user.genCheckCollectingItems(items);
            })
        }
        return MainLayer.instance;
    }

    async update() {
        moveUser(this.tiling, itemsStateManager.getItems(), enemiesStateManager.getEnemies());

        const enemies = enemiesStateManager.getEnemies();
        enemies.forEach((enemy) => {
            if (enemy !== undefined)
                enemy.moveTowards(this.user.getX(), this.user.getY())
        })

        timedEventsManager.update();

        await this.debugTool.genUpdate();
    }
}