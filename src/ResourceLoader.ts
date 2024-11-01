import * as PIXI from "pixi.js";
import { LoadingView } from "./entity/LoadingView";
import {
  AVATAR_URL,
  BASE_TILING_URL,
  BOMB_URL,
  ENEMY_URL,
  SKILL_SLOT_MAGIC,
  PILLAR_BOTTOM_TILING_URL,
  PILLAR_MIDDLE_TILING_URL,
  PILLAR_TOP_TILING_URL,
  POTION_URL,
  RANDOM_TILING_URL,
  WIND_URL,
  ATTACK_AUDIO,
  ATTACK_AUDIO_KEY,
} from "./utils/Constants";
import { TilingsSerialization } from "./layer/MainLayer";
import { loadSound } from "./audio/Audio";

export const ENEMY_ASSET = "enemy";
export const AVATAR_ASSET = "avatar";
export const BACKGROUND_ASSET = "background";
export const WIND_ASSET = "wind";
export const BOMB_ASSET = "bomb";
export const POTION_ASSET = "potion";
export const BASE_TILING_ASSET = "base_tiling";
export const RANDOM_TILING_ASSET = "random_tiling";
export const PILLAR_TOP_TILING_ASSET = "pillar_top_tiling";
export const PILLAR_MIDDLE_TILING_ASSET = "pillar_middle_tiling";
export const PILLAR_BOTTOM_TILING_ASSET = "pillar_bottom_tiling";
export const SKILL_SLOT_MAGIC_ASSET = "skill_slot_magic";

export interface SetupResponse {
  assets: AssetsResponse;
  tilings: TilingsSerialization;
}

export interface AssetsResponse {
  background_tile_url: string;
  enemy_url: string;
  avatar_url: string;
  wind_url: string;
  bomb_url: string;
  potion_url: string;
  base_tiling_url: string;
  random_tiling_url: string;
  pillar_top_tiling_url: string;
  pillar_middle_tiling_url: string;
  pillar_bottom_tiling_url: string;
  skill_slot_magic: string;
}

export class ResourceLoader {
  private static instance: ResourceLoader;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private resources: Record<string, any> | undefined;

  public static async genInstance(
    assetsResponse: AssetsResponse | null = null
  ): Promise<ResourceLoader> {
    if (!ResourceLoader.instance) {
      ResourceLoader.instance = new ResourceLoader();
      await LoadingView.genInstance();
      await ResourceLoader.genLoadImageResources(assetsResponse);
      await ResourceLoader.genLoadAudioResources();
    }
    return ResourceLoader.instance;
  }

  private static async genLoadAudioResources() {
    await loadSound(ATTACK_AUDIO, ATTACK_AUDIO_KEY);
  }

  private static async genLoadImageResources(
    assetsResponse: AssetsResponse | null = null
  ) {
    PIXI.Assets.add({
      alias: ENEMY_ASSET,
      src: assetsResponse?.enemy_url ?? ENEMY_URL,
    });
    PIXI.Assets.add({
      alias: AVATAR_ASSET,
      src: assetsResponse?.avatar_url ?? AVATAR_URL,
    });
    PIXI.Assets.add({
      alias: BACKGROUND_ASSET,
      src: assetsResponse?.background_tile_url ?? BASE_TILING_URL,
    });
    PIXI.Assets.add({
      alias: WIND_ASSET,
      src: assetsResponse?.wind_url ?? WIND_URL,
    });
    PIXI.Assets.add({
      alias: BOMB_ASSET,
      src: assetsResponse?.bomb_url ?? BOMB_URL,
    });
    PIXI.Assets.add({
      alias: POTION_ASSET,
      src: assetsResponse?.potion_url ?? POTION_URL,
    });
    PIXI.Assets.add({
      alias: BASE_TILING_ASSET,
      src: assetsResponse?.base_tiling_url ?? BASE_TILING_URL,
    });
    PIXI.Assets.add({
      alias: RANDOM_TILING_ASSET,
      src: assetsResponse?.random_tiling_url ?? RANDOM_TILING_URL,
    });
    PIXI.Assets.add({
      alias: PILLAR_TOP_TILING_ASSET,
      src: assetsResponse?.pillar_top_tiling_url ?? PILLAR_TOP_TILING_URL,
    });
    PIXI.Assets.add({
      alias: PILLAR_MIDDLE_TILING_ASSET,
      src: assetsResponse?.pillar_middle_tiling_url ?? PILLAR_MIDDLE_TILING_URL,
    });
    PIXI.Assets.add({
      alias: PILLAR_BOTTOM_TILING_ASSET,
      src: assetsResponse?.pillar_bottom_tiling_url ?? PILLAR_BOTTOM_TILING_URL,
    });
    PIXI.Assets.add({
      alias: SKILL_SLOT_MAGIC_ASSET,
      src: assetsResponse?.skill_slot_magic ?? SKILL_SLOT_MAGIC,
    });

    ResourceLoader.instance.resources = await PIXI.Assets.load([
      ENEMY_ASSET,
      AVATAR_ASSET,
      BACKGROUND_ASSET,
      WIND_ASSET,
      BOMB_ASSET,
      BASE_TILING_ASSET,
      RANDOM_TILING_ASSET,
      PILLAR_TOP_TILING_ASSET,
      PILLAR_MIDDLE_TILING_ASSET,
      PILLAR_BOTTOM_TILING_ASSET,
      SKILL_SLOT_MAGIC_ASSET,
    ]);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getResource(name: string): any | undefined {
    return this.resources ? this.resources[name] : undefined;
  }
}
