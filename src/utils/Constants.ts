// Application
export const GAME_SIZE = 800;
export const FALLBACK_BACKGROUND_COLOR = 0x1099bb;
export const AVATAR_LOCATION = { x: GAME_SIZE / 2, y: GAME_SIZE / 2 };
export const WORLD_SIZE = GAME_SIZE * 10;

// Loading view
export const LOADING_VIEW_FONT_NAME = "Arial";
export const LOADING_VIEW_FONT_SIZE = 24;
export const LOADING_VIEW_FILL_COLOR = 0xffffff;
export const LOADING_VIEW_TEXT = "Loading...";

// Tiling
export const BASE_TILING_URL =
  "https://guanw.github.io/sr_assets/environment/ground/1.png";
export const RANDOM_TILING_URL =
  "https://guanw.github.io/sr_assets/environment/ground/3.png";
export const PILLAR_TOP_TILING_URL =
  "https://guanw.github.io/sr_assets/environment/pillar/1.png";
export const PILLAR_MIDDLE_TILING_URL =
  "https://guanw.github.io/sr_assets/environment/pillar/2.png";
export const PILLAR_BOTTOM_TILING_URL =
  "https://guanw.github.io/sr_assets/environment/pillar/3.png";
export const SAND_TILING_COUNT = 1000;
export const PILLAR_TILING_COUNT = 100;
export const TILING_SIZE = 16;
export const TILING_LAYER = 1;
export const BACKGROUND_LAYER = 0;

// Avatar
export const AVATAR_SPEED = 3;
export const ENEMY_ATTACK_VALUE = 10;
export const INITIAL_SWORD_SIZE = 50;
export const SWORD_WIDTH = 5;
export const MAX_HEALTH = 100;
export const HP_TEXT_X_OFFSET = 500;
export const HP_TEXT_Y_OFFSET = 500;
export const HP_POTION_INCREASE = 50;
export const AVATAR_DISPLACEMENT = 10;
export const AVATAR_FRAME_SIZE = 48;
export const AVATAR_SIZE = 75;
export const AVATAR_NUM_OF_FRAME = 6;
export const AVATAR_URL = "https://guanw.github.io/sr_assets/avatar.png";
export const AVATAR_ANIMATION_SPEED = 0.1;

// Enemy
export const ENEMY_URL = "https://guanw.github.io/sr_assets/slime_run.png";
export const ENEMY_SPEED = 1;
export const ENEMY_FRAME_SIZE = 32; // Animation frame size
export const ENEMY_ANIMATION_SPEED = 0.1;
export const ENEMY_FRAME_NUMBER = 6; // Number of frames in the animation

// Item
export const ITEM_FRAME_SIZE = 32;
export const BOMB_URL = "https://guanw.github.io/sr_assets/bomb.png";
export const POTION_URL =
  "https://guanw.github.io/sr_assets/items/Potion01.png";

// Attack
export const WIND_URL = "https://guanw.github.io/sr_assets/smoke/px_5.png";
export const WIND_DISPLACEMENT = 32;
export const WIND_FRAME_SIZE = 64;
export const WIND_NUM_OF_FRAME = 16;
export const WIND_SPEED = 5;
export const WIND_ANIMATION_SPEED = 0.1;

// DebugTool
export const DEBUG_BOUND_COLOR = 0x3d85c6;

// Events
export const AVATAR_ATTACK_INTERVAL = 2000;
export const ENEMY_APPEAR_INTERVAL = 3000;
export const ENEMY_ATTACK_INTERVAL = 500;
export const COLLECT_ITEM_INTERVAL = 10;
export const ITEM_RANDOM_APPEAR_INTERVAL = 10000;
