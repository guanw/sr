import * as PIXI from "pixi.js";
import { globalState } from './globalState';

export function createMenu(app: PIXI.Application<PIXI.Renderer> ) {
    const menuContainer = new PIXI.Container();
    const menuBackground = new PIXI.Graphics();
    menuBackground.beginFill(0x000000, 0.5);
    menuBackground.drawRect(-app.stage.x, -app.stage.y, app.screen.width, app.screen.height);
    menuBackground.endFill();
    menuContainer.addChild(menuBackground);

    const menuText = new PIXI.Text('Game Paused. Press "M" to resume.', {
        fontSize: 24,
        fill: 0xffffff,
        align: 'center'
    });
    menuText.anchor.set(0.5);
    menuText.x = (app.screen.width / 2);
    menuText.y = (app.screen.height / 2);
    menuContainer.addChild(menuText);

    app.stage.addChild(menuContainer);
    menuContainer.visible = false; // Hide the menu initially

    function updateMenuPosition() {
        menuContainer.x = -app.stage.x;
        menuContainer.y = -app.stage.y;
    }

    // Handle keydown event for pausing and resuming the game
    window.addEventListener('keydown', (e) => {
        if (e.key === 'm' || e.key === 'M') {
            globalState.isGamePaused = !globalState.isGamePaused;
            menuContainer.visible = globalState.isGamePaused;
            if (globalState.isGamePaused) {
                updateMenuPosition(); // Update position when showing the menu
            }
        }
    });
}
