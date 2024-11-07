import { v4 as uuidv4 } from "uuid";
import { Enemy } from "../entity/Enemy";
import { Avatar } from "../entity/Avatar";
import { EnemiesSerialization, mainLayer } from "../layer/MainLayer";

class EnemiesStateManager {
  private enemies: Map<string, Enemy>;

  public constructor() {
    this.enemies = new Map<string, Enemy>();
  }

  public async genAddEnemy() {
    const uuid = uuidv4();
    this.enemies.set(uuid, await Enemy.create(mainLayer.layer));
  }

  public getEnemies(): Map<string, Enemy> {
    return this.enemies;
  }

  public async syncAllEnemies(
    enemies: EnemiesSerialization,
    latestAvatarAbsoluteX: number,
    latestAvatarAbsoluteY: number
  ) {
    const avatar = await Avatar.genInstance();
    const previousEnemiesState = enemiesStateManager.getEnemies();

    // update existing enemies with new x,y
    previousEnemiesState.forEach((_, key) => {
      if (enemies[key] != undefined && previousEnemiesState.has(key)) {
        const latestEnemyAbsoluteX = enemies[key].x;
        const latestEnemyAbsoluteY = enemies[key].y;
        const previousEnemyAbsoluteX = previousEnemiesState.get(key)!.getX();
        const previousEnemyAbsoluteY = previousEnemiesState.get(key)!.getY();

        const previousAvatarAbsoluteX = avatar.getX();
        const previousAvatarAbsoluteY = avatar.getY();

        const relativeX = -(
          latestAvatarAbsoluteX -
          previousAvatarAbsoluteX -
          (latestEnemyAbsoluteX - previousEnemyAbsoluteX)
        );
        const relativeY = -(
          latestAvatarAbsoluteY -
          previousAvatarAbsoluteY -
          (latestEnemyAbsoluteY - previousEnemyAbsoluteY)
        );
        this.setRelativePos(key, relativeX, relativeY);
      }
    });

    // remove enemies that don't exist in serialization
    previousEnemiesState.forEach((_, key) => {
      if (enemies[key] === undefined) {
        const enemy = previousEnemiesState.get(key);
        enemy?.destroy(mainLayer.layer);
      }
    });

    // add new enemies from serialization
    Object.keys(enemies).forEach(async (key) => {
      if (!previousEnemiesState.has(key)) {
        const { x, y } = enemies[key];
        await this.genAddAtPos(key, x, y);
      }
    });
  }

  private setRelativePos(
    key: string,
    relativeX: number,
    relativeY: number
  ): void {
    const enemy = this.enemies.get(key);
    enemy?.setPos(enemy.getX() + relativeX, enemy.getY() + relativeY);
  }

  private async genAddAtPos(key: string, x: number, y: number) {
    this.enemies.set(key, await Enemy.create(mainLayer.layer, x, y));
  }

  public async destroyAllEnemies(): Promise<void> {
    this.enemies.forEach((enemy) => {
      enemy.destroy(mainLayer.layer);
    });
    this.enemies.clear();
  }
}

const enemiesStateManager = new EnemiesStateManager();
export default enemiesStateManager;
