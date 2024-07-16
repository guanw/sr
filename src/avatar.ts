// avatar.ts

import * as PIXI from "pixi.js";
import { Enemies } from "./enemy";
import { globalState } from './globalState';

export const avatarSpeed: number = 5;
const SWORD_WIDTH = 5;
const SWORD_LENGTH = 50;
const MAX_HEALTH = 100;
const HP_TEXT_X_OFFSET = 375;
const HP_TEXT_Y_OFFSET = 275;
const avatarMetaData = {
    hp_system: {
        value: MAX_HEALTH,
        bar: new PIXI.Graphics(),
    }
};

export async function genCreateAvatar(app: PIXI.Application<PIXI.Renderer>): Promise<PIXI.Sprite> {
    // Load the bunny texture.
    const appWidth: number = app.screen.width;
    const appHeight: number = app.screen.height;
    const asset = await PIXI.Assets.load('https://pixijs.com/assets/bunny.png');
    const avatar = new PIXI.Sprite(asset);
    avatar.anchor.set(0.5);

    avatar.x = appWidth / 2;
    avatar.y = appHeight / 2;
    app.stage.addChild(avatar);
    renderAvatarHP(avatar);

    initializeHPSystem(app);

    return avatar;
}

const healthBarContainer = new PIXI.Graphics();
const healthBar = new PIXI.Graphics();

function initializeHPSystem(app: PIXI.Application<PIXI.Renderer>) {


    avatarMetaData.hp_system.bar = healthBarContainer;
    healthBarContainer.beginFill(0xff0000);
    healthBarContainer.drawRect(0, 0, 100, 10);
    healthBarContainer.endFill();
    healthBarContainer.x = 80;
    healthBarContainer.y = 110;

    const style = new PIXI.TextStyle({
        fontSize: 12,
    });
    const healthText = new PIXI.Text({
        text: 'hp',
        style,
    });
    healthText.x = -20;
    healthText.y = -2;
    healthBarContainer.addChild(healthText);


    healthBar.beginFill(0x00ff00);
    healthBar.drawRect(0, 0, 100, 10);
    healthBar.endFill();
    healthBarContainer.addChild(healthBar);

    // add health bar container
    app.stage.addChild(avatarMetaData.hp_system.bar);
}

function renderAvatarHP(avatar: PIXI.Sprite) {
    updateAvatarHPPosition(avatar.x, avatar.y);
}

export function updateAvatarHPPosition(displacementX: number, displacementY: number) {
    avatarMetaData.hp_system.bar.x = displacementX - HP_TEXT_X_OFFSET;
    avatarMetaData.hp_system.bar.y = displacementY - HP_TEXT_Y_OFFSET;
}

export const avatarKeys: { [key: string]: boolean } = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false
};

// Handle keyboard events
function handleKeyDown(e: KeyboardEvent): void {
    if (e.key in avatarKeys) {
        avatarKeys[e.key] = true;
    }
}

function handleKeyUp(e: KeyboardEvent): void {
    if (e.key in avatarKeys) {
        avatarKeys[e.key] = false;
    }
}

// Add event listeners for keydown and keyup events
window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);



export function performAttack(app: PIXI.Application<PIXI.Renderer>, avatar: PIXI.Sprite, enemies: Enemies) {
    if (avatar && avatar.parent) {
        // Create sword swing effect (e.g., line)
        const sword = new PIXI.Graphics();
        sword.moveTo(avatar.x, avatar.y);
        sword.lineTo(SWORD_LENGTH + avatar.x, avatar.y);
        sword.stroke({ width: SWORD_WIDTH, color: 0xffd900 });


        app.stage.addChild(sword);
        // Remove sword after a short delay e.g 200ms
        setTimeout(() => {
            app.stage.removeChild(sword);
        }, 200);

        // Check for collision with enemies
        const keys = Object.keys(enemies);
        keys.forEach((key) => {
            const enemy = enemies[key];
            const enemyPoint = new PIXI.Point(enemy.x + app.stage.x, enemy.y + app.stage.y);
            if (sword.getBounds().containsPoint(enemyPoint.x, enemyPoint.y)) {
                app.stage.removeChild(enemy);
                delete enemies[key];
            }
        })
    }
}

export function updateHealth(newHealth: number) {
    avatarMetaData.hp_system.value = newHealth;
    healthBar.width = (avatarMetaData.hp_system.value / 100) * 100;
}

export function checkCollisionAndReduceHealth(app: PIXI.Application<PIXI.Renderer>, avatar: PIXI.Sprite, enemies: Enemies) {
    const keys = Object.keys(enemies);
    keys.forEach((key) => {
        const enemy = enemies[key];
        const enemyPoint = new PIXI.Point(enemy.x, enemy.y);
        const distance = Math.sqrt((avatar.x - enemyPoint.x) ** 2 + (avatar.y - enemyPoint.y) ** 2);
        if (distance < 3) {
            updateHealth(avatarMetaData.hp_system.value - 10);
            if (avatarMetaData.hp_system.value <= 0) {
                updateHealth(0);
                globalState.isGamePaused = true;
                const gameOverText = new PIXI.Text('Game Over', {
                    fontSize: 48,
                    fill: 0xff0000,
                    align: 'center'
                });
                gameOverText.anchor.set(0.5);
                gameOverText.x = (app.screen.width / 2) - app.stage.x;
                gameOverText.y = (app.screen.height / 2) - app.stage.y;
                app.stage.addChild(gameOverText);
            }
        }
    })
}