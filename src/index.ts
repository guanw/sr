// index.ts

import * as PIXI from "pixi.js";
import { AVATAR_SPEED, avatarKeys, Avatar } from './avatar';
import { createEnvironmentReferences } from './environmentReference';
import { EnemyFactory } from './enemy';
import { globalState } from './globalState';
import { createMenu } from './menu';


let lastAvatarAttackTime = 0;
let lastEnemyAppearTime = 0;
let lastEnemyAttackTime = 0;
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

        createMenu(app);

        createEnvironmentReferences(app);

        // Game loop
        function gameLoop() {
            if (globalState.isGamePaused) {
                requestAnimationFrame(gameLoop);
                return;
            }

            // Move user based on key states
            if (avatarKeys.ArrowLeft) {
                app.stage.x += AVATAR_SPEED;
                user.moveLeft();
            }
            if (avatarKeys.ArrowRight) {
                app.stage.x -= AVATAR_SPEED;
                user.moveRight();
            }
            if (avatarKeys.ArrowUp) {
                app.stage.y += AVATAR_SPEED;
                user.moveDown();
            }
            if (avatarKeys.ArrowDown) {
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

            // add new enemy if possible
            const newEnemyAppearTime = Date.now();
            if (newEnemyAppearTime - lastEnemyAppearTime >= ENEMY_APPEAR_INTERVAL) {
                lastEnemyAppearTime = newEnemyAppearTime;
                enemyFactory.addEnemy();
            }

            // trigger attack if possible
            const avatarAttackTime = Date.now();
            if (avatarAttackTime - lastAvatarAttackTime >= AVATAR_ATTACK_INTERVAL) {
                lastAvatarAttackTime = avatarAttackTime;
                user.performAttack(enemies);
            }

            // reduce health when enemy collides with avatar
            const enemyAttackTime = Date.now();
            if (enemyAttackTime - lastEnemyAttackTime >= ENEMY_ATTACK_INTERVAL) {
                lastEnemyAttackTime = enemyAttackTime;
                user.checkCollisionAndReduceHealth(app, enemies);
            }

            // Render the stage
            app.renderer.render(app.stage);

            // Request next frame
            requestAnimationFrame(gameLoop);
        }

        // Start the game loop
        gameLoop();
    })();

