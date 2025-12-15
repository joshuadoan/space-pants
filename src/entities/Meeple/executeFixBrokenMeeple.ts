import { Actor } from "excalibur";

import { DEFAULT_HEALTH, DEFAULT_TRANSACTION_TIME_MS } from "../game-config";
import { MeepleStateType, MeepleStats, MeepleType, Resources } from "../types";
import { visitTarget } from "./visitTarget";
import { Meeple } from "./Meeple";

/**
 * Finds a broken meeple in the scene and moves towards it to fix it.
 * Returns true if a broken meeple was found and movement started, false otherwise.
 * Skips broken meeples that are already being fixed by other mechanics.
 */
export function executeFixBrokenMeeple(meeple: Meeple): boolean {
  const scene = meeple.scene;
  if (!scene) return false;

  // Find all meeples in the scene
  const allActors = scene.actors.filter(
    (actor: Actor) => actor instanceof Meeple
  ) as Meeple[];

  // Find all mechanics in the scene (to check if they're already fixing a ship)
  const allMechanics = allActors.filter(
    (m: Meeple) => m !== meeple && m.type === MeepleType.Mechanic
  );

  // Find broken meeples that aren't already being fixed by another mechanic
  const brokenMeeples = allActors.filter((m: Meeple) => {
    if (m === meeple) return false;
    if (m.state.type !== MeepleStateType.Broken) return false;
    
    // Check if any other mechanic is already targeting this broken meeple
    const isBeingFixed = allMechanics.some((mechanic: Meeple) => {
      const state = mechanic.state;
      // Check if mechanic is traveling to or transacting with this broken meeple
      return (
        (state.type === MeepleStateType.Traveling && state.target === m) ||
        (state.type === MeepleStateType.Transacting && state.target === m)
      );
    });
    
    return !isBeingFixed;
  });

  if (brokenMeeples.length === 0) {
    return false; // No broken meeples found that aren't already being fixed
  }

  // Find the nearest available broken meeple
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

