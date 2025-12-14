import type { Meeple } from "./Meeple";
import { MeepleStateType, MeepleStats, MeepleType } from "../types";
import { DEFAULT_ENERGY, PIRATE_DEN_REST_DELAY_MS } from "../game-config";
import { findDestination, getRandomPirateDen } from "./meepleFinders";
import { visitTarget } from "./visitTarget";

/**
 * Makes a pirate go to a pirate den to rest and recover energy.
 */
export function executeGoToPirateDen(
  meeple: Meeple,
  destinationName?: string,
  destinationType?: MeepleType
): void {
  // Use assigned home if it's a pirate den, otherwise find one
  let pirateDen: Meeple | undefined;

  if (meeple.home && meeple.home.type === MeepleType.PirateDen) {
    pirateDen = meeple.home;
  } else if (destinationName) {
    pirateDen = findDestination(
      meeple,
      destinationName,
      destinationType ?? MeepleType.PirateDen
    );
  } else {
    pirateDen =
      findDestination(
        meeple,
        destinationName,
        destinationType ?? MeepleType.PirateDen
      ) ?? getRandomPirateDen(meeple);
  }

  if (!pirateDen) return;

  visitTarget(meeple, pirateDen, MeepleStateType.Chilling, () => {
    meeple.dispatch({
      type: "set-good",
      payload: { good: MeepleStats.Energy, quantity: DEFAULT_ENERGY },
    });
  }, PIRATE_DEN_REST_DELAY_MS);
}

