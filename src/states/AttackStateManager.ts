import { v4 as uuidv4 } from "uuid";
import { Wind } from "../entity/Attacks/Wind";

class AttackStateManager {
  private attacks: Map<string, Wind>;

  public constructor() {
    this.attacks = new Map<string, Wind>();
  }

  public addAttack(wind: Wind) {
    const uuid = uuidv4();
    this.attacks.set(uuid, wind);
  }

  public removeAttack(windKey: string) {
    this.attacks.delete(windKey);
  }

  public getAttacks(): Map<string, Wind> {
    return this.attacks;
  }

  public updateAttacks() {
    this.attacks.forEach((wind, key) => {
      wind.move();
      wind.checkCollision(key);
    });
  }
}

const attackStateManager = new AttackStateManager();
export default attackStateManager;
