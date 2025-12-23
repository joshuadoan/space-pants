import type { Inventory } from "../entities/Meeple";
import { Operator, type Condition } from "../entities/types";

export function evaluateCondition(condition: Condition, inventory: Inventory): boolean {
  const currentValue = inventory[condition.good];
  const targetValue = condition.value;

  switch (condition.operator) {
    case Operator.Equal:
      return currentValue === targetValue;
    case Operator.LessThan:
      return currentValue < targetValue;
    case Operator.GreaterThan:
      return currentValue > targetValue;
    case Operator.LessThanOrEqual:
      return currentValue <= targetValue;
    case Operator.GreaterThanOrEqual:
      return currentValue >= targetValue;
    case Operator.NotEqual:
      return currentValue !== targetValue;
    default:
      return false;
  }
}