import {
  AvatarInitiateAttackEvent,
  KeyDownEvent,
  KeyUpEvent,
} from "./events/GameEvent";
import { GameEventManager } from "../states/events/GameStateManager";
import { ENABLE_MULTI_PLAYER } from "../utils/Knobs";
import { SocketClient } from "../utils/SocketClient";
import { Avatar } from "../entity/Avatar";
import { HANDLE_USER_KEY_DOWN, HANDLE_USER_KEY_UP } from "../utils/Constants";

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

export function pauseGame() {
  globalState.isGamePaused = true;
}

export function resumeGame() {
  globalState.isGamePaused = false;
}

export function isGamePaused() {
  return globalState.isGamePaused;
}

export function setIsGamePaused(paused: boolean) {
  globalState.isGamePaused = paused;
}

async function handleKeyDown(e: KeyboardEvent): Promise<void> {
  const gameEventManager = GameEventManager.getInstance();
  gameEventManager.emit(new KeyDownEvent(e));
  if (ENABLE_MULTI_PLAYER) {
    const socketClient = SocketClient.getInstance();
    const avatar = await Avatar.genInstance();
    socketClient.emit(HANDLE_USER_KEY_DOWN, {
      key: e.key,
      avatarId: socketClient.getSocketId(),
      room: avatar.room,
    });
  }
}

async function handleKeyUp(e: KeyboardEvent): Promise<void> {
  const gameEventManager = GameEventManager.getInstance();
  gameEventManager.emit(new KeyUpEvent(e));
  if (ENABLE_MULTI_PLAYER) {
    const socketClient = SocketClient.getInstance();
    const avatar = await Avatar.genInstance();
    socketClient.emit(HANDLE_USER_KEY_UP, {
      key: e.key,
      avatarId: socketClient.getSocketId(),
      room: avatar.room,
    });
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
