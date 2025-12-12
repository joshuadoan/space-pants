import { Resources, MeepleStats, Products, ComparisonOperator, LogicRuleActionType, type LogicRule } from "./types";

export const TRADER_RULES: LogicRule[] = [
  // Priority 1: Health check - always go home if health is low
  {
    id: "go-home-if-health-low",
    good: MeepleStats.Health,
    operator: ComparisonOperator.LessThanOrEqual,
    value: 0,
    action: LogicRuleActionType.ChillAtHome,
  },
  // Priority 2: If money is 50+, socialize (they're doing well)
  {
    id: "go-to-space-bar",
    good: Resources.Money,
    operator: ComparisonOperator.GreaterThanOrEqual,
    value: 50,
    action: LogicRuleActionType.Socialize,
  },
  // Priority 3: If they have products, sell them first (covers gap in 6-14 money range)
  // Check multiple product types to catch any products they might have
  {
    id: "sell-if-has-gruffle",
    good: Products.Gruffle,
    operator: ComparisonOperator.GreaterThan,
    value: 0,
    action: LogicRuleActionType.GoSelling,
  },
  {
    id: "sell-if-has-druffle",
    good: Products.Druffle,
    operator: ComparisonOperator.GreaterThan,
    value: 0,
    action: LogicRuleActionType.GoSelling,
  },
  {
    id: "sell-if-has-klintzpaw",
    good: Products.Klintzpaw,
    operator: ComparisonOperator.GreaterThan,
    value: 0,
    action: LogicRuleActionType.GoSelling,
  },
  {
    id: "sell-if-has-grogin",
    good: Products.Grogin,
    operator: ComparisonOperator.GreaterThan,
    value: 0,
    action: LogicRuleActionType.GoSelling,
  },
  {
    id: "sell-if-has-fizz",
    good: Products.Fizz,
    operator: ComparisonOperator.GreaterThan,
    value: 0,
    action: LogicRuleActionType.GoSelling,
  },
  // Priority 4: If money is 15-49, go shopping for products
  {
    id: "go-shopping",
    good: Resources.Money,
    operator: ComparisonOperator.GreaterThanOrEqual,
    value: 15,
    action: LogicRuleActionType.GoShopping,
  },
  // Priority 5: If money is low (<= 5), try to sell (fallback)
  {
    id: "go-selling-low-money",
    good: Resources.Money,
    operator: ComparisonOperator.LessThanOrEqual,
    value: 5,
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

