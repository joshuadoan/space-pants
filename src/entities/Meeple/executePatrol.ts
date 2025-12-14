import { Vector } from "excalibur";

import type { Game } from "../Game";
import { PATROLLING_DELAY_MS, PIRATE_PATROL_ENERGY_COST } from "../game-config";
import { MeepleStateType, MeepleStats } from "../types";
import type { Meeple } from "./Meeple";

/**
 * Makes a pirate patrol to a random point in the world, consuming energy.
 */
export function executePatrol(meeple: Meeple): void {
  // Get game world dimensions from the scene
  const game = meeple.scene?.engine as Game | undefined;
  if (!game) return;

  // Generate a random position within the world bounds
  const randomPosition = new Vector(
    Math.random() * game.worldWidth,
    Math.random() * game.worldHeight
  );

  // Create a temporary target actor at the random position for movement
  // We'll use the actions system to move to this position
  meeple.actions
    .callMethod(() => {
      meeple.dispatch({
        type: "set-state",
        payload: {
          type: MeepleStateType.Patrolling,
        },
      });
    })
    .moveTo(randomPosition, meeple.speed)
    .callMethod(() => {
      // Consume energy when reaching the patrol point
      meeple.dispatch({
        type: "remove-good",
        payload: { good: MeepleStats.Energy, quantity: PIRATE_PATROL_ENERGY_COST },
      });
    })
    .delay(PATROLLING_DELAY_MS)
    .callMethod(() => {
      meeple.dispatch({ type: "set-idle" });
    });
}

