import type { Meeple } from "./Meeple";
import { MeepleStateType, Resources, MeepleStats, MeepleType } from "../types";
import { DEFAULT_ENERGY, SOCIALIZING_DELAY_MS } from "../game-config";
import { findDestination, getRandomSpaceBar } from "./meepleFinders";
import { visitTarget } from "./visitTarget";

export function executeSocialize(
  meeple: Meeple,
  destinationName?: string,
  destinationType?: MeepleType
): void {
  const spaceBar =
    findDestination(meeple, destinationName, destinationType ?? MeepleType.SpaceBar) ??
    getRandomSpaceBar(meeple);
  if (!spaceBar) return;

  const moneyAmount = meeple.goods[Resources.Money] ?? 0;
  visitTarget(meeple, spaceBar, MeepleStateType.Socializing, () => {
    meeple.transact("remove", Resources.Money, moneyAmount);
    spaceBar.transact("add", Resources.Money, moneyAmount);
    meeple.dispatch({
      type: "set-good",
      payload: { good: MeepleStats.Energy, quantity: DEFAULT_ENERGY },
    });
  }, SOCIALIZING_DELAY_MS);
}

