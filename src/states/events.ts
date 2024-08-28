import {
  AvatarInitiateAttackEvent,
  KeyDownEvent,
  KeyUpEvent,
} from "./events/GameEvent";
import { GameEventManager } from "../states/events/GameStateManager";
import { ENABLE_MULTI_PLAYER } from "../utils/Knobs";
import SocketClient from "../utils/SocketClient";

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
  if (ENABLE_MULTI_PLAYER) {
    const socketClient = SocketClient.getInstance();
    socketClient.emit("handleUserKeyDown", { key: e.key });
  }
}

function handleKeyUp(e: KeyboardEvent): void {
  const gameEventManager = GameEventManager.getInstance();
  gameEventManager.emit(new KeyUpEvent(e));
  if (ENABLE_MULTI_PLAYER) {
    const socketClient = SocketClient.getInstance();
    socketClient.emit("handleUserKeyUp", { key: e.key });
  }
}

export async function genHandleAvatarAttack(e: MouseEvent) {
  const gameEventManager = GameEventManager.getInstance();
  gameEventManager.emit(new AvatarInitiateAttackEvent(e));
}

export async function initEventsListener() {
  // Add event listeners for keydown and keyup events
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
  window.addEventListener("click", genHandleAvatarAttack);
}
