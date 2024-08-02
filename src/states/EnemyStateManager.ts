import { v4 as uuidv4 } from 'uuid';
import { Enemy } from '../entity/Enemy';
import Application from '../entity/Application';

class EnemiesStateManager {
    private enemies: Map<string, Enemy>;

    public constructor() {
        this.enemies = new Map<string, Enemy>();
    }

    public async genAddEnemy() {
        const instance = await Application.getInstance();
        const uuid = uuidv4();
        this.enemies.set(uuid, new Enemy(instance.app));
    }

    public getEnemies(): Map<string, Enemy> {
        return this.enemies;
    }

    public async destroyAllEnemies(): Promise<void> {
        const instance = await Application.getInstance();
        this.enemies.forEach((enemy) => {
            enemy.destroy(instance.app);
        });
        this.enemies.clear();
    }
}

const enemiesStateManager = new EnemiesStateManager();
export default enemiesStateManager;