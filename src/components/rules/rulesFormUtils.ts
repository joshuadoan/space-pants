import {
  createBehaviorId,
  type BehaviorId,
  type LogicRule,
  type RuleBehavior,
} from "../../entities/types";
import { rulesArraysEqual } from "./ruleUtils";

/**
 * Validation result for rules
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate that all rules are complete
 */
export function validateRules(rules: LogicRule[]): ValidationResult {
  const errors: string[] = [];

  if (rules.length === 0) {
    errors.push("At least one rule is required");
    return { isValid: false, errors };
  }

  rules.forEach((rule, index) => {
    if (!rule.good) {
      errors.push(`Rule ${index + 1}: Good is required`);
    }
    if (!rule.operator) {
      errors.push(`Rule ${index + 1}: Operator is required`);
    }
    if (rule.value === undefined || rule.value === null || isNaN(rule.value)) {
      errors.push(`Rule ${index + 1}: Value is required`);
    }
    if (!rule.action) {
      errors.push(`Rule ${index + 1}: Action is required`);
    }
  });

  return { isValid: errors.length === 0, errors };
}

/**
 * Find a matching behavior for the given rules
 */
export function findMatchingBehavior(
  rules: LogicRule[],
  allBehaviors: RuleBehavior[]
): BehaviorId | "" {
  const nonRequiredRules = rules.filter((rule) => !rule.required);

  const matchingBehavior = allBehaviors.find((behavior) =>
    rulesArraysEqual(
      behavior.rules.filter((rule) => !rule.required),
      nonRequiredRules
    )
  );

  return matchingBehavior ? matchingBehavior.id : "";
}

/**
 * Check if a behavior still matches the given rules
 */
export function behaviorStillMatches(
  behaviorId: BehaviorId | "",
  rules: LogicRule[],
  allBehaviors: RuleBehavior[]
): boolean {
  if (!behaviorId) return false;

  const behavior = allBehaviors.find((b) => b.id === behaviorId);
  if (!behavior) return false;

  const nonRequiredRules = rules.filter((rule) => !rule.required);
  return rulesArraysEqual(
    behavior.rules.filter((rule) => !rule.required),
    nonRequiredRules
  );
}

/**
 * Check if a behavior name already exists
 */
export function behaviorNameExists(
  name: string,
  allBehaviors: RuleBehavior[]
): boolean {
  return allBehaviors.some(
    (b) => b.name.toLowerCase() === name.trim().toLowerCase()
  );
}

/**
 * Generate a unique behavior ID
 */
export function generateBehaviorId(): BehaviorId {
  return createBehaviorId(
    `custom-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  );
}

