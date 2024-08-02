import * as PIXI from 'pixi.js';
import { Avatar } from '../entity/avatar';
import { globalState } from '../states/events';
import Application from '../entity/Application';

export class DebugTool {
  private container: PIXI.Container;
  private text: PIXI.Text;
  private avatar: Avatar;

  constructor(avatar: Avatar) {
    this.container = new PIXI.Container();
    this.text = new PIXI.Text('', { fill: 'white' });
    this.container.addChild(this.text);

    this.avatar = avatar;
    this.container.visible = globalState.isDebugToolVisible;
  }

  public static async create(user: Avatar) {
    const tool = new DebugTool(user);
    const instance = await Application.getInstance();
    instance.app.stage.addChild(tool.container);
    return tool;
  }

  public async genUpdate() {
    const instance = await Application.getInstance();
    const visible = globalState.isDebugToolVisible;
    this.container.visible = visible;
    if (visible) {
      this.container.x = (instance.app.screen.width / 2);
      this.container.y = (instance.app.screen.height / 2);
      const x = this.avatar.getX();
      const y = this.avatar.getY();
      const hp = this.avatar.getHealth_DEBUG_TOOL_ONLY();
      this.text.text = `Position: (${x}, ${y})\nHP: ${hp}`;
    }
  }
}