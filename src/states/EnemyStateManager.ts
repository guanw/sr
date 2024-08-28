import { v4 as uuidv4 } from "uuid";
import { Enemy } from "../entity/Enemy";
import { EnemiesSerialization, MainLayer } from "../layer/MainLayer";
import { GAME_HEIGHT, GAME_WIDTH } from "../utils/Constants";

class EnemiesStateManager {
  private enemies: Map<string, Enemy>;

  public constructor() {
    this.enemies = new Map<string, Enemy>();
  }

  public async genAddEnemy() {
    const mainLayer = await MainLayer.genInstance();
    const uuid = uuidv4();
    this.enemies.set(uuid, await Enemy.create(mainLayer.layer));
  }

  public async genAddEnemyAtPos(key: string, x: number, y: number) {
    const mainLayer = await MainLayer.genInstance();
    this.enemies.set(key, await Enemy.create(mainLayer.layer, x, y));
  }

  public getEnemies(): Map<string, Enemy> {
    return this.enemies;
  }

  public setEnemyPos(key: string, offsetX: number, offsetY: number): void {
    const enemy = this.enemies.get(key);
    enemy?.setPos(GAME_WIDTH / 2 + offsetX, GAME_HEIGHT / 2 + offsetY);
  }

  public async refreshAllEnemies(
    enemies: EnemiesSerialization,
    latestAvatarAbsoluteX: number,
    latestAvatarAbsoluteY: number
  ) {
    const mainLayer = await MainLayer.genInstance();
    const previousEnemiesState = enemiesStateManager.getEnemies();
    // update existing enemies with new x,y
    previousEnemiesState.forEach((_, key) => {
      if (enemies[key] != undefined) {
        const latestEnemyAbsoluteX = enemies[key].x;
        const latestEnemyAbsoluteY = enemies[key].y;
        const offsetX = latestAvatarAbsoluteX - latestEnemyAbsoluteX;
        const offsetY = latestAvatarAbsoluteY - latestEnemyAbsoluteY;
        this.setEnemyPos(key, -offsetX, -offsetY);
      }
    });

    // remove enemies that's doesn't exist in serialization
    previousEnemiesState.forEach((_, key) => {
      if (enemies[key] !== undefined) {
        const enemy = previousEnemiesState.get(key);
        enemy?.destroy(mainLayer.layer);
      }
    });

    // add new enemies from serialization
    Object.keys(enemies).forEach(async (key) => {
      if (!previousEnemiesState.has(key)) {
        const { x, y } = enemies[key];
        await this.genAddEnemyAtPos(key, x, y);
      }
    });
  }

  public async destroy(mainLayer: MainLayer, enemyKey: string) {
    const enemy = this.enemies.get(enemyKey);
    enemy?.destroy(mainLayer.layer);
  }

  public async destroyAllEnemies(): Promise<void> {
    const mainLayer = await MainLayer.genInstance();
    for (const key in this.enemies) {
      this.destroy(mainLayer, key);
    }
    this.enemies.clear();
  }
}

const enemiesStateManager = new EnemiesStateManager();
export default enemiesStateManager;
