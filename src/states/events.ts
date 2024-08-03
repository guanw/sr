import { Tiling } from "../entity/Tiling";
import { Entity } from "../entity/Entity";
import { Enemy } from '../entity/Enemy';
import { MainLayer } from "../layer/MainLayer";
import { PlaygroundLayer } from "../layer/PlaygroundLayer";

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
    isPlaygroundActive: false,
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

async function handleLayerSwitch(e: KeyboardEvent): Promise<void> {
    if (e.key === 'p') {
        globalState.isPlaygroundActive = !globalState.isPlaygroundActive;
        const mainLayer = await MainLayer.genInstance();
        const playgroundLayer = await PlaygroundLayer.genInstance();
        mainLayer.layer.visible = !globalState.isPlaygroundActive;
        playgroundLayer.layer.visible = globalState.isPlaygroundActive;
    }
}

export function moveUser(background: Tiling, items: Map<string, Entity>, enemies: Map<string, Enemy>) {
    // Move user based on key states
    if (avatarMoveKeys.ArrowLeft) {
        background.moveRight();
        items.forEach((item) => {
            item.moveRight();
        });
        enemies.forEach((enemy) => {
            enemy.moveRight();
        })
    }
    if (avatarMoveKeys.ArrowRight) {
        background.moveLeft();
        items.forEach((item) => {
            item.moveLeft();
        });
        enemies.forEach((enemy) => {
            enemy.moveLeft();
        })
    }
    if (avatarMoveKeys.ArrowUp) {
        background.moveUp();
        items.forEach((item) => {
            item.moveUp();
        });
        enemies.forEach((enemy) => {
            enemy.moveUp();
        })
    }
    if (avatarMoveKeys.ArrowDown) {
        background.moveDown();
        items.forEach((item) => {
            item.moveDown();
        });
        enemies.forEach((enemy) => {
            enemy.moveDown();
        })
    }
}

(function () {
    // Add event listeners for keydown and keyup events
    window.addEventListener('keydown', handleMoveKeyDown);
    window.addEventListener('keyup', handleMoveKeyUp);
    window.addEventListener('keydown', handleToggleMenu);
    window.addEventListener('keydown', handleToggleDebugTool);
    window.addEventListener('keydown', handleLayerSwitch);
}());
