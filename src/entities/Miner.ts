import type { Vector } from "excalibur";
import { Meeple } from "./Meeple";
import { ComparisonOperator, LogicRuleActionType } from "./types";
import { Resources } from "../types";

export class Miner extends Meeple {
  constructor(position: Vector, speed: number, name: string) {
    super(position, speed, name);

    this.speed = 100;
    this.goods[Resources.Ore] = 0;
    this.goods[Resources.Money] = 0;
    this.rules = [
      ///if money is greater than or equal to 50 go to space bar
      {
        id: "go-to-space-bar",
        good: Resources.Money,
        operator: ComparisonOperator.GreaterThanOrEqual,
        value: 50,
        action: LogicRuleActionType.Socialize,
      },
      // if ore is less than or equal to 0, mine ore
      {
        id: "mine-ore",
        good: Resources.Ore,
        operator: ComparisonOperator.LessThanOrEqual,
        value: 0,
        action: LogicRuleActionType.MineOre,
      },
      // if ore is greater than or equal to 10, stop mining
      {
        id: "trade-ore-for-money",
        good: Resources.Ore,
        operator: ComparisonOperator.GreaterThanOrEqual,
        value: 10,
        action: LogicRuleActionType.TradeOreForMoney,
      },
    ];
  }
}
