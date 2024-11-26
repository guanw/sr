export default abstract class RemoteAttack {
  move() {
    throw new Error(`"move" not implemented`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  checkCollision(_: string) {
    throw new Error(`"checkCollision" not implemented`);
  }
}
