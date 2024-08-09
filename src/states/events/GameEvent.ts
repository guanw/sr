type EventType =
  | "AVATAR_ATTACK_ENEMIES"
  | "AVATAR_MOVE_KEY_DOWN"
  | "AVATAR_MOVE_KEY_UP";

export interface GameEvent {
  type: EventType;
}

export class AvatarAttackEnemiesEvent implements GameEvent {
  type: EventType = "AVATAR_ATTACK_ENEMIES";
}

export class AvatarMoveKeyDownEvent implements GameEvent {
  type: EventType = "AVATAR_MOVE_KEY_DOWN";
  event: KeyboardEvent;
  constructor(event: KeyboardEvent) {
    this.event = event;
  }
}

export class AvatarMoveKeyUpEvent implements GameEvent {
  type: EventType = "AVATAR_MOVE_KEY_UP";
  event: KeyboardEvent;
  constructor(event: KeyboardEvent) {
    this.event = event;
  }
}
