import { globalState, initEventsListener } from "./states/events";
import Application from "./entity/Application";
import { mainLayer } from "./layer/MainLayer";
import { playgroundLayer } from "./layer/PlaygroundLayer";
import { GameEventManager } from "./states/events/GameStateManager";
import { resourceLoader, SetupResponse } from "./ResourceLoader";
import { loadingView } from "./entity/LoadingView";
import { background } from "./entity/Background";
import { fetchSetupData } from "./utils/SocketClient";
import { ENABLE_MULTI_PLAYER } from "./utils/Knobs";
import { tilingsStateManager } from "./states/TilingsStateManager";
import pluginManager from "./PluginManager";
import { debugTool } from "./internal/DebugTool";
import { skillSlot } from "./entity/SkillSlot";

(async () => {
  const gameEventManager = GameEventManager.getInstance();
  const { appInstance } = await genSetupGameEnvironment();

  // Game loop
  async function gameLoop() {
    const isGameOver = globalState.isGameOver;

    if (isGameOver) {
      await appInstance.genHandleGameOver();
      requestAnimationFrame(gameLoop);
      return;
    }

    gameEventManager.processEvents();

    await pluginManager.genUpdateAll();

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

  // fetch setup data from server if possible
  let setupResponse: SetupResponse | null = null;
  if (ENABLE_MULTI_PLAYER) {
    setupResponse = await fetchSetupData();
  }

  // initially load assets
  await resourceLoader.genInitialize(setupResponse?.assets);

  // set up game layer + playground layer
  await background.genInitialize();
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

  // register and initialize plugins that's not dependent on multi-player states
  pluginManager.registerPlugin(debugTool);
  pluginManager.registerPlugin(skillSlot);
  pluginManager.registerPlugin(mainLayer);
  pluginManager.registerPlugin(playgroundLayer);
  await pluginManager.genInitializeAll();

  // hide loading view
  loadingView.hide();

  return {
    appInstance,
  };
}
