import { MainLayer } from "../layer/MainLayer";
import { PlaygroundLayer } from "../layer/PlaygroundLayer";
import attackStateManager from "./AttackStateManager";
import { AVATAR_LOCATION, WIND_DISPLACEMENT } from "../utils/Constants";
import { Wind } from "../entity/Attacks/Wind";
import { KeyDownEvent, KeyUpEvent } from "./events/GameEvent";
import { GameEventManager } from "../states/events/GameStateManager";

export const avatarKeys: { [key: string]: boolean } = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  ArrowDown: false,
};

export const globalState = {
  isGamePaused: false,
  isGameOver: false,
  isDebugToolVisible: false,
  isPlaygroundActive: false,
};

function handleKeyDown(e: KeyboardEvent): void {
  const gameEventManager = GameEventManager.getInstance();
  gameEventManager.emit(new KeyDownEvent(e));
}

function handleKeyUp(e: KeyboardEvent): void {
  const gameEventManager = GameEventManager.getInstance();
  gameEventManager.emit(new KeyUpEvent(e));
}

export async function genHandleAvatarAttack(event: MouseEvent) {
  // TODO manage avatar attack via GameStateManager
  const wind = await Wind.create(
    AVATAR_LOCATION.x - WIND_DISPLACEMENT,
    AVATAR_LOCATION.y - WIND_DISPLACEMENT,
    event.clientX,
    event.clientY
  );
  attackStateManager.addAttack(wind);
  MainLayer.instance.layer.addChild(wind.instance);
}

(function () {
  // Add event listeners for keydown and keyup events
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
  window.addEventListener("click", genHandleAvatarAttack);
})();
