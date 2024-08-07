import * as PIXI from 'pixi.js';
import { Avatar } from '../entity/Avatar';
import { globalState } from '../states/events';
import Application from '../entity/Application';
import { Tiling } from '../entity/Tiling';

export class DebugTool {
  public container: PIXI.Container;
  private text: PIXI.Text;

  constructor() {
    this.container = new PIXI.Container();
    this.text = new PIXI.Text('', { fill: 'white' });
    this.container.addChild(this.text);

    this.container.visible = globalState.isDebugToolVisible;
  }

  public static async create() {
    const tool = new DebugTool();
    const instance = await Application.genInstance();
    instance.app.stage.addChild(tool.container);
    return tool;
  }

  public async genUpdate() {
    const tiling = await Tiling.genInstance();
    const instance = await Application.genInstance();
    const avatar = await Avatar.genInstance();
    const visible = globalState.isDebugToolVisible;
    this.container.visible = visible;
    if (visible) {
      this.container.x = (instance.app.screen.width / 2);
      this.container.y = (instance.app.screen.height / 2);
      const hp = avatar.getHealth_DEBUG_TOOL_ONLY();
      this.text.text = `Position: (${-tiling.getX()}, ${-tiling.getY()})\nHP: ${hp}\n Attack: (${-tiling.getX()}, ${-tiling.getY()})`;
    }
  }
}