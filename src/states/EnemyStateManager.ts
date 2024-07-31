import { v4 as uuidv4 } from 'uuid';
import * as PIXI from "pixi.js";
import { Enemy } from '../entity/Enemy';

class EnemiesStateManager {
    private enemies: Map<string, Enemy>;

    public constructor() {
        this.enemies = new Map<string, Enemy>();
    }

    public addEnemy(app: PIXI.Application) {
        const uuid = uuidv4();
        this.enemies.set(uuid, new Enemy(app));
    }

    public getEnemies(): Map<string, Enemy> {
        return this.enemies;
    }

    public destroyAllEnemies(app: PIXI.Application): void {
        this.enemies.forEach((enemy) => {
            enemy.destroy(app);
        });
        this.enemies.clear();
    }
}

const enemiesStateManager = new EnemiesStateManager();
export default enemiesStateManager;