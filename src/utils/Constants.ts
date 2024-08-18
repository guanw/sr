// Application related
export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;
export const FALLBACK_BACKGROUND_COLOR = 0x1099bb;
export const AVATAR_LOCATION = { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 };
export const WORLD_SIZE = GAME_HEIGHT * 10;

// Tiling related
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
export const COLLISION_BACKOFF_OFFSET = 5;

// Avatar related
export const AVATAR_SPEED = 3;
export const COLLECT_ITEM_RANGE = 15;
export const ENEMY_ATTACK_VALUE = 10;
export const INITIAL_SWORD_SIZE = 50;
export const SWORD_WIDTH = 5;
export const MAX_HEALTH = 100;
export const HP_TEXT_X_OFFSET = 500;
export const HP_TEXT_Y_OFFSET = 500;
export const HP_POTION_INCREASE = 50;
export const AVATAR_DISPLACEMENT = 10;
export const AVATAR_FRAME_SIZE = 48;
export const AVATAR_NUM_OF_FRAME = 6;
export const AVATAR_URL = "https://guanw.github.io/sr_assets/avatar.png";
export const AVATAR_ANIMATION_SPEED = 0.1;

// Enemy related
export const ENEMY_SPEED = 1;
export const ENEMY_FRAME_SIZE = 32; // Animation frame size
export const ENEMY_ANIMATION_SPEED = 0.1;
export const ENEMY_FRAME_NUMBER = 6; // Number of frames in the animation
export const ENEMY_ATTACK_AVATAR_RANGE = 10;

// Item related
export const ITEM_FRAME_SIZE = 32;
export const BOMB_URL = "https://guanw.github.io/sr_assets/bomb.png";
export const POTION_URL =
  "https://guanw.github.io/sr_assets/items/Potion01.png";

// Attack related
export const WIND_URL = "https://guanw.github.io/sr_assets/smoke/px_5.png";
export const WIND_DISPLACEMENT = 32;
export const WIND_FRAME_SIZE = 64;
export const WIND_NUM_OF_FRAME = 16;
export const WIND_SPEED = 5;
export const WIND_ANIMATION_SPEED = 0.1;

// DebugTool related
export const DEBUG_BOUND_COLOR = 0x3d85c6;
