import { Avatar } from "../entity/Avatar";
import { AvatarsSerialization, MainLayer } from "../layer/MainLayer";

class AvatarsStateManager {
  private avatars: Map<string, Avatar>;

  public constructor() {
    this.avatars = new Map<string, Avatar>();
  }

  public addCurrentAvatar(key: string, avatar: Avatar) {
    this.avatars.set(key, avatar);
  }

  public getAvatars(): Map<string, Avatar> {
    return this.avatars;
  }

  public async refreshAllAvatars(
    avatars: AvatarsSerialization,
    currentAvatarId: string
  ) {
    const mainLayer = await MainLayer.genInstance();
    const previousAvatarsState = avatarsStateManager.getAvatars();
    const latestCurrentAvatarAbsoluteX = avatars[currentAvatarId].x;
    const latestCurrentAvatarAbsoluteY = avatars[currentAvatarId].y;
    const previousCurrentAvatarState = this.avatars.get(currentAvatarId);
    if (
      previousCurrentAvatarState == null ||
      previousCurrentAvatarState == undefined
    ) {
      return;
    }

    // update existing other user avatars with new x,y
    previousAvatarsState.forEach((_, key) => {
      if (key === currentAvatarId) {
        return;
      }
      if (avatars[key] != undefined && previousAvatarsState.has(key)) {
        const latestOtherAvatarAbsoluteX = avatars[key].x;
        const latestOtherAvatarAbsoluteY = avatars[key].y;
        const previousOtherAvatarAbsoluteX = previousAvatarsState
          .get(key)!
          .getX();
        const previousOtherAvatarAbsoluteY = previousAvatarsState
          .get(key)!
          .getY();

        const previousCurrentAvatarAbsoluteX =
          previousCurrentAvatarState!.getX();
        const previousCurrentAvatarAbsoluteY =
          previousCurrentAvatarState!.getY();

        const relativeX = -(
          latestCurrentAvatarAbsoluteX -
          previousCurrentAvatarAbsoluteX -
          (latestOtherAvatarAbsoluteX - previousOtherAvatarAbsoluteX)
        );
        const relativeY = -(
          latestCurrentAvatarAbsoluteY -
          previousCurrentAvatarAbsoluteY -
          (latestOtherAvatarAbsoluteY - previousOtherAvatarAbsoluteY)
        );
        this.setRelativePos(key, relativeX, relativeY);
      }
    });

    // remove avatars that don't exist in serialization
    previousAvatarsState.forEach((_, key) => {
      if (avatars[key] === undefined) {
        const avatar = previousAvatarsState.get(key);
        avatar?.destroy(mainLayer.layer);
      }
    });

    // add new avatars from serialization
    Object.keys(avatars).forEach(async (key) => {
      if (!previousAvatarsState.has(key) && key !== currentAvatarId) {
        const { x, y } = avatars[key];
        await this.genAddAtPos(key, x, y);
      }
    });
  }

  private async genAddAtPos(key: string, x: number, y: number) {
    const mainLayer = await MainLayer.genInstance();
    this.avatars.set(key, await Avatar.create(mainLayer.layer, x, y));
  }

  private setRelativePos(
    key: string,
    relativeX: number,
    relativeY: number
  ): void {
    const avatar = this.avatars.get(key);
    avatar?.setPos(avatar.getX() + relativeX, avatar.getY() + relativeY);
  }

  // private async genAddAtPos(key: string, x: number, y: number) {
  //   const mainLayer = await MainLayer.genInstance();
  //   this.enemies.set(key, await Enemy.create(mainLayer.layer, x, y));
  // }
}

const avatarsStateManager = new AvatarsStateManager();
export default avatarsStateManager;
