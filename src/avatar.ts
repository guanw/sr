import * as PIXI from "pixi.js";


export const avatarSpeed: number = 5;

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


