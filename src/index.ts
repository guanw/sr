// index.ts

import * as PIXI from "pixi.js";
import { genCreateAvatar, avatarSpeed, avatarKeys, performAttack, updateAvatarHPPosition, checkCollisionAndReduceHealth } from './avatar';
import { createEnvironmentReferences } from './environmentReference';
import { createEnemies, enemySpeed } from './enemy';
import { globalState } from './globalState';
import { createMenu } from './menu';


let lastAvatarAttackTime = 0;
let lastEnemyAttackTime = 0;
const AVATAR_ATTACK_INTERVAL = 2000;
const ENEMY_ATTACK_INTERVAL = 200;
(async () =>
    {
        // Create a PixiJS application.
        const app = new PIXI.Application();

        // Intialize the application.
        await app.init({ background: '#1099bb', width: 800, height: 600 });

        // Then adding the application's canvas to the DOM body.
        document.body.appendChild(app.canvas);

        const user: PIXI.Sprite = await genCreateAvatar(app);
        const enemies = createEnemies(app);
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
                app.stage.x += avatarSpeed;
                user.x -= avatarSpeed;
            }
            if (avatarKeys.ArrowRight) {
                app.stage.x -= avatarSpeed;
                user.x += avatarSpeed;
            }
            if (avatarKeys.ArrowUp) {
                app.stage.y += avatarSpeed;
                user.y -= avatarSpeed;
            }
            if (avatarKeys.ArrowDown) {
                app.stage.y -= avatarSpeed;
                user.y += avatarSpeed;
            }

            // move hp based on key states
            updateAvatarHPPosition(user.x, user.y);

            // move enemies based on location of user
            Object.keys(enemies).forEach((key) => {
                const enemy = enemies[key];
                if (enemy && user) {
                    const dx = user.x - enemy.x;
                    const dy = user.y - enemy.y;
                    const angle = Math.atan2(dy, dx);
                    const vx = Math.cos(angle) * enemySpeed;
                    const vy = Math.sin(angle) * enemySpeed;
                    enemy.x += vx;
                    enemy.y += vy;
                }
            })

            // trigger attack if possible
            const avatarAttackTime = Date.now();
            if (avatarAttackTime - lastAvatarAttackTime >= AVATAR_ATTACK_INTERVAL) {
                lastAvatarAttackTime = avatarAttackTime;
                performAttack(app, user, enemies);
            }

            // reduce health when enemy collides with avatar
            const enemyAttackTime = Date.now();
            if (enemyAttackTime - lastEnemyAttackTime >= ENEMY_ATTACK_INTERVAL) {
                lastEnemyAttackTime = enemyAttackTime;
                checkCollisionAndReduceHealth(app, user, enemies);
            }

            // Render the stage
            app.renderer.render(app.stage);

            // Request next frame
            requestAnimationFrame(gameLoop);
        }

        // Start the game loop
        gameLoop();
    })();

