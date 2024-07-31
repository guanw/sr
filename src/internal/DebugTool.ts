import * as PIXI from 'pixi.js';
import { Avatar } from '../entity/avatar';
import { globalState } from '../states/events';

export class DebugTool {
  private container: PIXI.Container;
  private text: PIXI.Text;
  private avatar: Avatar;

  constructor(app: PIXI.Application, avatar: Avatar) {
    this.container = new PIXI.Container();
    this.text = new PIXI.Text('', { fill: 'white' });
    this.container.addChild(this.text);
    app.stage.addChild(this.container);
    this.avatar = avatar;
    this.container.visible = globalState.isDebugToolVisible;
  }

  update(app: PIXI.Application) {
    const visible = globalState.isDebugToolVisible;
    this.container.visible = visible;
    if (visible) {
      this.container.x = (app.screen.width / 2) - app.stage.x;
      this.container.y = (app.screen.height / 2) - app.stage.y;
      const x = this.avatar.getX();
      const y = this.avatar.getY();
      const hp = this.avatar.getHealth_DEBUG_TOOL_ONLY();
      this.text.text = `Position: (${x}, ${y})\nHP: ${hp}`;
    }
  }
}