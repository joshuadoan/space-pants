import { DEFAULT_ENERGY, SOCIALIZING_DELAY_MS } from "../game-config";
import { MeepleStateType, MeepleStats, MeepleType, Resources } from "../types";
import { findDestination, getRandomSocializingDestination } from "./meepleFinders";
import { visitTarget } from "./visitTarget";
import type { Meeple } from "./Meeple";

export function executeSocialize(
  meeple: Meeple,
  destinationName?: string,
  destinationType?: MeepleType
): void {
  // If a specific destination type is provided, use it; otherwise default to SpaceBar for backward compatibility
  const defaultType = destinationType ?? MeepleType.SpaceBar;
  
  const destination =
    findDestination(meeple, destinationName, defaultType) ??
    getRandomSocializingDestination(meeple, defaultType);
  if (!destination) return;

  const moneyAmount = meeple.goods[Resources.Money] ?? 0;
  visitTarget(meeple, destination, MeepleStateType.Socializing, () => {
    meeple.transact("remove", Resources.Money, moneyAmount);
    destination.transact("add", Resources.Money, moneyAmount);
    meeple.dispatch({
      type: "set-good",
      payload: { good: MeepleStats.Energy, quantity: DEFAULT_ENERGY },
    });
  }, SOCIALIZING_DELAY_MS);
}

