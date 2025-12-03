import { KeyEvent, Keys } from "excalibur";
import type { Game } from "../entities/Game";
import type { Meeple } from "../entities/Meeple";

export function keyboardControls(game: Game, player: Meeple) {
    const playerHalfWidth = player.width / 2;
    const playerHalfHeight = player.height / 2;
    
    game.input.keyboard.on("hold", (evt: KeyEvent) => {
      if (evt.key === Keys.ArrowLeft) {
        const newX = player.pos.x - player.speed;
        if (newX >= playerHalfWidth) {
          player.pos.x = newX;
        }
      }
      if (evt.key === Keys.ArrowRight) {
        const newX = player.pos.x + player.speed;
        if (newX <= game.worldWidth - playerHalfWidth) {
          player.pos.x = newX;
        }
      }
      if (evt.key === Keys.ArrowUp) {
        const newY = player.pos.y - player.speed;
        if (newY >= playerHalfHeight) {
          player.pos.y = newY;
        }
      }
      if (evt.key === Keys.ArrowDown) {
        const newY = player.pos.y + player.speed;
        if (newY <= game.worldHeight - playerHalfHeight) {
          player.pos.y = newY;
        }
      }
    });
  }