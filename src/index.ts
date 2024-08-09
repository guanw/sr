import { globalState } from "./states/events";
// import { createEnvironmentReferences } from './environmentReference';
import Application from "./entity/Application";
import { MainLayer } from "./layer/MainLayer";
import { PlaygroundLayer } from "./layer/PlaygroundLayer";

(async () => {
  // initialize app instance
  const instance = await Application.genInstance();
  const mainLayer = await MainLayer.genInstance();
  const playgroundLayer = await PlaygroundLayer.genInstance();
  instance.app.stage.addChild(mainLayer.layer);
  instance.app.stage.addChild(playgroundLayer.layer);
  mainLayer.layer.visible = true;
  playgroundLayer.layer.visible = false;

  // Game loop
  async function gameLoop() {
    const isGameOver = globalState.isGameOver;

    if (isGameOver) {
      await instance.genHandleGameOver();
      requestAnimationFrame(gameLoop);
      return;
    }

    if (!globalState.isPlaygroundActive) {
      await mainLayer.update();
    } else {
      await playgroundLayer.update();
    }

    // Render the stage
    instance.app.renderer.render(instance.app.stage);

    // Request next frame
    requestAnimationFrame(gameLoop);
  }

  // Start the game loop
  gameLoop();
})();
