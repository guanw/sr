import { globalState } from './states/events';
// import { createEnvironmentReferences } from './environmentReference';
import Application from './entity/Application';
import { MainLayer } from './layer/MainLayer';
import { Menu } from './menu';

(async () =>
    {
        // initialize app instance
        const instance = await Application.genInstance();
        const mainLayer = await MainLayer.create();
        instance.app.stage.addChild(mainLayer.instance);
        const menu = new Menu(instance.app);
        // Game loop
        async function gameLoop() {
            // Add main layer-specific update logic here
            const isGamePaused = globalState.isGamePaused;
            const isGameOver = globalState.isGameOver;
            // if paused, show menu
            menu.setMenuVisibility(isGamePaused);
            if (isGamePaused) {
                menu.genUpdateMenuPosition();
            }

            if (isGamePaused || isGameOver) {
                requestAnimationFrame(gameLoop);
                return;
            }

            if (!globalState.isPlaygroundActive) {
                await mainLayer.update();
            }

            // Render the stage
            instance.app.renderer.render(instance.app.stage);

            // Request next frame
            requestAnimationFrame(gameLoop);
        }

        // Start the game loop
        gameLoop();
    })();
