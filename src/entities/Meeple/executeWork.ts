import { WORK_EARNINGS, WORKING_DELAY_MS } from "../game-config";
import { MeepleStateType, MeepleStats, MeepleType, Resources } from "../types";
import { findDestination, getRandomSpaceBar } from "./meepleFinders";
import { visitTarget } from "./visitTarget";
import type { Meeple } from "./Meeple";

export function executeWork(
  meeple: Meeple,
  destinationName?: string,
  destinationType?: MeepleType
): void {
  const spaceBar =
    findDestination(meeple, destinationName, destinationType ?? MeepleType.SpaceBar) ??
    getRandomSpaceBar(meeple);
  if (!spaceBar) return;

  // Bartenders earn money from the space bar and lose energy from working
  visitTarget(meeple, spaceBar, MeepleStateType.Working, () => {
    meeple.transact("add", Resources.Money, WORK_EARNINGS);
    spaceBar.transact("remove", Resources.Money, WORK_EARNINGS);
    meeple.dispatch({
      type: "set-good",
      payload: { good: MeepleStats.Energy, quantity: 0 },
    });
  }, WORKING_DELAY_MS);
}

