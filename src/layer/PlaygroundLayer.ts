import * as PIXI from 'pixi.js';

export class PlaygroundLayer {
    public static instance: PlaygroundLayer;
    public layer: PIXI.Container;

    constructor() {
        this.layer = new PIXI.Container();
    }

    public static async genInstance(): Promise<PlaygroundLayer> {
        if (!PlaygroundLayer.instance) {
            PlaygroundLayer.instance = new PlaygroundLayer();
        }
        const circle = new PIXI.Graphics();
        circle.beginFill(0x9966FF);
        circle.drawCircle(0, 0, 50);
        circle.endFill();
        circle.x = 400;
        circle.y = 300;
        PlaygroundLayer.instance.layer.addChild(circle);
        return PlaygroundLayer.instance;
      }

    async update() {

    }
}