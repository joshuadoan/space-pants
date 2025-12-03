import { Color, DisplayMode, Engine } from "excalibur";

export class Game extends Engine {
    worldWidth: number;
    worldHeight: number;
    constructor(worldWidth: number, worldHeight: number) {
      super({
        // bg dark almost black for space
        backgroundColor: Color.fromHex("#000000"),
        pixelArt: true,
        pixelRatio: 2,
        displayMode: DisplayMode.FillContainer,
        canvasElement: document.getElementById(
          "game-canvas"
        ) as HTMLCanvasElement,
        width: worldWidth,
        height: worldHeight,
      });
      
      this.worldWidth = worldWidth;
      this.worldHeight = worldHeight;
    }
  }
  