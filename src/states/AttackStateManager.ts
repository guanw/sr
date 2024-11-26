import { v4 as uuidv4 } from "uuid";
import { AVATAR_LOCATION, WIND_DISPLACEMENT } from "../utils/Constants";
import { SwordWind } from "../entity/Attacks/SwordWind";
import RemoteAttack from "../entity/Attacks/RemoteAttack";

class AttackStateManager {
  private remoteAttacks: Map<string, RemoteAttack>;

  public constructor() {
    this.remoteAttacks = new Map<string, RemoteAttack>();
  }

  public async genAddAttack() {
    const uuid = uuidv4();
    const swordWind = await SwordWind.create(
      AVATAR_LOCATION.x - WIND_DISPLACEMENT,
      AVATAR_LOCATION.y - WIND_DISPLACEMENT
    );
    this.remoteAttacks.set(uuid, swordWind);
  }

  public removeAttack(windKey: string) {
    this.remoteAttacks.delete(windKey);
  }

  public updateAttacks() {
    this.remoteAttacks.forEach((wind, key) => {
      wind.move();
      wind.checkCollision(key);
    });
  }
}

const attackStateManager = new AttackStateManager();
export default attackStateManager;
