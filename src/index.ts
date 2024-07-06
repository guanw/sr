import * as PIXI from "pixi.js";
import { genCreateAvatar, avatarSpeed, avatarKeys } from './avatar';
import { createEnvironmentReferences } from './environmentReference';
import { createEnemies, enemySpeed } from './enemy';
(async () =>
    {
        // Create a PixiJS application.
        const app = new PIXI.Application();

        // Intialize the application.
        await app.init({ background: '#1099bb', width: 800, height: 600 });

        // Then adding the application's canvas to the DOM body.
        document.body.appendChild(app.canvas);

        const user: PIXI.Sprite = await genCreateAvatar(app);
        const enemies = await createEnemies(app);

        createEnvironmentReferences(app);

        // Game loop
        function gameLoop() {
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

            // move enemies based on location of user
            for (const enemy of enemies) {
                if (enemy && user) {
                    const dx = user.x - enemy.x;
                    const dy = user.y - enemy.y;
                    const angle = Math.atan2(dy, dx);
                    const vx = Math.cos(angle) * enemySpeed;
                    const vy = Math.sin(angle) * enemySpeed;
                    enemy.x += vx;
                    enemy.y += vy;
                }
            }


            // Render the stage
            app.renderer.render(app.stage);

            // Request next frame
            requestAnimationFrame(gameLoop);
        }

        // Start the game loop
        gameLoop();
    })();