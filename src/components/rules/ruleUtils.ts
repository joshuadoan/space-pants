import {
  ComparisonOperator,
  LogicRuleActionType,
  Resources,
  createRuleId,
  type LogicRule,
  type RuleId,
} from "../../entities/types";

/**
 * Generate a random ID for a rule
 */
export function generateRuleId(): RuleId {
  const id = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}`;
  return createRuleId(id);
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
    action: LogicRuleActionType.MineOreFromAsteroid,
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
    action: LogicRuleActionType.SocializeAtBar,
  };
}

/**
 * Compare two rules ignoring their IDs
 */
function rulesEqual(rule1: LogicRule, rule2: LogicRule): boolean {
  return (
    rule1.good === rule2.good &&
    rule1.operator === rule2.operator &&
    rule1.value === rule2.value &&
    rule1.action === rule2.action &&
    rule1.productType === rule2.productType &&
    rule1.destinationType === rule2.destinationType &&
    rule1.destinationName === rule2.destinationName
  );
}

/**
 * Compare two arrays of rules (ignoring IDs and order)
 */
export function rulesArraysEqual(rules1: LogicRule[], rules2: LogicRule[]): boolean {
  if (rules1.length !== rules2.length) {
    return false;
  }

  // Create copies and sort by a stable key (good + operator + value + action)
  const normalize = (rules: LogicRule[]) => {
    return [...rules].sort((a, b) => {
      const keyA = `${a.good}-${a.operator}-${a.value}-${a.action}-${a.productType || ''}-${a.destinationType || ''}-${a.destinationName || ''}`;
      const keyB = `${b.good}-${b.operator}-${b.value}-${b.action}-${b.productType || ''}-${b.destinationType || ''}-${b.destinationName || ''}`;
      return keyA.localeCompare(keyB);
    });
  };

  const sorted1 = normalize(rules1);
  const sorted2 = normalize(rules2);

  return sorted1.every((rule1, index) => rulesEqual(rule1, sorted2[index]));
}

