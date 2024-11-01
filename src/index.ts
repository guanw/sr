import { globalState, initEventsListener } from "./states/events";
import Application from "./entity/Application";
import { MainLayer } from "./layer/MainLayer";
import { PlaygroundLayer } from "./layer/PlaygroundLayer";
import { GameEventManager } from "./states/events/GameStateManager";
import { ResourceLoader, SetupResponse } from "./ResourceLoader";
import { LoadingView } from "./entity/LoadingView";
import { Background } from "./entity/Background";
import { fetchSetupData } from "./utils/SocketClient";
import { ENABLE_MULTI_PLAYER } from "./utils/Knobs";
import { tilingsStateManager } from "./states/TilingsStateManager";

(async () => {
  const gameEventManager = GameEventManager.getInstance();
  const { appInstance, mainLayer, playgroundLayer } =
    await genSetupGameEnvironment();

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

async function genSetupGameEnvironment() {
  // set up app instance and render loading view
  const appInstance = await Application.genInstance();
  const loadingView = await LoadingView.genInstance(appInstance.app.stage);

  // fetch setup data from server if possible
  let setupResponse: SetupResponse | null = null;
  if (ENABLE_MULTI_PLAYER) {
    setupResponse = await fetchSetupData();
  }

  // initially load assets
  await ResourceLoader.genInstance(setupResponse?.assets);

  // set up game layer + playground layer
  await Background.genInstance();
  const mainLayer = await MainLayer.genInstance();
  const playgroundLayer = await PlaygroundLayer.genInstance();
  mainLayer.layer.visible = false;
  playgroundLayer.layer.visible = false;
  appInstance.app.stage.addChild(mainLayer.layer);
  appInstance.app.stage.addChild(playgroundLayer.layer);

  // set up tiles
  if (ENABLE_MULTI_PLAYER) {
    await tilingsStateManager.genInitializeOnlineTilings(
      setupResponse?.tilings
    );
  } else {
    await tilingsStateManager.genInitializeOfflineTilings();
  }

  // init event listener for input
  initEventsListener();

  // hide loading view
  loadingView.hide();

  return {
    appInstance,
    mainLayer,
    playgroundLayer,
  };
}
