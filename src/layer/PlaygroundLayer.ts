import * as PIXI from "pixi.js";
import { Bullet } from "../entity/Attacks/Bullet";
import { Wind } from "../entity/Attacks/Wind";
import { GAME_SIZE } from "../utils/Constants";
import { ENEMY_ASSET, ResourceLoader } from "../ResourceLoader";

const FRAME_SIZE = 32;
const NUMBER_OF_FRAMES = 6;
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
    const resourceLoader = await ResourceLoader.genInstance();
    const texture = resourceLoader.getResource(ENEMY_ASSET);
    const frames = [];
    for (let i = 0; i < NUMBER_OF_FRAMES; i++) {
      const rect = new PIXI.Rectangle(
        i * FRAME_SIZE,
        0,
        FRAME_SIZE,
        FRAME_SIZE
      );
      frames.push(
        new PIXI.Texture({ source: texture.baseTexture, frame: rect })
      );
    }
    const animatedSlime = new PIXI.AnimatedSprite(frames);
    // Set animation speed (frames per second)
    animatedSlime.animationSpeed = 0.1;
    animatedSlime.play();
    animatedSlime.x = GAME_SIZE / 2;
    animatedSlime.y = GAME_SIZE / 2;

    document.addEventListener("click", async (event) => {
      const targetX = event.clientX;
      const targetY = event.clientY;
      await PlaygroundLayer.attack(targetX, targetY);
    });
    PlaygroundLayer.instance.layer.addChild(animatedSlime);
  }

  private static async attack(targetX: number, targetY: number) {
    const wind = await Wind.create(
      GAME_SIZE / 2,
      GAME_SIZE / 2,
      targetX,
      targetY
    );
    PlaygroundLayer.winds.push(wind);
    PlaygroundLayer.instance.layer.addChild(wind.instance);

    const bullet = new Bullet(
      GAME_SIZE / 2 + 16,
      GAME_SIZE / 2 + 16,
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
