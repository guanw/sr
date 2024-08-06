import * as PIXI from 'pixi.js';

export class Wind {
    instance: PIXI.AnimatedSprite;
    speed: number;
    direction: { x: number; y: number; };
    private constructor(frames: PIXI.Texture[], x: number, y: number, targetX: number, targetY: number) {
        this.speed = 5;
        this.instance = new PIXI.AnimatedSprite(frames);
        this.instance.animationSpeed = 0.1;
        this.instance.play();
        this.instance.x = 200;
        this.instance.y = 200;

        // Calculate the direction vector
        const dx = targetX - x;
        const dy = targetY - y;
        const length = Math.sqrt(dx * dx + dy * dy);
        this.direction = { x: dx / length, y: dy / length };
    }

    public static async create(targetX: number, targetY: number) {
        const texture = await PIXI.Assets.load('https://guanw.github.io/sr_assets/smoke/px_7.png');
        const frames = [];
        const frameWidth = 64; // Width of a single frame in pixels
        const frameHeight = 64; // Height of a single frame in pixels
        const numberOfFrames = 16; // Number of frames in the animation
        for (let i = 0; i < numberOfFrames; i++) {
            const rect = new PIXI.Rectangle(i * frameWidth, 0, frameWidth, frameHeight);
            frames.push(new PIXI.Texture({source: texture.baseTexture, frame: rect}));
        }

        return new Wind(frames, 400, 300, targetX, targetY);
    }

    move() {
        this.instance.x += this.direction.x * this.speed;
        this.instance.y += this.direction.y * this.speed;
    }
}
