import { Resources, MeepleStats, ComparisonOperator, LogicRuleActionType, type LogicRule } from "./types";

export const TRADER_RULES: LogicRule[] = [
  {
    id: "go-home-if-health-low",
    good: MeepleStats.Health,
    operator: ComparisonOperator.LessThanOrEqual,
    value: 0,
    action: LogicRuleActionType.ChillAtHome,
  },
  // if money is greater than or equal to 50, go socialize at space bar
  {
    id: "go-to-space-bar",
    good: Resources.Money,
    operator: ComparisonOperator.GreaterThanOrEqual,
    value: 50,
    action: LogicRuleActionType.Socialize,
  },
  // if money is less than or equal to 5, sell products to get more money
  {
    id: "go-selling",
    good: Resources.Money,
    operator: ComparisonOperator.LessThanOrEqual,
    value: 5,
    action: LogicRuleActionType.GoSelling,
  },
  // if money is greater than or equal to 15, go shopping for products
  {
    id: "go-shopping",
    good: Resources.Money,
    operator: ComparisonOperator.GreaterThanOrEqual,
    value: 15,
    action: LogicRuleActionType.GoShopping,
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

