import * as PIXI from "pixi.js";
import { Bullet } from "../entity/Attacks/Bullet";
import { Wind } from "../entity/Attacks/Wind";
import { ATTACK_AUDIO_KEY, GAME_WINDOW_SIZE } from "../utils/Constants";
import { ENEMY_ASSET, resourceLoader } from "../ResourceLoader";
import { playSound } from "../audio/Audio";
import { Plugin } from "../PluginManager";
import { globalState } from "../states/events";

const FRAME_SIZE = 32;
const NUMBER_OF_FRAMES = 6;
class PlaygroundLayer implements Plugin {
  public layer: PIXI.Container;
  bullets: Bullet[] = [];
  winds: Wind[] = [];

  constructor() {
    this.layer = new PIXI.Container();
  }

  async genInitialize(): Promise<void> {
    await this.createAnimatedSlime();

    window.addEventListener("keypress", async (e: KeyboardEvent) => {
      if (e.key === "0") {
        playSound(ATTACK_AUDIO_KEY);
      }
    });

    this.layer.visible = false;
  }

  async genUpdate(): Promise<void> {
    if (!globalState.isPlaygroundActive) {
      return;
    }
    this.bullets.forEach((attackPower: Bullet) => {
      attackPower.move();
    });

    this.winds.forEach((wind: Wind) => {
      wind.move();
    });
  }

  private async createAnimatedSlime() {
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
    animatedSlime.x = GAME_WINDOW_SIZE / 2;
    animatedSlime.y = GAME_WINDOW_SIZE / 2;

    document.addEventListener("click", async (event) => {
      const targetX = event.clientX;
      const targetY = event.clientY;
      await this.attack(targetX, targetY);
    });
    this.layer.addChild(animatedSlime);
  }

  private async attack(targetX: number, targetY: number) {
    const wind = await Wind.create(
      GAME_WINDOW_SIZE / 2,
      GAME_WINDOW_SIZE / 2,
      targetX,
      targetY
    );
    this.winds.push(wind);
    this.layer.addChild(wind.instance);

    const bullet = new Bullet(
      GAME_WINDOW_SIZE / 2 + 16,
      GAME_WINDOW_SIZE / 2 + 16,
      targetX,
      targetY
    );
    this.bullets.push(bullet);
    this.layer.addChild(bullet.instance);
  }
}

const playgroundLayer = new PlaygroundLayer();
export { playgroundLayer };
