// index.ts

import * as PIXI from "pixi.js";
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
        const instance = await Application.getInstance();

        const tiling = await Tiling.create();

        // TODO add reference to the game
        // createEnvironmentReferences(app);

        const user: Avatar = await Avatar.create();
        const debugTool = new DebugTool(instance.app, user);
        const menuContainer = new Menu(instance.app);


        // enemy related events
        timedEventsManager.addEvent(ENEMY_APPEAR_INTERVAL, async () => {
            await enemiesStateManager.genAddEnemy();
        });
        timedEventsManager.addEvent(AVATAR_ATTACK_INTERVAL, () => {
            const enemies = enemiesStateManager.getEnemies();
            user.performAttack(enemies);
        });
        timedEventsManager.addEvent(ENEMY_ATTACK_INTERVAL, () => {
            const enemies = enemiesStateManager.getEnemies();
            user.checkCollisionWithEnemyAndReduceHealth(enemies);
        });

        // item related events
        timedEventsManager.addEvent(ITEM_RANDOM_APPEAR_INTERVAL, async () => {
            await itemsStateManager.genAddItem(user);
        });
        timedEventsManager.addEvent(COLLECT_ITEM_INTERVAL, () => {
            const items = itemsStateManager.getItems();
            user.CheckCollectingItems(items);
        })

        // Game loop
        function gameLoop() {
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

            moveUser(user, tiling, itemsStateManager.getItems());

            const enemies = enemiesStateManager.getEnemies();
            enemies.forEach((enemy) => {
                if (enemy !== undefined)
                    enemy.moveTowards(user.getX(), user.getY())
            })

            timedEventsManager.update();

            debugTool.update(instance.app);

            // Render the stage
            instance.app.renderer.render(instance.app.stage);

            // Request next frame
            requestAnimationFrame(gameLoop);
        }

        // Start the game loop
        gameLoop();
    })();

