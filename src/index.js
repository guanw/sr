import * as PIXI from "pixi.js";
import { genCreateAvatar, avatarSpeed, avatarKeys } from './avatar';
(async () =>
    {
        // Create a PixiJS application.
        const app = new PIXI.Application();

        // Intialize the application.
        await app.init({ background: '#1099bb', width: 800, height: 600 });
        const appWidth = app.screen.width;
        const appHeight = app.screen.height;

        // Then adding the application's canvas to the DOM body.
        document.body.appendChild(app.canvas);

        const user = await genCreateAvatar();
        user.x = appWidth / 2;
        user.y = appHeight / 2;
        app.stage.addChild(user);

        function addRandomItem() {
            const item = new PIXI.Graphics();
            item.fill(0xff0000)
            item.beginFill(0xff0000);
            item.drawCircle(0, 0, 10);
            item.endFill();
            item.x = Math.random() * appWidth;
            item.y = Math.random() * appHeight;
            app.stage.addChild(item);
        }
        for (let i = 0; i < 5; i++) {
            addRandomItem();
        }

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

            // Keep user within bounds of the screen
            if (user.x < 0) {
                user.x = 0;
            }
            if (user.x > appWidth) {
                user.x = appWidth;
            }
            if (user.y < 0) {
                user.y = 0;
            }
            if (user.y > appHeight) {
                user.y = appHeight;
            }

            // Render the stage
            app.renderer.render(app.stage);

            // Request next frame
            requestAnimationFrame(gameLoop);
        }

        // Start the game loop
        gameLoop();
    })();