import { Actor } from "excalibur";

import { DEFAULT_HEALTH, DEFAULT_TRANSACTION_TIME_MS } from "../game-config";
import { MeepleStateType, MeepleStats, Resources } from "../types";
import { visitTarget } from "./visitTarget";
import { Meeple } from "./Meeple";

/**
 * Finds a broken meeple in the scene and moves towards it to fix it.
 * Returns true if a broken meeple was found and movement started, false otherwise.
 */
export function executeFixBrokenMeeple(meeple: Meeple): boolean {
  const scene = meeple.scene;
  if (!scene) return false;

  // Find all meeples in the scene
  const allActors = scene.actors.filter(
    (actor: Actor) => actor instanceof Meeple
  ) as Meeple[];

  // Find the nearest broken meeple (excluding self)
  const brokenMeeples = allActors.filter(
    (m: Meeple) =>
      m !== meeple &&
      m.state.type === MeepleStateType.Broken
  );

  if (brokenMeeples.length === 0) {
    return false; // No broken meeples found
  }

  // Find the nearest broken meeple
  let nearestBroken: Meeple | null = null;
  let nearestDistance = Infinity;

  for (const broken of brokenMeeples) {
    const distance = meeple.pos.distance(broken.pos);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestBroken = broken;
    }
  }

  if (!nearestBroken) {
    return false;
  }

  // Move to the broken meeple and fix it
  visitTarget(
    meeple,
    nearestBroken,
    MeepleStateType.Transacting,
    () => {
      // Fix the broken meeple: restore health to max and clear broken state
      nearestBroken!.dispatch({
        type: "set-good",
        payload: { good: MeepleStats.Health, quantity: DEFAULT_HEALTH },
      });
      // Clear broken state by setting to idle
      nearestBroken!.dispatch({ type: "set-idle" });
      // Mechanic earns 1 dollar for fixing
      meeple.dispatch({
        type: "add-good",
        payload: { good: Resources.Money, quantity: 1 },
      });
    },
    DEFAULT_TRANSACTION_TIME_MS
  );

  return true;
}

