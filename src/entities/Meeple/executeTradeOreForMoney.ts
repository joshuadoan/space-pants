import { TRADE_MONEY_AMOUNT, TRADE_ORE_AMOUNT, TRADING_DELAY_MS } from "../game-config";
import { MeepleStateType, MeepleType, Resources } from "../types";
import { findStation, getRandomStation } from "./meepleFinders";
import { visitTarget } from "./visitTarget";
import type { Meeple } from "./Meeple";

export function executeTradeOreForMoney(
  meeple: Meeple,
  destinationName?: string,
  destinationType?: MeepleType
): void {
  const station =
    findStation(meeple, destinationName, destinationType) ??
    getRandomStation(meeple);
  if (!station) return;

  visitTarget(meeple, station, MeepleStateType.Trading, () => {
    meeple.transact("remove", Resources.Ore, TRADE_ORE_AMOUNT);
    meeple.transact("add", Resources.Money, TRADE_MONEY_AMOUNT);
    station.transact("add", Resources.Ore, TRADE_ORE_AMOUNT);
    station.transact("remove", Resources.Money, TRADE_MONEY_AMOUNT);
  }, TRADING_DELAY_MS);
}

