// EXCHANGE_RATE[transaction.good][CurrencyType.Money];

import { CurrencyType, MiningType, ProductType } from "../entities/types";


export const GOODS_COSTS = {
  [MiningType.Ore]: 1,
  [ProductType.Fizzy]: 2,
  [ProductType.Gruffle]: 1,
  [CurrencyType.Money]: 1,
};

export const MINING_TO_PRODUCT_CONVERSION_RATES = {
  [MiningType.Ore]: {
    [ProductType.Fizzy]: 7,
  }
};