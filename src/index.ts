import { globalState, initEventsListener } from "./states/events";
import Application from "./entity/Application";
import { MainLayer } from "./layer/MainLayer";
import { PlaygroundLayer } from "./layer/PlaygroundLayer";
import { GameEventManager } from "./states/events/GameStateManager";
import { ResourceLoader } from "./ResourceLoader";
import { LoadingView } from "./entity/LoadingView";
import { Background } from "./entity/Background";

async function genInitUI() {
  const appInstance = await Application.genInstance();
  const loadingView = await LoadingView.genInstance(appInstance.app.stage);
  await ResourceLoader.genInstance();
  await Background.genInstance();
  const mainLayer = await MainLayer.genInstance();
  mainLayer.layer.visible = false;
  const playgroundLayer = await PlaygroundLayer.genInstance();
  playgroundLayer.layer.visible = false;
  loadingView.hide();

  appInstance.app.stage.addChild(mainLayer.layer);
  appInstance.app.stage.addChild(playgroundLayer.layer);

  return {
    appInstance,
    mainLayer,
    playgroundLayer,
  };
}

(async () => {
  const gameEventManager = GameEventManager.getInstance();
  const { appInstance, mainLayer, playgroundLayer } = await genInitUI();
  initEventsListener();

  // Game loop
  async function gameLoop() {
    const isGameOver = globalState.isGameOver;

    if (isGameOver) {
      await appInstance.genHandleGameOver();
      requestAnimationFrame(gameLoop);
      return;
    }

    gameEventManager.processEvents();
    if (!globalState.isPlaygroundActive) {
      await mainLayer.update();
    } else {
      await playgroundLayer.update();
    }

    // Render the stage
    appInstance.app.renderer.render(appInstance.app.stage);

    // Request next frame
    requestAnimationFrame(gameLoop);
  }

  // Start the game loop
  gameLoop();
})();
