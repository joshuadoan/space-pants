import { Resources, MeepleStats, Products, ComparisonOperator, LogicRuleActionType, type LogicRule } from "./types";

export const TRADER_RULES: LogicRule[] = [
  // Priority 1: Energy check - always go home if energy is low
  {
    id: "go-home-if-energy-low",
    good: MeepleStats.Energy,
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
  // Priority 4: If money is 6-49, go shopping for products
  {
    id: "go-shopping",
    good: Resources.Money,
    operator: ComparisonOperator.GreaterThanOrEqual,
    value: 6,
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
  // Priority 1: Energy check - always go home if energy is low
  {
    id: "go-home-if-energy-low",
    good: MeepleStats.Energy,
    operator: ComparisonOperator.LessThanOrEqual,
    value: 0,
    action: LogicRuleActionType.ChillAtHome,
  },
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
  // if ore is greater than or equal to 10, trade it for money
  {
    id: "trade-ore-for-money",
    good: Resources.Ore,
    operator: ComparisonOperator.GreaterThanOrEqual,
    value: 10,
    action: LogicRuleActionType.TradeOreForMoney,
  },
  // if ore is less than 10, continue mining
  {
    id: "mine-ore",
    good: Resources.Ore,
    operator: ComparisonOperator.LessThan,
    value: 10,
    action: LogicRuleActionType.MineOre,
  },
];

export const BARTENDER_RULES: LogicRule[] = [
  // Priority 1: If energy is 0 or less, go home to recover
  {
    id: "go-home-if-energy-low",
    good: MeepleStats.Energy,
    operator: ComparisonOperator.LessThanOrEqual,
    value: 0,
    action: LogicRuleActionType.ChillAtHome,
  },
  // Priority 2: If money is 50+, go shopping for products
  {
    id: "go-shopping",
    good: Resources.Money,
    operator: ComparisonOperator.GreaterThanOrEqual,
    value: 50,
    action: LogicRuleActionType.GoShopping,
  },
  // Priority 3: If energy is above 0, go to space bar to work (make money)
  {
    id: "go-to-space-bar-to-work",
    good: MeepleStats.Energy,
    operator: ComparisonOperator.GreaterThan,
    value: 0,
    action: LogicRuleActionType.Work,
  },
];

