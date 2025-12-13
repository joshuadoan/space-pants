import { useEffect } from "react";
import { KeyEvent, Keys } from "excalibur";
import type { Game } from "../entities/Game";
import type { Meeple } from "../entities/Meeple/Meeple";

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

    // Track which keys are currently pressed
    const keysPressed = new Set<Keys>();

    // Set up Excalibur game keyboard controls
    const handleKeyPress = (evt: KeyEvent) => {
      keysPressed.add(evt.key);
      updateVelocity();
    };

    const handleKeyRelease = (evt: KeyEvent) => {
      keysPressed.delete(evt.key);
      updateVelocity();
    };

    const updateVelocity = () => {
      // Reset velocity
      player.vel.x = 0;
      player.vel.y = 0;

      // Apply movement based on pressed keys
      if (keysPressed.has(Keys.ArrowLeft)) {
        player.moveDIrection("left");
      }
      if (keysPressed.has(Keys.ArrowRight)) {
        player.moveDIrection("right");
      }
      if (keysPressed.has(Keys.ArrowUp)) {
        player.moveDIrection("up");
      }
      if (keysPressed.has(Keys.ArrowDown)) {
        player.moveDIrection("down");
      }

      // If no keys are pressed, stop movement
      if (keysPressed.size === 0) {
        player.stopMovement();
      }
    };

    // Listen for key press and release events
    game.input.keyboard.on("press", handleKeyPress);
    game.input.keyboard.on("release", handleKeyRelease);

    // Also handle hold events for continuous movement
    const handleKeyHold = (evt: KeyEvent) => {
      if (!keysPressed.has(evt.key)) {
        keysPressed.add(evt.key);
        updateVelocity();
      }
    };
    game.input.keyboard.on("hold", handleKeyHold);

    // Cleanup Excalibur keyboard listeners
    return () => {
      game.input.keyboard.off("press", handleKeyPress);
      game.input.keyboard.off("release", handleKeyRelease);
      game.input.keyboard.off("hold", handleKeyHold);
      player.stopMovement();
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

