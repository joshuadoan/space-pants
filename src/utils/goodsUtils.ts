import { Color } from "excalibur";
import { Resources, Products, type GoodType, type Goods } from "../entities/types";

// Color mapping for each good type
export function getGoodColor(good: GoodType): Color {
  switch (good) {
    case Resources.Ore:
      return Color.Orange;
    case Resources.Treasure:
      return Color.fromHex("#FFD700"); // Gold color
    case Products.Gruffle:
      return Color.Blue;
    case Products.Druffle:
      return Color.Green;
    case Products.Klintzpaw:
      return Color.Purple;
    case Products.Grogin:
      return Color.Yellow;
    case Products.Fizz:
      return Color.Red;
    default:
      return Color.White;
  }
}

/// Get good with most amount that is not money or ore
export function getGoodWithMostAmount(goods: Partial<Goods>): GoodType | undefined {
  const goodsList = Object.keys(goods).filter(
    (good): good is GoodType =>
      good !== Resources.Ore && good !== Resources.Money
  );
  if (!goodsList.length) {
    return undefined;
  }
  return goodsList.reduce(
    (max, good) =>
      (goods[good] ?? 0) > (goods[max] ?? 0) ? good : max,
    goodsList[0]
  );
}

