import {
  ComparisonOperator,
  LogicRuleActionType,
  MeepleStats,
  Products,
  Resources,
  createBehaviorId,
  createRuleId,
  type LogicRule,
  type RuleBehavior,
} from "./types";

/**
 * Default rules that are required for all meeples.
 * These rules are always at the top of the rules list and cannot be edited or removed.
 */
export const DEFAULT_RULES: LogicRule[] = [
  // Priority 1: If health is 0 or below, set broken state (ship stops moving and can't do anything)
  {
    id: createRuleId("default-set-broken-if-health-zero"),
    good: MeepleStats.Health,
    operator: ComparisonOperator.LessThanOrEqual,
    value: 0,
    action: LogicRuleActionType.SetBroken,
    required: true,
  },
  // Priority 2: Energy check - always go home if energy is low
  {
    id: createRuleId("default-go-home-if-energy-low"),
    good: MeepleStats.Energy,
    operator: ComparisonOperator.LessThanOrEqual,
    value: 0,
    action: LogicRuleActionType.RestAtApartments,
    required: true,
  },
];

const TRADER_RULES_ARRAY = [
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
  // Priority 2: If energy is above 0 and not already chasing, try to chase nearby traders
  {
    id: createRuleId("chase-trader"),
    good: MeepleStats.Energy,
    operator: ComparisonOperator.GreaterThan,
    value: 0,
    action: LogicRuleActionType.ChaseTarget,
  },
  // Priority 3: If energy is above 0, patrol (fly to random points)
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

/**
 * Merges default rules with custom rules, ensuring default rules are always at the top.
 * Filters out any custom rules that duplicate default rules (by action type).
 * Special handling for pirates: if custom rules include GoToPirateDen, replace
 * RestAtApartments in defaults with GoToPirateDen.
 * 
 * @param customRules - Custom rules to merge with defaults
 * @returns Combined rules array with defaults first, then custom rules
 */
export function mergeRulesWithDefaults(customRules: LogicRule[]): LogicRule[] {
  // Check if custom rules include GoToPirateDen (for pirates)
  const hasPirateDenRule = customRules.some(
    rule => rule.action === LogicRuleActionType.GoToPirateDen
  );
  
  // Create defaults, replacing RestAtApartments with GoToPirateDen for pirates
  const defaults = DEFAULT_RULES.map(rule => {
    if (hasPirateDenRule && rule.action === LogicRuleActionType.RestAtApartments) {
      return {
        ...rule,
        action: LogicRuleActionType.GoToPirateDen,
        id: createRuleId("default-go-to-pirate-den-if-energy-low"),
      };
    }
    return rule;
  });
  
  // Get default rule action types to filter duplicates
  const defaultActionTypes = new Set(
    defaults.map(rule => rule.action)
  );
  
  // Filter out custom rules that duplicate default rules
  const filteredCustomRules = customRules.filter(
    rule => !defaultActionTypes.has(rule.action) || rule.required === true
  );
  
  // Return defaults first, then custom rules
  return [...defaults, ...filteredCustomRules];
}

// Legacy exports for backward compatibility (if needed elsewhere)
export const TRADER_RULES = TRADER_RULES_ARRAY;
export const MINER_RULES = MINER_RULES_ARRAY;
export const BARTENDER_RULES = BARTENDER_RULES_ARRAY;
export const PIRATE_RULES = PIRATE_RULES_ARRAY;

