type EventType =
  | "AVATAR_ATTACK_ENEMIES"
  | "KEY_DOWN"
  | "KEY_UP"
  | "GENERATE_NEW_ENEMY"
  | "ENEMIES_ATTACK_AVATAR"
  | "GENERATE_NEW_ITEM"
  | "COLLECT_ITEM"
  | "GAME_OVER"
  | "ENEMIES_MOVE_TOWARDS_AVATAR"
  | "UPDATE_ATTACKS"
  | "REFRESH_DEBUG_TOOL"
  | "AVATAR_INITIATE_ATTACK"
  | "MOVE_AVATAR";

export interface GameEvent {
  type: EventType;
}

export class AvatarAttackEnemiesEvent implements GameEvent {
  type: EventType = "AVATAR_ATTACK_ENEMIES";
}

export class GenerateNewEnemyEvent implements GameEvent {
  type: EventType = "GENERATE_NEW_ENEMY";
}

export class EnemiesAttackAvatarEvent implements GameEvent {
  type: EventType = "ENEMIES_ATTACK_AVATAR";
}

export class GenerateNewItemEvent implements GameEvent {
  type: EventType = "GENERATE_NEW_ITEM";
}

export class CollectItemEvent implements GameEvent {
  type: EventType = "COLLECT_ITEM";
}

export class KeyDownEvent implements GameEvent {
  type: EventType = "KEY_DOWN";
  event: KeyboardEvent;
  constructor(event: KeyboardEvent) {
    this.event = event;
  }
}

export class KeyUpEvent implements GameEvent {
  type: EventType = "KEY_UP";
  event: KeyboardEvent;
  constructor(event: KeyboardEvent) {
    this.event = event;
  }
}

export class GameOverEvent implements GameEvent {
  type: EventType = "GAME_OVER";
}

export class EnemiesMoveTowardsAvatarEvent implements GameEvent {
  type: EventType = "ENEMIES_MOVE_TOWARDS_AVATAR";
}

export class UpdateAttacksEvent implements GameEvent {
  type: EventType = "UPDATE_ATTACKS";
}

export class AvatarInitiateAttackEvent implements GameEvent {
  type: EventType = "AVATAR_INITIATE_ATTACK";
  event: MouseEvent;
  constructor(event: MouseEvent) {
    this.event = event;
  }
}

export class MoveAvatarEvent implements GameEvent {
  type: EventType = "MOVE_AVATAR";
}
