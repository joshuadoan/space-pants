import { Color, DisplayMode, Engine } from "excalibur";

/**
 * Custom Excalibur Engine wrapper for the Space Pants game.
 * 
 * Extends Excalibur's Engine to provide game-specific configuration
 * and world dimensions. The game uses a dark space background with
 * a configurable world size.
 */
export class Game extends Engine {
  worldWidth: number;
  worldHeight: number;

  /**
   * Creates a new Game instance with the specified world dimensions.
   * 
   * @param worldWidth - The width of the game world in pixels
   * @param worldHeight - The height of the game world in pixels
   * @throws {Error} If the canvas element with id 'game-canvas' is not found in the DOM
   */
  constructor(worldWidth: number, worldHeight: number) {
    const canvasElement = document.getElementById("game-canvas") as HTMLCanvasElement;

    if (!canvasElement) {
      throw new Error(
        "Canvas element with id 'game-canvas' not found. " +
        "Make sure the canvas is rendered before initializing the game."
      );
    }

    super({
      // Dark space background (almost black)
      backgroundColor: Color.fromHex("#000000"),
      antialiasing: true,
      displayMode: DisplayMode.FillContainer,
      canvasElement,
      width: worldWidth,
      height: worldHeight,
    });

    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
  }
}
  