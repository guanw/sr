import * as PIXI from "pixi.js";
import { Avatar, AVATAR_SPEED } from './avatar';

const avatarMoveKeys: { [key: string]: boolean } = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false
};

export const globalState = {
    isGamePaused: false,
    isGameOver: false
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

export function moveUser(app: PIXI.Application<PIXI.Renderer>, user: Avatar) {
    // Move user based on key states
    if (avatarMoveKeys.ArrowLeft) {
        app.stage.x += AVATAR_SPEED;
        user.moveLeft();
    }
    if (avatarMoveKeys.ArrowRight) {
        app.stage.x -= AVATAR_SPEED;
        user.moveRight();
    }
    if (avatarMoveKeys.ArrowUp) {
        app.stage.y += AVATAR_SPEED;
        user.moveDown();
    }
    if (avatarMoveKeys.ArrowDown) {
        app.stage.y -= AVATAR_SPEED;
        user.moveUp();
    }
}

(function () {
    // Add event listeners for keydown and keyup events
    window.addEventListener('keydown', handleMoveKeyDown);
    window.addEventListener('keyup', handleMoveKeyUp);
    window.addEventListener('keydown', handleToggleMenu);
}());
