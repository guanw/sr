import * as PIXI from "pixi.js";
import { Avatar } from '../entity/avatar';
import { Tiling } from "../entity/Tiling";
import { Entity } from "../entity/Entity";

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

export function moveUser(user: Avatar, background: Tiling, items: Map<string, Entity>) {
    // Move user based on key states
    if (avatarMoveKeys.ArrowLeft) {
        user.moveLeft();
        background.moveRight();
        items.forEach((item, _) => {
            item.moveRight();
        });
    }
    if (avatarMoveKeys.ArrowRight) {
        user.moveRight();
        background.moveLeft();
        items.forEach((item, _) => {
            item.moveLeft();
        });
    }
    if (avatarMoveKeys.ArrowUp) {
        user.moveDown();
        background.moveUp();
        items.forEach((item, _) => {
            item.moveUp();
        });
    }
    if (avatarMoveKeys.ArrowDown) {
        user.moveUp();
        background.moveDown();
        items.forEach((item, _) => {
            item.moveDown();
        });
    }
}

(function () {
    // Add event listeners for keydown and keyup events
    window.addEventListener('keydown', handleMoveKeyDown);
    window.addEventListener('keyup', handleMoveKeyUp);
    window.addEventListener('keydown', handleToggleMenu);
    window.addEventListener('keydown', handleToggleDebugTool);
}());
