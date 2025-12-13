import type { Meeple } from "./Meeple";
import { MeepleStateType, Products, Resources, MeepleType } from "../types";
import { PRODUCT_BUY_PRICE, SHOPPING_DELAY_MS } from "../game-config";
import { findStation, getRandomStationThatProduces } from "./meepleFinders";
import { visitTarget } from "./visitTarget";

export function executeGoShopping(
  meeple: Meeple,
  product?: Products,
  destinationName?: string,
  destinationType?: MeepleType
): void {
  // Use provided product (from rule), trader's productType, or find a random product type to buy
  const productTypes = Object.values(Products);
  const productType =
    product ??
    meeple.productType ??
    productTypes[Math.floor(Math.random() * productTypes.length)];

  // Find a station that produces this product
  const station =
    findStation(meeple, destinationName, destinationType, productType, true) ??
    getRandomStationThatProduces(meeple, productType);
  if (!station) return;

  visitTarget(meeple, station, MeepleStateType.Trading, () => {
    // Buy the product that this station produces
    const stationProductType = station.productType;
    if (
      stationProductType &&
      station.goods[stationProductType] &&
      station.goods[stationProductType] >= 1
    ) {
      meeple.transact("add", stationProductType, 1);
      station.transact("remove", stationProductType, 1);
      meeple.transact("remove", Resources.Money, PRODUCT_BUY_PRICE);
      station.transact("add", Resources.Money, PRODUCT_BUY_PRICE);
    }
  }, SHOPPING_DELAY_MS);
}

