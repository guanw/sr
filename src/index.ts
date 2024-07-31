// index.ts

import * as PIXI from "pixi.js";
import { Avatar } from './entity/avatar';
import { globalState, moveUser } from './states/events';
import { createEnvironmentReferences } from './environmentReference';
import enemiesStateManager from './states/EnemyStateManager';
import { Menu } from './menu';
import { timedEventsManager } from './timeEventsManager';
import { ItemFactory } from './items';
import { DebugTool } from "./internal/DebugTool";


const AVATAR_ATTACK_INTERVAL = 2000;
const ENEMY_APPEAR_INTERVAL = 3000;
const ENEMY_ATTACK_INTERVAL = 500;
const COLLECT_ITEM_INTERVAL = 10;
const ITEM_RANDOM_APPEAR_INTERVAL = 10000;

(async () =>
    {
        // Create a PixiJS application.
        const app = new PIXI.Application();

        // Intialize the application.
        await app.init({ background: '#1099bb', width: 800, height: 600 });

        // Then adding the application's canvas to the DOM body.
        document.body.appendChild(app.canvas);

        const user: Avatar = await Avatar.create(app);
        const debugTool = new DebugTool(app, user);
        const itemFactory = new ItemFactory(app, user);
        const menuContainer = new Menu(app);

        createEnvironmentReferences(app);

        // add new enemy if possible
        timedEventsManager.addEvent(ENEMY_APPEAR_INTERVAL, () => {
            enemiesStateManager.addEnemy(app);
        });

        // trigger attack if possible
        timedEventsManager.addEvent(AVATAR_ATTACK_INTERVAL, () => {
            const enemies = enemiesStateManager.getEnemies();
            user.performAttack(enemies);
        });

        // reduce health when enemy collides with avatar
        timedEventsManager.addEvent(ENEMY_ATTACK_INTERVAL, () => {
            const enemies = enemiesStateManager.getEnemies();
            user.checkCollisionAndReduceHealth(enemies);
        });

        timedEventsManager.addEvent(ITEM_RANDOM_APPEAR_INTERVAL, () => {
            itemFactory.addItem();
        });

        timedEventsManager.addEvent(COLLECT_ITEM_INTERVAL, () => {
            const items = itemFactory.getItems();
            user.tryCollectItems(items);
        })

        // Game loop
        function gameLoop() {
            const isGamePaused = globalState.isGamePaused;
            const isGameOver = globalState.isGameOver;
            // if paused, show menu
            menuContainer.setMenuVisibility(isGamePaused);
            if (isGamePaused) {
                menuContainer.updateMenuPosition();
            }

            if (isGamePaused || isGameOver) {
                requestAnimationFrame(gameLoop);
                return;
            }


            moveUser(app, user);

            // move hp based on key states
            user.updateHPPosition();

            const enemies = enemiesStateManager.getEnemies();
            // move enemies based on location of user
            enemies.forEach((enemy) => {
                if (enemy !== undefined)
                    enemy.moveTowardsPlayer(user.getX(), user.getY())
            })

            timedEventsManager.update();

            debugTool.update(app);

            // Render the stage
            app.renderer.render(app.stage);

            // Request next frame
            requestAnimationFrame(gameLoop);
        }

        // Start the game loop
        gameLoop();
    })();

