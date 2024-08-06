import * as PIXI from 'pixi.js';
import { Bullet } from '../entity/Attacks/Bullet';
import { Wind } from '../entity/Attacks/Wind';

export class PlaygroundLayer {
    public static instance: PlaygroundLayer;
    public layer: PIXI.Container;
    static bullets: Bullet[] = [];
    static winds: Wind[] = [];

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
        const animatedSlime = new PIXI.AnimatedSprite(frames);
        // Set animation speed (frames per second)
        animatedSlime.animationSpeed = 0.1;
        animatedSlime.play();
        animatedSlime.x = 400;
        animatedSlime.y = 300;

        document.addEventListener('click', async (event) => {
            const targetX = event.clientX;
            const targetY = event.clientY;
            await PlaygroundLayer.attack(targetX, targetY);
        });
        PlaygroundLayer.instance.layer.addChild(animatedSlime);
    }

    private static async attack(targetX: number, targetY: number) {
        const wind = await Wind.create(targetX, targetY);
        PlaygroundLayer.winds.push(wind);
        PlaygroundLayer.instance.layer.addChild(wind.instance);
    }

    async update() {
        PlaygroundLayer.bullets.forEach((attackPower: Bullet) => {
            attackPower.move();
        });

        PlaygroundLayer.winds.forEach((wind: Wind) => {
            wind.move();
        });
    }
}

