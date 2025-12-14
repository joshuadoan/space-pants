import { CHILLING_DELAY_MS, DEFAULT_ENERGY } from "../game-config";
import { MeepleStateType, MeepleStats, MeepleType } from "../types";
import { findDestination, getRandomSpaceApartments } from "./meepleFinders";
import { visitTarget } from "./visitTarget";
import type { Meeple } from "./Meeple";

export function executeChillingAtHome(
  meeple: Meeple,
  destinationName?: string,
  destinationType?: MeepleType
): void {
  // Use assigned home if available, otherwise fall back to rule destination or random
  let spaceApartments: Meeple | undefined;

  if (meeple.home) {
    spaceApartments = meeple.home;
  } else if (destinationName) {
    spaceApartments = findDestination(
      meeple,
      destinationName,
      destinationType ?? MeepleType.SpaceApartments
    );
  } else {
    spaceApartments =
      findDestination(
        meeple,
        destinationName,
        destinationType ?? MeepleType.SpaceApartments
      ) ?? getRandomSpaceApartments(meeple);
  }

  if (!spaceApartments) return;

  visitTarget(meeple, spaceApartments, MeepleStateType.Chilling, () => {
    meeple.dispatch({
      type: "set-good",
      payload: { good: MeepleStats.Energy, quantity: DEFAULT_ENERGY },
    });
  }, CHILLING_DELAY_MS);
}

