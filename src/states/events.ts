import { Tiling } from "../entity/Tiling";
import { Entity } from "../entity/Entity";
import { Enemy } from '../entity/Enemy';
import { MainLayer } from "../layer/MainLayer";
import { PlaygroundLayer } from "../layer/PlaygroundLayer";
import attackStateManager from "./AttackStateManager";
import { AVATAR_LOCATION, WIND_DISPLACEMENT } from "../utils/Constants";
import { Wind } from "../entity/Attacks/Wind";

const avatarKeys: { [key: string]: boolean } = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false,
    '1': false,
};

export const globalState = {
    isGamePaused: false,
    isGameOver: false,
    isDebugToolVisible: false,
    isPlaygroundActive: false,
};

// Handle keyboard events to move avatar
function handleAvatarKeyDown(e: KeyboardEvent): void {
    if (e.key in avatarKeys) {
        avatarKeys[e.key] = true;
    }
}

function handleAvatarKeyUp(e: KeyboardEvent): void {
    if (e.key in avatarKeys) {
        avatarKeys[e.key] = false;
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

export async function genMoveUser(items: Map<string, Entity>, enemies: Map<string, Enemy>) {
    const background = await Tiling.genInstance()
    // Move user based on key states
    if (avatarKeys.ArrowLeft) {
        background.moveRight();
        items.forEach((item) => {
            item.moveRight();
        });
        enemies.forEach((enemy) => {
            enemy.moveRight();
        })
    }
    if (avatarKeys.ArrowRight) {
        background.moveLeft();
        items.forEach((item) => {
            item.moveLeft();
        });
        enemies.forEach((enemy) => {
            enemy.moveLeft();
        })
    }
    if (avatarKeys.ArrowUp) {
        background.moveDown();
        items.forEach((item) => {
            item.moveDown();
        });
        enemies.forEach((enemy) => {
            enemy.moveDown();
        })
    }
    if (avatarKeys.ArrowDown) {
        background.moveUp();
        items.forEach((item) => {
            item.moveUp();
        });
        enemies.forEach((enemy) => {
            enemy.moveUp();
        })
    }
}

export async function genHandleAvatarAttack(event: MouseEvent) {
    const wind = await Wind.create(AVATAR_LOCATION.x-WIND_DISPLACEMENT, AVATAR_LOCATION.y-WIND_DISPLACEMENT, event.clientX, event.clientY);
    attackStateManager.addAttack(wind);
    MainLayer.instance.layer.addChild(wind.instance);
}

(function () {
    // Add event listeners for keydown and keyup events
    window.addEventListener('keydown', handleAvatarKeyDown);
    window.addEventListener('keyup', handleAvatarKeyUp);
    window.addEventListener('keydown', handleToggleMenu);
    window.addEventListener('keydown', handleToggleDebugTool);
    window.addEventListener('keydown', handleLayerSwitch);
    window.addEventListener('click', genHandleAvatarAttack);
}());
