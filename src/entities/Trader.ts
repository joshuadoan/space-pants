import { Resources } from "../types";
import type { Vector } from "excalibur";
import { Meeple } from "./Meeple";
import { ComparisonOperator, LogicRuleActionType } from "./types";
const INITIAL_MONEY = 10;

export class Trader extends Meeple {
  constructor(position: Vector, speed: number, name: string) {
    super(position, speed, name);
    // Initialize with money
    this.goods[Resources.Money] = INITIAL_MONEY;
    this.speed = 300;
    this.rules = [
      {
        id: "go-shopping",
        good: Resources.Money,
        operator: ComparisonOperator.GreaterThan,
        value: 0,
        action: LogicRuleActionType.GoShopping,
      },
      {
        id: "go-selling",
        good: Resources.Money,
        operator: ComparisonOperator.LessThanOrEqual,
        value: 0,
        action: LogicRuleActionType.GoSelling,
      },
    ];
  }
}
