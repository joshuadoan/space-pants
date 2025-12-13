import { Resources, MeepleStats, Products, ComparisonOperator, LogicRuleActionType, type LogicRule, type RuleBehavior } from "./types";

const TRADER_RULES_ARRAY: LogicRule[] = [
  
];

const MINER_RULES_ARRAY: LogicRule[] = [
  // Priority 1: Energy check - always go home if energy is low
  {
    id: "go-home-if-energy-low",
    good: MeepleStats.Energy,
    operator: ComparisonOperator.LessThanOrEqual,
    value: 0,
    action: LogicRuleActionType.ChillAtHome,
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

const BARTENDER_RULES_ARRAY: LogicRule[] = [
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

export const TRADER_BEHAVIOR: RuleBehavior = {
  id: "trader",
  name: "Trader",
  rules: TRADER_RULES_ARRAY,
};

export const MINER_BEHAVIOR: RuleBehavior = {
  id: "miner",
  name: "Miner",
  rules: MINER_RULES_ARRAY,
};

export const BARTENDER_BEHAVIOR: RuleBehavior = {
  id: "bartender",
  name: "Bartender",
  rules: BARTENDER_RULES_ARRAY,
};

// Export all built-in behaviors as an array
export const BUILT_IN_BEHAVIORS: RuleBehavior[] = [
  TRADER_BEHAVIOR,
  MINER_BEHAVIOR,
  BARTENDER_BEHAVIOR,
];

// Legacy exports for backward compatibility (if needed elsewhere)
export const TRADER_RULES = TRADER_RULES_ARRAY;
export const MINER_RULES = MINER_RULES_ARRAY;
export const BARTENDER_RULES = BARTENDER_RULES_ARRAY;

