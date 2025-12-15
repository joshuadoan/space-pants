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
  // If destinationName is provided, try to find exact match first
  // If destinationType is provided, use it; otherwise use random social destination
  const destination =
    findDestination(meeple, destinationName, destinationType) ??
    getRandomSocializingDestination(meeple, destinationType);
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

