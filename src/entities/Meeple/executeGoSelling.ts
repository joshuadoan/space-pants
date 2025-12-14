import { PRODUCT_SELL_PRICE, SELLING_DELAY_MS } from "../game-config";
import { MeepleStateType, MeepleType, Products, Resources } from "../types";
import { findStation, getRandomStationThatDoesNotProduce } from "./meepleFinders";
import { visitTarget } from "./visitTarget";
import type { Meeple } from "./Meeple";

export function executeGoSelling(
  meeple: Meeple,
  productType?: Products,
  destinationName?: string,
  destinationType?: MeepleType
): void {
  // Use provided productType (from rule) or fall back to meeple's productType
  const productToSell = productType ?? meeple.productType;

  // Check if trader has any of this product to sell
  const quantity = meeple.goods[productToSell] ?? 0;
  if (quantity === 0) return;

  // Find a station that does NOT produce this product (so they want to buy it)
  const station =
    findStation(meeple, destinationName, destinationType, productToSell, false) ??
    getRandomStationThatDoesNotProduce(meeple, productToSell);
  if (!station) return;

  visitTarget(meeple, station, MeepleStateType.Trading, () => {
    const currentQuantity = meeple.goods[productToSell] ?? 0;
    if (currentQuantity > 0) {
      meeple.transact("remove", productToSell, currentQuantity);
      station.transact("add", productToSell, currentQuantity);
      meeple.transact("add", Resources.Money, currentQuantity * PRODUCT_SELL_PRICE);
      station.transact("remove", Resources.Money, currentQuantity * PRODUCT_SELL_PRICE);
    }
  }, SELLING_DELAY_MS);
}

