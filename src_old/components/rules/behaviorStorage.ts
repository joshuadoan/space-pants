import { createBehaviorId, createRuleId, type RuleBehavior } from "../../entities/types";

const STORAGE_KEY = "space-pants-custom-rule-behaviors";

/**
 * Load custom behaviors from localStorage
 * Converts plain string IDs from JSON to branded types
 */
export function loadCustomBehaviors(): RuleBehavior[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Array<Omit<RuleBehavior, "id"> & { id: string; rules: Array<Omit<RuleBehavior["rules"][0], "id"> & { id: string }> }>;
      return parsed.map(behavior => ({
        ...behavior,
        id: createBehaviorId(behavior.id),
        rules: behavior.rules.map(rule => ({
          ...rule,
          id: createRuleId(rule.id),
        })),
      }));
    }
  } catch (error) {
    console.error("Failed to load custom behaviors:", error);
  }
  return [];
}

/**
 * Save custom behaviors to localStorage
 */
export function saveCustomBehaviors(behaviors: RuleBehavior[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(behaviors));
  } catch (error) {
    console.error("Failed to save custom behaviors:", error);
  }
}

