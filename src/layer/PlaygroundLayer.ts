import * as PIXI from "pixi.js";
import { ATTACK_AUDIO_KEY, GAME_WINDOW_SIZE } from "../utils/Constants";
import { ENEMY_ASSET, resourceLoader } from "../ResourceLoader";
import { playSound } from "../audio/Audio";
import { Plugin } from "../PluginManager";
import { globalState } from "../states/events";

const FRAME_SIZE = 32;
const NUMBER_OF_FRAMES = 6;
class PlaygroundLayer implements Plugin {
  public layer: PIXI.Container;

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

    this.layer.addChild(animatedSlime);
  }
}

const playgroundLayer = new PlaygroundLayer();
export { playgroundLayer };
