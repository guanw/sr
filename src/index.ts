// index.ts

import * as PIXI from "pixi.js";
import { AVATAR_SPEED, Avatar } from './avatar';
import { avatarMoveKeys, globalState } from './events';
import { createEnvironmentReferences } from './environmentReference';
import { EnemyFactory } from './enemy';
import { Menu } from './menu';
import { timedEventsManager } from './timeEventsManager';


const AVATAR_ATTACK_INTERVAL = 2000;
const ENEMY_APPEAR_INTERVAL = 1500;
const ENEMY_ATTACK_INTERVAL = 200;

(async () =>
    {
        // Create a PixiJS application.
        const app = new PIXI.Application();

        // Intialize the application.
        await app.init({ background: '#1099bb', width: 800, height: 600 });

        // Then adding the application's canvas to the DOM body.
        document.body.appendChild(app.canvas);

        const user: Avatar = await Avatar.create(app);

        const enemyFactory = new EnemyFactory(app);
        enemyFactory.addEnemy();
        enemyFactory.addEnemy();
        enemyFactory.addEnemy();

        const menuContainer = new Menu(app);

        createEnvironmentReferences(app);

        // add new enemy if possible
        timedEventsManager.addEvent(ENEMY_APPEAR_INTERVAL, () => {
            enemyFactory.addEnemy();
        });

        // trigger attack if possible
        timedEventsManager.addEvent(AVATAR_ATTACK_INTERVAL, () => {
            const enemies = enemyFactory.getEnemies();
            user.performAttack(enemies);
        });

        // reduce health when enemy collides with avatar
        timedEventsManager.addEvent(ENEMY_ATTACK_INTERVAL, () => {
            const enemies = enemyFactory.getEnemies();
            user.checkCollisionAndReduceHealth(app, enemies);
        });

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


            // Move user based on key states
            if (avatarMoveKeys.ArrowLeft) {
                app.stage.x += AVATAR_SPEED;
                user.moveLeft();
            }
            if (avatarMoveKeys.ArrowRight) {
                app.stage.x -= AVATAR_SPEED;
                user.moveRight();
            }
            if (avatarMoveKeys.ArrowUp) {
                app.stage.y += AVATAR_SPEED;
                user.moveDown();
            }
            if (avatarMoveKeys.ArrowDown) {
                app.stage.y -= AVATAR_SPEED;
                user.moveUp();
            }

            // move hp based on key states
            user.updateHPPosition();

            const enemies = enemyFactory.getEnemies();
            // move enemies based on location of user
            enemies.forEach((enemy) => {
                if (enemy !== undefined)
                    enemy.moveTowardsPlayer(user.getX(), user.getY())
            })

            timedEventsManager.update();

            // Render the stage
            app.renderer.render(app.stage);

            // Request next frame
            requestAnimationFrame(gameLoop);
        }

        // Start the game loop
        gameLoop();
    })();

