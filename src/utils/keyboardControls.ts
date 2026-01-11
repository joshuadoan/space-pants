import { KeyEvent, Keys } from "excalibur";

import type { Game } from "../Game/Game";
import { PLAYER_SPEED } from "../consts";

export function keyboardControls(game: Game) {
    const camera = game.currentScene.camera;
    
    game.input.keyboard.on("hold", (evt: KeyEvent) => {
      if (evt.key === Keys.ArrowLeft) {
        const newX = camera.pos.x - PLAYER_SPEED;
        if (newX >= 0) {
          camera.pos.x = newX;
        }
      }
      if (evt.key === Keys.ArrowRight) {
        const newX = camera.pos.x + PLAYER_SPEED;
        if (newX <= game.worldWidth) {
          camera.pos.x = newX;
        }
      }
      if (evt.key === Keys.ArrowUp) {
        const newY = camera.pos.y - PLAYER_SPEED;
        if (newY >= 0) {
          camera.pos.y = newY;
        }
      }
      if (evt.key === Keys.ArrowDown) {
        const newY = camera.pos.y + PLAYER_SPEED;
        if (newY <= game.worldHeight) {
          camera.pos.y = newY;
        }
      }
    });
  }