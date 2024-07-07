// avatar.ts

import * as PIXI from "pixi.js";


export const avatarSpeed: number = 5;
const SWORD_WIDTH = 5;
const SWORD_LENGTH = 50;

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
    return avatar;
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

export function performAttack(app: PIXI.Application<PIXI.Renderer>, avatar: PIXI.Sprite, enemies: PIXI.Graphics[]) {
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
        for (const enemy of enemies) {
            // need to check bounds of enemy points with enemy location + displacement of stage
            const enemyPoint = new PIXI.Point(enemy.x + app.stage.x, enemy.y + app.stage.y);
            console.log(`enemies: ${enemies}`);
            if (sword.getBounds().containsPoint(enemyPoint.x, enemyPoint.y)) {
                app.stage.removeChild(enemy);
                enemies.splice(enemies.indexOf(enemy), 1);
            }
        }
    }
}