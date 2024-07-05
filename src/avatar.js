import * as PIXI from "pixi.js";


export const avatarSpeed = 5;


export async function genCreateAvatar() {
    // Load the bunny texture.
    const asset = await PIXI.Assets.load('https://pixijs.com/assets/bunny.png');
    const avatar = new PIXI.Sprite(asset);
    avatar.anchor.set(0.5);
    return avatar;
}

export const avatarKeys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false
};

// Handle keyboard events
function handleKeyDown(e) {
    if (e.key in avatarKeys) {
        avatarKeys[e.key] = true;
    }
}

function handleKeyUp(e) {
    if (e.key in avatarKeys) {
        avatarKeys[e.key] = false;
    }
}

// Add event listeners for keydown and keyup events
window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);


