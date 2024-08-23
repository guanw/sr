import {
  AvatarInitiateAttackEvent,
  KeyDownEvent,
  KeyUpEvent,
} from "./events/GameEvent";
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
