import { KeyEvent, Keys } from "excalibur";

import type { Game } from "../entities/Game";
import { PLAYER_SPEED } from "../consts";
import type { Meeple } from "../entities/Meeple";

export function keyboardControls(game: Game, player: Meeple) {
    const playerHalfWidth = player.width / 2;
    const playerHalfHeight = player.height / 2;
    
    game.input.keyboard.on("hold", (evt: KeyEvent) => {
      if (evt.key === Keys.ArrowLeft) {
        const newX = player.pos.x - PLAYER_SPEED;
        if (newX >= playerHalfWidth) {
          player.pos.x = newX;
        }
      }
      if (evt.key === Keys.ArrowRight) {
        const newX = player.pos.x + PLAYER_SPEED;
        if (newX <= game.worldWidth - playerHalfWidth) {
          player.pos.x = newX;
        }
      }
      if (evt.key === Keys.ArrowUp) {
        const newY = player.pos.y - PLAYER_SPEED;
        if (newY >= playerHalfHeight) {
          player.pos.y = newY;
        }
      }
      if (evt.key === Keys.ArrowDown) {
        const newY = player.pos.y + PLAYER_SPEED;
        if (newY <= game.worldHeight - playerHalfHeight) {
          player.pos.y = newY;
        }
      }
    });
  }