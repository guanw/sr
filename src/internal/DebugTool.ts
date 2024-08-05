import * as PIXI from 'pixi.js';
import { Avatar } from '../entity/Avatar';
import { globalState } from '../states/events';
import Application from '../entity/Application';
import { Tiling } from '../entity/Tiling';

export class DebugTool {
  public container: PIXI.Container;
  private text: PIXI.Text;
  private tiling: Tiling;

  constructor(tiling: Tiling) {
    this.container = new PIXI.Container();
    this.text = new PIXI.Text('', { fill: 'white' });
    this.container.addChild(this.text);

    this.tiling = tiling;
    this.container.visible = globalState.isDebugToolVisible;
  }

  public static async create(tiling: Tiling) {
    const tool = new DebugTool(tiling);
    const instance = await Application.genInstance();
    instance.app.stage.addChild(tool.container);
    return tool;
  }

  public async genUpdate() {
    const instance = await Application.genInstance();
    const avatar = await Avatar.genInstance();
    const visible = globalState.isDebugToolVisible;
    this.container.visible = visible;
    if (visible) {
      this.container.x = (instance.app.screen.width / 2);
      this.container.y = (instance.app.screen.height / 2);
      const hp = avatar.getHealth_DEBUG_TOOL_ONLY();
      this.text.text = `Position: (${-this.tiling.instance.tilePosition.x}, ${-this.tiling.instance.tilePosition.y})\nHP: ${hp}`;
    }
  }
}