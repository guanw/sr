// avatar.ts

import * as PIXI from "pixi.js";
import { Enemy } from "./Enemy";
import { globalState } from "../states/events";
import { Entity } from './Entity';
import Application from "./Application";
import { MainLayer } from "../layer/MainLayer";

const COLLECT_ITEM_RANGE = 15;

const ENEMY_ATTACK_VALUE = 10;
const SWORD_WIDTH = 5;
const SWORD_LENGTH = 50;
const MAX_HEALTH = 100;
const HP_TEXT_X_OFFSET = 500;
const HP_TEXT_Y_OFFSET = 500;
const avatarMetaData = {
    hp_system: {
        value: MAX_HEALTH,
        bar: new PIXI.Graphics(),
    }
};

export class Avatar extends Entity {
    public sprite: PIXI.Sprite;
    static healthBarContainer = new PIXI.Graphics();
    static healthBar = new PIXI.Graphics();


    private constructor(app: PIXI.Application, texture: PIXI.Texture) {
        super();
        const appWidth: number = app.screen.width;
        const appHeight: number = app.screen.height;
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.anchor.set(0.5);
        this.sprite.x = appWidth / 2;
        this.sprite.y = appHeight / 2;
        app.stage.addChild(this.sprite);
        this.renderAvatarHP();
    }

    public static async create() :Promise<Avatar> {
        const instance = await Application.genInstance();
        const asset = await PIXI.Assets.load('https://pixijs.com/assets/bunny.png');
        const avatar = new Avatar(instance.app, asset);
        await this.genInitializeHPSystem();
        return avatar;
    }

    public getX() {
        return this.sprite.x;
    }

    public getY() {
        return this.sprite.y;
    }

    /**
     * collision with enemy
     */
    public async genCheckCollisionWithEnemyAndReduceHealth(enemies: Map<string, Enemy>) {
        enemies.forEach(async (_, key) => {
            const enemy = enemies.get(key);
            if (enemy === undefined) {
                return;
            }
            if (enemy.isCollidedWith(this)) {
                await this.genUponCollide();
            }
        })
    }

    // override avatar genUponCollide with enemy
    async genUponCollide(): Promise<void> {
        const instance = await Application.genInstance();
        const app = instance.app;
        this.updateHealth(avatarMetaData.hp_system.value - ENEMY_ATTACK_VALUE);
        if (avatarMetaData.hp_system.value <= 0) {
            this.updateHealth(0);
            globalState.isGameOver = true;
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

    public async genCheckCollectingItems(items: Map<string, Entity>) {
        items.forEach(async (_, key) => {
            const item = items.get(key);
            if (item === undefined) {
                return;
            }
            if (item.isCollidedWith(this, COLLECT_ITEM_RANGE)) {
                await item.genUponCollide();
                items.delete(key);
            }
        });
    }

    public static async genInitializeHPSystem() {
        avatarMetaData.hp_system.bar = this.healthBarContainer;
        this.healthBarContainer.beginFill(0xff0000);
        this.healthBarContainer.drawRect(0, 0, 100, 10);
        this.healthBarContainer.endFill();
        this.healthBarContainer.x = 80;
        this.healthBarContainer.y = 110;

        const style = new PIXI.TextStyle({
            fontSize: 12,
        });
        const healthText = new PIXI.Text({
            text: 'hp',
            style,
        });
        healthText.x = -20;
        healthText.y = -2;
        this.healthBarContainer.addChild(healthText);


        this.healthBar.beginFill(0x00ff00);
        this.healthBar.drawRect(0, 0, 100, 10);
        this.healthBar.endFill();
        this.healthBarContainer.addChild(this.healthBar);

        const instance = await Application.genInstance();
        // add health bar container
        instance.app.stage.addChild(avatarMetaData.hp_system.bar);
    }

    private updateHealth(newHealth: number) {
        avatarMetaData.hp_system.value = newHealth;
        Avatar.healthBar.width = (avatarMetaData.hp_system.value / 100) * 100;
    }

    private renderAvatarHP() {
        avatarMetaData.hp_system.bar.x = this.sprite.x - HP_TEXT_X_OFFSET;
        avatarMetaData.hp_system.bar.y = this.sprite.y - HP_TEXT_Y_OFFSET;
    }

    public async genPerformAttack(enemies: Map<string, Enemy>) {
        const instance = await Application.genInstance();
        const mainLayer = await MainLayer.genInstance();
        if (this.sprite && this.sprite.parent) {
            const sword = new Avatar.Sword(instance.app, mainLayer.layer, this.sprite);

            // Check for collision with enemies
            enemies.forEach((_, key) => {
                const enemy = enemies.get(key);
                if (enemy === undefined) {
                    return;
                }

                if (sword.isCollidedWith(enemy)) {
                    enemy.destroy(mainLayer.layer);
                    enemies.delete(key);
                }
            })
        }
    }

    public getHealth_DEBUG_TOOL_ONLY(): number {
        return avatarMetaData.hp_system.value;
    }

    static Sword = class extends Entity {
        private app: PIXI.Application;
        private container: PIXI.Container;
        public constructor(app: PIXI.Application, container: PIXI.Container, avatar: PIXI.Sprite) {
            super();
            this.app = app;
            this.container = container;
            this.instance = new PIXI.Graphics();
            this.instance.moveTo(avatar.x, avatar.y);
            this.instance.lineTo(SWORD_LENGTH + avatar.x, avatar.y);
            this.instance.stroke({ width: SWORD_WIDTH, color: 0xffd900 });
            this.container.addChild(this.instance);
            // Remove sword after a short delay e.g 200ms
            setTimeout(() => {
                this.container.removeChild(this.instance);
            }, 200);
        }

        getX(): number {
            throw new Error("should not be called with collide(ent: Entity) being overriden");
        }
        getY(): number {
            throw new Error("should not be called with collide(ent: Entity) being overriden");
        }

        isCollidedWith(ent: Entity): boolean {
            const enemyPoint = new PIXI.Point(ent.getX() + this.app.stage.x, ent.getY() + this.app.stage.y);
            return this.instance.getBounds().containsPoint(enemyPoint.x, enemyPoint.y)
        }
    }
}