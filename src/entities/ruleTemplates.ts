import { Resources, MeepleStats, Products, ComparisonOperator, LogicRuleActionType, type LogicRule, type RuleBehavior, createRuleId, createBehaviorId } from "./types";

const TRADER_RULES_ARRAY = [
  // Priority 1: Energy check - always go home if energy is low
  {
    id: createRuleId("go-home-if-energy-low"),
    good: MeepleStats.Energy,
    operator: ComparisonOperator.LessThanOrEqual,
    value: 0,
    action: LogicRuleActionType.RestAtApartments,
  },
  // Priority 2: If money is greater than or equal to 50, go to space bar to socialize
  {
    id: createRuleId("go-to-space-bar"),
    good: Resources.Money,
    operator: ComparisonOperator.GreaterThanOrEqual,
    value: 50,
    action: LogicRuleActionType.SocializeAtBar,
  },
  // Priority 3: If trader has products of their type, sell them to stations
  // productType not specified, so it defaults to meeple's productType
  {
    id: createRuleId("sell-product"),
    good: Products.Gruffle, // Placeholder - will use meeple's productType at runtime
    operator: ComparisonOperator.GreaterThan,
    value: 0,
    action: LogicRuleActionType.SellProductToStation,
  },
  // Priority 4: If trader has money, buy products from stations
  // productType not specified, so it defaults to meeple's productType
  {
    id: createRuleId("buy-product"),
    good: Resources.Money,
    operator: ComparisonOperator.GreaterThanOrEqual,
    value: 1, // Minimum to buy one product (PRODUCT_BUY_PRICE)
    action: LogicRuleActionType.BuyProductFromStation,
  },
] satisfies LogicRule[];

const MINER_RULES_ARRAY = [
  // Priority 1: Energy check - always go home if energy is low
  {
    id: createRuleId("go-home-if-energy-low"),
    good: MeepleStats.Energy,
    operator: ComparisonOperator.LessThanOrEqual,
    value: 0,
    action: LogicRuleActionType.RestAtApartments,
  },
  // if money is greater than or equal to 50 go to space bar
  {
    id: createRuleId("go-to-space-bar"),
    good: Resources.Money,
    operator: ComparisonOperator.GreaterThanOrEqual,
    value: 50,
    action: LogicRuleActionType.SocializeAtBar,
  },
  // if ore is greater than or equal to 10, trade it for money
  {
    id: createRuleId("trade-ore-for-money"),
    good: Resources.Ore,
    operator: ComparisonOperator.GreaterThanOrEqual,
    value: 10,
    action: LogicRuleActionType.SellOreToStation,
  },
  // if ore is less than 10, continue mining
  {
    id: createRuleId("mine-ore"),
    good: Resources.Ore,
    operator: ComparisonOperator.LessThan,
    value: 10,
    action: LogicRuleActionType.MineOreFromAsteroid,
  },
] satisfies LogicRule[];

const BARTENDER_RULES_ARRAY = [
  // Priority 1: If energy is 0 or less, go home to recover
  {
    id: createRuleId("go-home-if-energy-low"),
    good: MeepleStats.Energy,
    operator: ComparisonOperator.LessThanOrEqual,
    value: 0,
    action: LogicRuleActionType.RestAtApartments,
  },
  // Priority 2: If money is 50+, go shopping for products
  {
    id: createRuleId("go-shopping"),
    good: Resources.Money,
    operator: ComparisonOperator.GreaterThanOrEqual,
    value: 50,
    action: LogicRuleActionType.BuyProductFromStation,
  },
  // Priority 3: If energy is above 0, go to space bar to work (make money)
  {
    id: createRuleId("go-to-space-bar-to-work"),
    good: MeepleStats.Energy,
    operator: ComparisonOperator.GreaterThan,
    value: 0,
    action: LogicRuleActionType.WorkAtBar,
  },
] satisfies LogicRule[];

const PIRATE_RULES_ARRAY = [
  // Priority 1: If energy is 0 or less, go to pirate den to recover
  {
    id: createRuleId("go-to-pirate-den-if-energy-low"),
    good: MeepleStats.Energy,
    operator: ComparisonOperator.LessThanOrEqual,
    value: 0,
    action: LogicRuleActionType.GoToPirateDen,
  },
  // Priority 2: If energy is above 0, patrol (fly to random points)
  {
    id: createRuleId("patrol"),
    good: MeepleStats.Energy,
    operator: ComparisonOperator.GreaterThan,
    value: 0,
    action: LogicRuleActionType.Patrol,
  },
] satisfies LogicRule[];

export const TRADER_BEHAVIOR = {
  id: createBehaviorId("trader"),
  name: "Trader",
  rules: TRADER_RULES_ARRAY,
} satisfies RuleBehavior;

export const MINER_BEHAVIOR = {
  id: createBehaviorId("miner"),
  name: "Miner",
  rules: MINER_RULES_ARRAY,
} satisfies RuleBehavior;

export const BARTENDER_BEHAVIOR = {
  id: createBehaviorId("bartender"),
  name: "Bartender",
  rules: BARTENDER_RULES_ARRAY,
} satisfies RuleBehavior;

export const PIRATE_BEHAVIOR = {
  id: createBehaviorId("pirate"),
  name: "Pirate",
  rules: PIRATE_RULES_ARRAY,
} satisfies RuleBehavior;

// Export all built-in behaviors as an array
export const BUILT_IN_BEHAVIORS: RuleBehavior[] = [
  TRADER_BEHAVIOR,
  MINER_BEHAVIOR,
  BARTENDER_BEHAVIOR,
  PIRATE_BEHAVIOR,
];

// Legacy exports for backward compatibility (if needed elsewhere)
export const TRADER_RULES = TRADER_RULES_ARRAY;
export const MINER_RULES = MINER_RULES_ARRAY;
export const BARTENDER_RULES = BARTENDER_RULES_ARRAY;
export const PIRATE_RULES = PIRATE_RULES_ARRAY;

