import * as PIXI from 'pixi.js';
import { Bullet } from '../entity/Attacks/Bullet';

export class PlaygroundLayer {
    public static instance: PlaygroundLayer;
    public layer: PIXI.Container;
    static bullets: Bullet[] = [];

    constructor() {
        this.layer = new PIXI.Container();
    }

    public static async genInstance(): Promise<PlaygroundLayer> {
        if (!PlaygroundLayer.instance) {
            PlaygroundLayer.instance = new PlaygroundLayer();

            await PlaygroundLayer.createAnimatedSlime()
        }

        return PlaygroundLayer.instance;
    }

    private static async createAnimatedSlime() {
        const texture = await PIXI.Assets.load('https://guanw.github.io/sr_assets/slime_run.png');
        const frames = [];
        const frameWidth = 32; // Width of a single frame in pixels
        const frameHeight = 32; // Height of a single frame in pixels
        const numberOfFrames = 6; // Number of frames in the animation
        for (let i = 0; i < numberOfFrames; i++) {
            const rect = new PIXI.Rectangle(i * frameWidth, 0, frameWidth, frameHeight);
            frames.push(new PIXI.Texture({source: texture.baseTexture, frame: rect}));
        }
        // Create an AnimatedSprite with the frames
        const animatedSlime = new PIXI.AnimatedSprite(frames);
        // Set animation speed (frames per second)
        animatedSlime.animationSpeed = 0.1;
        // Start the animation
        animatedSlime.play();
        animatedSlime.x = 400;
        animatedSlime.y = 300;

        document.addEventListener('click', (event) => {
            const targetX = event.clientX;
            const targetY = event.clientY;
            PlaygroundLayer.attack(targetX, targetY);
        });
        PlaygroundLayer.instance.layer.addChild(animatedSlime);
    }

    private static attack(targetX: number, targetY: number) {
        const attackPower = new Bullet(400+16, 300+16, targetX, targetY);
        PlaygroundLayer.bullets.push(attackPower);
        PlaygroundLayer.instance.layer.addChild(attackPower.instance);
    }

    async update() {
        PlaygroundLayer.bullets.forEach((attackPower: Bullet) => {
            attackPower.move();
        });
    }
}

