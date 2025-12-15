import {
  BUY_PRODUCT_MONEY_THRESHOLD,
  MECHANIC_SOCIALIZE_MONEY_THRESHOLD,
  MINER_SELL_ORE_THRESHOLD,
  SOCIALIZE_MONEY_THRESHOLD,
} from "./economy-config";
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
  // Priority 2: If money is greater than or equal to threshold, go to a random social place (SpaceBar, SpaceCafe, SpaceDance, or SpaceFun) to socialize
  {
    id: createRuleId("go-to-space-bar"),
    good: Resources.Money,
    operator: ComparisonOperator.GreaterThanOrEqual,
    value: SOCIALIZE_MONEY_THRESHOLD,
    action: LogicRuleActionType.SocializeAtBar,
    // destinationType not specified, so it will randomly select from all social places
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
    value: BUY_PRODUCT_MONEY_THRESHOLD, // Minimum to buy one product
    action: LogicRuleActionType.BuyProductFromStation,
  },
] satisfies LogicRule[];

const MINER_RULES_ARRAY = [
  // if money is greater than or equal to threshold go to a random social place (SpaceBar, SpaceCafe, SpaceDance, or SpaceFun)
  {
    id: createRuleId("go-to-space-bar"),
    good: Resources.Money,
    operator: ComparisonOperator.GreaterThanOrEqual,
    value: SOCIALIZE_MONEY_THRESHOLD,
    action: LogicRuleActionType.SocializeAtBar,
    // destinationType not specified, so it will randomly select from all social places
  },
  // if ore is greater than or equal to threshold, trade it for money
  {
    id: createRuleId("trade-ore-for-money"),
    good: Resources.Ore,
    operator: ComparisonOperator.GreaterThanOrEqual,
    value: MINER_SELL_ORE_THRESHOLD,
    action: LogicRuleActionType.SellOreToStation,
  },
  // if ore is less than threshold, continue mining
  {
    id: createRuleId("mine-ore"),
    good: Resources.Ore,
    operator: ComparisonOperator.LessThan,
    value: MINER_SELL_ORE_THRESHOLD,
    action: LogicRuleActionType.MineOreFromAsteroid,
  },
] satisfies LogicRule[];

const BARTENDER_RULES_ARRAY = [
  // Priority 2: If money is at threshold or above, go shopping for products
  {
    id: createRuleId("go-shopping"),
    good: Resources.Money,
    operator: ComparisonOperator.GreaterThanOrEqual,
    value: SOCIALIZE_MONEY_THRESHOLD,
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

const MECHANIC_RULES_ARRAY = [
  // Priority 2: If money is greater than or equal to threshold, go to a random social place (SpaceBar, SpaceCafe, SpaceDance, or SpaceFun) to socialize
  {
    id: createRuleId("go-to-space-bar"),
    good: Resources.Money,
    operator: ComparisonOperator.GreaterThanOrEqual,
    value: MECHANIC_SOCIALIZE_MONEY_THRESHOLD,
    action: LogicRuleActionType.SocializeAtBar,
    // destinationType not specified, so it will randomly select from all social places
  },
  // Priority 3: Look for and fix broken meeples (always active when energy >= 0)
  // This allows mechanics to work and earn money, then socialize when they have enough
  {
    id: createRuleId("fix-broken-meeple"),
    good: MeepleStats.Energy,
    operator: ComparisonOperator.GreaterThanOrEqual,
    value: 0,
    action: LogicRuleActionType.FixBrokenMeeple,
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

export const MECHANIC_BEHAVIOR = {
  id: createBehaviorId("mechanic"),
  name: "Mechanic",
  rules: MECHANIC_RULES_ARRAY,
} satisfies RuleBehavior;

// Export all built-in behaviors as an array
export const BUILT_IN_BEHAVIORS: RuleBehavior[] = [
  TRADER_BEHAVIOR,
  MINER_BEHAVIOR,
  BARTENDER_BEHAVIOR,
  PIRATE_BEHAVIOR,
  MECHANIC_BEHAVIOR,
];

/**
 * Merges default rules with custom rules, ensuring default rules are always at the top.
 * Filters out any custom rules that duplicate default rules (by action type).
 * Special handling for pirates: if custom rules include GoToPirateDen or if this is
 * PIRATE_RULES, replace RestAtApartments in defaults with GoToPirateDen.
 * 
 * @param customRules - Custom rules to merge with defaults
 * @returns Combined rules array with defaults first, then custom rules
 */
export function mergeRulesWithDefaults(customRules: LogicRule[]): LogicRule[] {
  // Check if custom rules include GoToPirateDen (for pirates)
  const hasPirateDenRule = customRules.some(
    rule => rule.action === LogicRuleActionType.GoToPirateDen
  );
  
  // Check if this is PIRATE_RULES by checking for pirate-specific actions
  const isPirateRules = customRules.some(
    rule => rule.action === LogicRuleActionType.Patrol || rule.action === LogicRuleActionType.ChaseTarget
  );
  
  // Create defaults, replacing RestAtApartments with GoToPirateDen for pirates
  const defaults = DEFAULT_RULES.map(rule => {
    if ((hasPirateDenRule || isPirateRules) && rule.action === LogicRuleActionType.RestAtApartments) {
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
export const MECHANIC_RULES = MECHANIC_RULES_ARRAY;

