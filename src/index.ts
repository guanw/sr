import * as PIXI from "pixi.js";
import { genCreateAvatar, avatarSpeed, avatarKeys } from './avatar';
import { createEnvironmentReferences } from './environmentReference';
(async () =>
    {
        // Create a PixiJS application.
        const app = new PIXI.Application();

        // Intialize the application.
        await app.init({ background: '#1099bb', width: 800, height: 600 });
        const appWidth: number = app.screen.width;
        const appHeight: number = app.screen.height;

        // Then adding the application's canvas to the DOM body.
        document.body.appendChild(app.canvas);

        const user: PIXI.Sprite = await genCreateAvatar();
        user.x = appWidth / 2;
        user.y = appHeight / 2;
        app.stage.addChild(user);

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

            // Render the stage
            app.renderer.render(app.stage);

            // Request next frame
            requestAnimationFrame(gameLoop);
        }

        // Start the game loop
        gameLoop();
    })();