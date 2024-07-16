// avatar.ts

import * as PIXI from "pixi.js";
import { Enemies } from "./enemy";
import { globalState } from './globalState';

export const AVATAR_SPEED: number = 5;
const ENEMY_ATTACK_RANGE = 3;
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

export class Avatar {
    private sprite: PIXI.Sprite;
    private app: PIXI.Application;

    private constructor(app: PIXI.Application, texture: PIXI.Texture) {
        this.app = app;
        const appWidth: number = app.screen.width;
        const appHeight: number = app.screen.height;
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.anchor.set(0.5);
        this.sprite.x = appWidth / 2;
        this.sprite.y = appHeight / 2;
        app.stage.addChild(this.sprite);
        renderAvatarHP(this.sprite);
        initializeHPSystem(app);
    }

    public static async create(app: PIXI.Application) :Promise<Avatar> {
        const asset = await PIXI.Assets.load('https://pixijs.com/assets/bunny.png');
        return new Avatar(app, asset)
    }

    public moveLeft() {
        this.sprite.x -= AVATAR_SPEED;
    }

    public moveRight() {
        this.sprite.x += AVATAR_SPEED;
    }

    public moveDown() {
        this.sprite.y -= AVATAR_SPEED;
    }

    public moveUp() {
        this.sprite.y += AVATAR_SPEED;
    }

    public updateHPPosition() {
        avatarMetaData.hp_system.bar.x = this.sprite.x - HP_TEXT_X_OFFSET;
        avatarMetaData.hp_system.bar.y = this.sprite.y - HP_TEXT_Y_OFFSET;
    }

    public getX() {
        return this.sprite.x;
    }

    public getY() {
        return this.sprite.y;
    }

    public performAttack( enemies: Enemies) {
        if (this.sprite && this.sprite.parent) {
            // Create sword swing effect (e.g., line)
            const sword = new PIXI.Graphics();
            sword.moveTo(this.sprite.x, this.sprite.y);
            sword.lineTo(SWORD_LENGTH + this.sprite.x, this.sprite.y);
            sword.stroke({ width: SWORD_WIDTH, color: 0xffd900 });


            this.app.stage.addChild(sword);
            // Remove sword after a short delay e.g 200ms
            setTimeout(() => {
                this.app.stage.removeChild(sword);
            }, 200);

            // Check for collision with enemies
            const keys = Object.keys(enemies);
            keys.forEach((key) => {
                const enemy = enemies[key];
                const enemyPoint = new PIXI.Point(enemy.x + this.app.stage.x, enemy.y + this.app.stage.y);
                if (sword.getBounds().containsPoint(enemyPoint.x, enemyPoint.y)) {
                    this.app.stage.removeChild(enemy);
                    delete enemies[key];
                }
            })
        }
    }

    public checkCollisionAndReduceHealth(app: PIXI.Application<PIXI.Renderer>, enemies: Enemies) {
        const keys = Object.keys(enemies);
        keys.forEach((key) => {
            const enemy = enemies[key];
            const enemyPoint = new PIXI.Point(enemy.x, enemy.y);
            const distance = Math.sqrt((this.sprite.x - enemyPoint.x) ** 2 + (this.sprite.y - enemyPoint.y) ** 2);
            if (distance < ENEMY_ATTACK_RANGE) {
                this.updateHealth(avatarMetaData.hp_system.value - 10);
                if (avatarMetaData.hp_system.value <= 0) {
                    this.updateHealth(0);
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

    private updateHealth(newHealth: number) {
        avatarMetaData.hp_system.value = newHealth;
        healthBar.width = (avatarMetaData.hp_system.value / 100) * 100;
    }
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
    avatarMetaData.hp_system.bar.x = avatar.x - HP_TEXT_X_OFFSET;
    avatarMetaData.hp_system.bar.y = avatar.y - HP_TEXT_Y_OFFSET;
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