import { Avatar } from "../../entity/Avatar";
import enemiesStateManager from "../EnemyStateManager";

type EventType = 'AVATAR_ATTACK_ENEMIES' | 'AVATAR_MOVE';

interface GameEvent {
    type: EventType;
}

export class AvatarAttackEnemiesEvent implements GameEvent {
    type: EventType = "AVATAR_ATTACK_ENEMIES";
}


export class GameEventManager {
    private static instance: GameEventManager;
    private eventQueue: GameEvent[] = [];

    private constructor() {}

    public static getInstance(): GameEventManager {
        if (!GameEventManager.instance) {
            GameEventManager.instance = new GameEventManager();
        }
        return GameEventManager.instance;
    }

    public emit(event: GameEvent) {
        this.eventQueue.push(event);
    }

    public async processEvents() {
        while (this.eventQueue.length > 0) {
            const event = this.eventQueue.shift();
            if (event) {
                await this.handleEvent(event);
            }
        }
    }

    private async handleEvent(event: GameEvent) {
        switch (event.type) {
            case 'AVATAR_ATTACK_ENEMIES':
                await this.handleAvatarAttackEnemiesEvent();
                break;
        }
    }

    private async handleAvatarAttackEnemiesEvent() {
        const avatar = await Avatar.genInstance();
        const enemies = enemiesStateManager.getEnemies();
        await avatar.genPerformAttack(enemies);
    }
}

