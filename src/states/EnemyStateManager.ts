import * as PIXI from "pixi.js";
import { v4 as uuidv4 } from 'uuid';
import { Enemy } from '../entity/Enemy';
import Application from '../entity/Application';
import { MainLayer } from "../layer/MainLayer";

class EnemiesStateManager {
    private enemies: Map<string, Enemy>;

    public constructor() {
        this.enemies = new Map<string, Enemy>();
    }

    public async genAddEnemy(layer: PIXI.Container) {
        const instance = await Application.genInstance();
        const uuid = uuidv4();
        this.enemies.set(uuid, new Enemy(instance.app, layer));
    }

    public getEnemies(): Map<string, Enemy> {
        return this.enemies;
    }

    public async destroyAllEnemies(): Promise<void> {
        const mainLayer = await MainLayer.genInstance();
        this.enemies.forEach((enemy) => {
            enemy.destroy(mainLayer.layer);
        });
        this.enemies.clear();
    }
}

const enemiesStateManager = new EnemiesStateManager();
export default enemiesStateManager;