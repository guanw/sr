// index.ts

import { Avatar } from './entity/avatar';
import { globalState, moveUser } from './states/events';
import { createEnvironmentReferences } from './environmentReference';
import enemiesStateManager from './states/EnemyStateManager';
import { Menu } from './menu';
import { timedEventsManager } from './timeEventsManager';
import { itemsStateManager } from './states/ItemsStateManager';
import { DebugTool } from "./internal/DebugTool";
import { Tiling } from "./entity/Tiling";
import Application from './entity/Application';


const AVATAR_ATTACK_INTERVAL = 2000;
const ENEMY_APPEAR_INTERVAL = 3000;
const ENEMY_ATTACK_INTERVAL = 500;
const COLLECT_ITEM_INTERVAL = 10;
const ITEM_RANDOM_APPEAR_INTERVAL = 10000;

(async () =>
    {
        // initialize app instance
        const instance = await Application.genInstance();

        const tiling = await Tiling.create();

        // TODO add reference to the game
        // createEnvironmentReferences(app);

        const user: Avatar = await Avatar.create();
        const debugTool = await DebugTool.create(user);
        const menuContainer = new Menu(instance.app);


        // enemy related events
        timedEventsManager.addEvent(ENEMY_APPEAR_INTERVAL, async () => {
            await enemiesStateManager.genAddEnemy();
        });
        timedEventsManager.addEvent(AVATAR_ATTACK_INTERVAL, () => {
            const enemies = enemiesStateManager.getEnemies();
            user.performAttack(enemies);
        });
        timedEventsManager.addEvent(ENEMY_ATTACK_INTERVAL, async () => {
            const enemies = enemiesStateManager.getEnemies();
            await user.genCheckCollisionWithEnemyAndReduceHealth(enemies);
        });

        // item related events
        timedEventsManager.addEvent(ITEM_RANDOM_APPEAR_INTERVAL, async () => {
            await itemsStateManager.genAddItem(user);
        });
        timedEventsManager.addEvent(COLLECT_ITEM_INTERVAL, async () => {
            const items = itemsStateManager.getItems();
            await user.genCheckCollectingItems(items);
        })

        // Game loop
        async function gameLoop() {
            const isGamePaused = globalState.isGamePaused;
            const isGameOver = globalState.isGameOver;
            // if paused, show menu
            menuContainer.setMenuVisibility(isGamePaused);
            if (isGamePaused) {
                menuContainer.genUpdateMenuPosition();
            }

            if (isGamePaused || isGameOver) {
                requestAnimationFrame(gameLoop);
                return;
            }

            moveUser(tiling, itemsStateManager.getItems(), enemiesStateManager.getEnemies());

            const enemies = enemiesStateManager.getEnemies();
            enemies.forEach((enemy) => {
                if (enemy !== undefined)
                    enemy.moveTowards(user.getX(), user.getY())
            })

            timedEventsManager.update();

            await debugTool.genUpdate();

            // Render the stage
            instance.app.renderer.render(instance.app.stage);

            // Request next frame
            requestAnimationFrame(gameLoop);
        }

        // Start the game loop
        gameLoop();
    })();

