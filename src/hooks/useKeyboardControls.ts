import { useEffect } from "react";
import { KeyEvent, Keys } from "excalibur";
import type { Game } from "../entities/Game";
import type { Meeple } from "../entities/Meeple";

export type KeyboardInstructions = {
  movement: {
    up: string;
    down: string;
    left: string;
    right: string;
  };
};

/**
 * Hook that consolidates keyboard controls for the game:
 * - Sets up Excalibur game keyboard controls for player movement
 * - Prevents browser scrolling when arrow keys are pressed
 * 
 * @returns Instructions for keyboard controls
 */
export function useKeyboardControls(
  game: Game | null,
  player: Meeple | null
): KeyboardInstructions {
  useEffect(() => {
    if (!game || !player) {
      return;
    }

    const playerHalfWidth = player.width / 2;
    const playerHalfHeight = player.height / 2;

    // Set up Excalibur game keyboard controls
    const handleKeyHold = (evt: KeyEvent) => {
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
    };

    game.input.keyboard.on("hold", handleKeyHold);

    // Cleanup Excalibur keyboard listener
    return () => {
      game.input.keyboard.off("hold", handleKeyHold);
    };
  }, [game, player]);

  // Prevent browser scrolling when arrow keys are pressed
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "ArrowUp" ||
        event.key === "ArrowDown" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight"
      ) {
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return {
    movement: {
      up: "Arrow Up - Move up",
      down: "Arrow Down - Move down",
      left: "Arrow Left - Move left",
      right: "Arrow Right - Move right",
    },
  };
}

