type EventType = "AVATAR_ATTACK_ENEMIES" | "KEY_DOWN" | "KEY_UP";

export interface GameEvent {
  type: EventType;
}

export class AvatarAttackEnemiesEvent implements GameEvent {
  type: EventType = "AVATAR_ATTACK_ENEMIES";
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
