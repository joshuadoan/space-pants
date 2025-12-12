import { Resources, ComparisonOperator, LogicRuleActionType, type LogicRule } from "./types";

export const TRADER_RULES: LogicRule[] = [
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

export const MINER_RULES: LogicRule[] = [
  {
    id: "sell-treasure",
    good: Resources.Treasure,
    operator: ComparisonOperator.GreaterThan,
    value: 0,
    action: LogicRuleActionType.SellTreasure,
  },
  // if money is greater than or equal to 50 go to space bar
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

