import type { LogicRule } from "../../entities/types";
import { Resources, ComparisonOperator, LogicRuleActionType } from "../../entities/types";

/**
 * Generate a random ID for a rule
 */
export function generateRuleId(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Create a default rule for new behaviors
 */
export function createDefaultRule(): LogicRule {
  return {
    id: generateRuleId(),
    good: Resources.Ore,
    operator: ComparisonOperator.Equal,
    value: 0,
    action: LogicRuleActionType.MineOre,
  };
}

/**
 * Create a new rule with default values for adding to existing rules
 */
export function createNewRule(): LogicRule {
  return {
    id: generateRuleId(),
    good: Resources.Money,
    operator: ComparisonOperator.Equal,
    value: 0,
    action: LogicRuleActionType.Socialize,
  };
}

