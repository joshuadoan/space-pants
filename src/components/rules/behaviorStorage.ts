import type { RuleBehavior } from "../../entities/types";

const STORAGE_KEY = "space-pants-custom-rule-behaviors";

/**
 * Load custom behaviors from localStorage
 */
export function loadCustomBehaviors(): RuleBehavior[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
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

