import { v4 as uuidv4 } from "uuid";
import { Wind } from "../entity/Attacks/Wind";
import { AVATAR_LOCATION, WIND_DISPLACEMENT } from "../utils/Constants";

class AttackStateManager {
  private attacks: Map<string, Wind>;

  public constructor() {
    this.attacks = new Map<string, Wind>();
  }

  public async genAddAttack(x: number, y: number) {
    const uuid = uuidv4();
    const wind = await Wind.create(
      AVATAR_LOCATION.x - WIND_DISPLACEMENT,
      AVATAR_LOCATION.y - WIND_DISPLACEMENT,
      x,
      y
    );
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
