type EventType =
  | "AVATAR_ATTACK_ENEMIES"
  | "KEY_DOWN"
  | "KEY_UP"
  | "GENERATE_NEW_ENEMY"
  | "ENEMIES_ATTACK_AVATAR";

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
