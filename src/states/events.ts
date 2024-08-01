import * as PIXI from "pixi.js";
import { Avatar } from '../entity/avatar';

const avatarMoveKeys: { [key: string]: boolean } = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false
};

export const globalState = {
    isGamePaused: false,
    isGameOver: false,
    isDebugToolVisible: false,
};

// Handle keyboard events to move avatar
function handleMoveKeyDown(e: KeyboardEvent): void {
    if (e.key in avatarMoveKeys) {
        avatarMoveKeys[e.key] = true;
    }
}

function handleMoveKeyUp(e: KeyboardEvent): void {
    if (e.key in avatarMoveKeys) {
        avatarMoveKeys[e.key] = false;
    }
}

function handleToggleMenu(e: KeyboardEvent): void {
    if (e.key === 'm' || e.key === 'M') {
        globalState.isGamePaused = !globalState.isGamePaused;
    }
}

function handleToggleDebugTool(e: KeyboardEvent): void {
    if (e.key === 'd' || e.key === 'D') {
        globalState.isDebugToolVisible = !globalState.isDebugToolVisible;
    }
}

export function moveUser(user: Avatar, background: PIXI.TilingSprite) {
    // Move user based on key states
    if (avatarMoveKeys.ArrowLeft) {
        user.moveLeft(background);
    }
    if (avatarMoveKeys.ArrowRight) {
        user.moveRight(background);
    }
    if (avatarMoveKeys.ArrowUp) {
        user.moveDown(background);
    }
    if (avatarMoveKeys.ArrowDown) {
        user.moveUp(background);
    }
}

(function () {
    // Add event listeners for keydown and keyup events
    window.addEventListener('keydown', handleMoveKeyDown);
    window.addEventListener('keyup', handleMoveKeyUp);
    window.addEventListener('keydown', handleToggleMenu);
    window.addEventListener('keydown', handleToggleDebugTool);
}());
