import { ComparisonOperator, type LogicRule } from "../entities/types";

export function evaluateRule(rule: LogicRule, value: number): boolean {
  switch (rule.operator) {
    case ComparisonOperator.Equal:
      return value === rule.value;
    case ComparisonOperator.LessThan:
      return value < rule.value;
    case ComparisonOperator.GreaterThan:
      return value > rule.value;
    case ComparisonOperator.LessThanOrEqual:
      return value <= rule.value;
    case ComparisonOperator.GreaterThanOrEqual:
      return value >= rule.value;
    default:
      return false;
  }
}

