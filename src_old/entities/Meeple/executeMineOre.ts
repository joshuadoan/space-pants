import { MINING_DELAY_MS, MINING_ORE_AMOUNT } from "../game-config";
import { MeepleStateType, MeepleType, Resources } from "../types";
import { findAsteroid, getRandomAsteroid } from "./meepleFinders";
import { visitTarget } from "./visitTarget";
import type { Meeple } from "./Meeple";

export function executeMineOre(
  meeple: Meeple,
  destinationName?: string,
  destinationType?: MeepleType
): void {
  const asteroid =
    findAsteroid(meeple, destinationName, destinationType) ??
    getRandomAsteroid(meeple);
  if (!asteroid) return;

  // Double-check that the asteroid has ore before attempting to mine
  const asteroidOre = asteroid.goods[Resources.Ore] ?? 0;
  if (asteroidOre <= 0) return;

  visitTarget(meeple, asteroid, MeepleStateType.Mining, () => {
    // Check again at mining time to ensure asteroid still has ore
    const currentAsteroidOre = asteroid.goods[Resources.Ore] ?? 0;
    if (currentAsteroidOre > 0) {
      const actualMiningAmount = Math.min(MINING_ORE_AMOUNT, currentAsteroidOre);
      meeple.transact("add", Resources.Ore, actualMiningAmount);
      asteroid.transact("remove", Resources.Ore, actualMiningAmount);
    }
  }, MINING_DELAY_MS);
}

