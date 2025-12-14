import { CHILLING_DELAY_MS, DEFAULT_ENERGY, PIRATE_DEN_REST_DELAY_MS } from "../game-config";
import { MeepleStateType, MeepleStats, MeepleType } from "../types";
import { findDestination, getRandomPirateDen, getRandomSpaceApartments } from "./meepleFinders";
import { visitTarget } from "./visitTarget";
import type { Meeple } from "./Meeple";

export function executeChillingAtHome(
  meeple: Meeple,
  destinationName?: string,
  destinationType?: MeepleType
): void {
  // Pirates should use pirate dens, not apartments
  if (meeple.type === MeepleType.Pirate) {
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
    return;
  }

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

