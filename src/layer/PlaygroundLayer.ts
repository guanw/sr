import * as PIXI from "pixi.js";
import { Bullet } from "../entity/Attacks/Bullet";
import { Wind } from "../entity/Attacks/Wind";
import { GAME_WIDTH, GAME_HEIGHT } from "../utils/Constants";

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
      await PlaygroundLayer.createAnimatedSlime();
    }

    return PlaygroundLayer.instance;
  }

  private static async createAnimatedSlime() {
    const texture = await PIXI.Assets.load(
      "https://guanw.github.io/sr_assets/slime_run.png"
    );
    const frames = [];
    const frameWidth = 32; // Width of a single frame in pixels
    const frameHeight = 32; // Height of a single frame in pixels
    const numberOfFrames = 6; // Number of frames in the animation
    for (let i = 0; i < numberOfFrames; i++) {
      const rect = new PIXI.Rectangle(
        i * frameWidth,
        0,
        frameWidth,
        frameHeight
      );
      frames.push(
        new PIXI.Texture({ source: texture.baseTexture, frame: rect })
      );
    }
    const animatedSlime = new PIXI.AnimatedSprite(frames);
    // Set animation speed (frames per second)
    animatedSlime.animationSpeed = 0.1;
    animatedSlime.play();
    animatedSlime.x = GAME_WIDTH / 2;
    animatedSlime.y = GAME_HEIGHT / 2;

    document.addEventListener("click", async (event) => {
      const targetX = event.clientX;
      const targetY = event.clientY;
      await PlaygroundLayer.attack(targetX, targetY);
    });
    PlaygroundLayer.instance.layer.addChild(animatedSlime);
  }

  private static async attack(targetX: number, targetY: number) {
    const wind = await Wind.create(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      targetX,
      targetY
    );
    PlaygroundLayer.winds.push(wind);
    PlaygroundLayer.instance.layer.addChild(wind.instance);

    const bullet = new Bullet(
      GAME_WIDTH / 2 + 16,
      GAME_HEIGHT / 2 + 16,
      targetX,
      targetY
    );
    PlaygroundLayer.bullets.push(bullet);
    PlaygroundLayer.instance.layer.addChild(bullet.instance);
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
