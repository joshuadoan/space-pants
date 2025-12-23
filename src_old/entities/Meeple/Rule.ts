import { evaluateRule } from "../../utils/ruleUtils";
import { executeRuleAction } from "./executeRuleAction";
import type { Meeple } from "./Meeple";
import { MeepleStateType, Products, Resources, MeepleStats, type LogicRule, type RuleId, type DiaryEntry, type Goods } from "../types";

/**
 * Rule class that handles the evaluation and execution of rules for Meeple entities.
 */
export class Rule {
  private meeple: Meeple;
  private isRecordingRuleExecution: boolean = false;

  constructor(meeple: Meeple) {
    this.meeple = meeple;
  }

  /**
   * Evaluates rules and executes the first matching rule
   */
  public evaluateRules(): void {
    let ruleMatched = false;

    for (const rule of this.meeple.rules) {
      // For product-type goods, use rule's productType or fall back to meeple's productType
      const isProductGood = Object.values(Products).includes(
        rule.good as Products
      );
      const goodToCheck =
        isProductGood && rule.productType
          ? rule.productType
          : isProductGood && !rule.productType
          ? this.meeple.productType
          : rule.good;

      if (evaluateRule(rule, this.meeple.goods[goodToCheck] ?? 0)) {
        this.meeple.activeRuleId = rule.id;
        this.isRecordingRuleExecution = true;
        const actionExecuted = executeRuleAction(this.meeple, rule);
        this.isRecordingRuleExecution = false;

        if (actionExecuted) {
          const targetName = "target" in this.meeple.state ? this.meeple.state.target?.name ?? null : null;
          const goodsSnapshot = { ...this.meeple.goods };
          this.addDiaryEntry({
            ruleId: rule.id,
            action: rule.action,
            state: this.meeple.state.type,
            targetName,
            goods: goodsSnapshot,
          });
          ruleMatched = true;
          break; // Only execute one rule per update cycle
        }
      }
    }

    // Clear active rule if no rule matched and meeple is idle
    if (!ruleMatched && this.meeple.state.type === MeepleStateType.Idle) {
      this.meeple.activeRuleId = null;
    }
  }

  /**
   * Add an entry to the diary, maintaining a maximum of 20 entries
   * Creates a new array to ensure React detects the change
   */
  private addDiaryEntry(entry: Omit<DiaryEntry, "timestamp">): void {
    const fullEntry: DiaryEntry = {
      ...entry,
      timestamp: Date.now(),
    };
    // Create a new array instead of mutating to ensure React detects changes
    const newDiary = [...this.meeple.diary, fullEntry];
    // Keep only the last 20 entries
    if (newDiary.length > 20) {
      this.meeple.diary = newDiary.slice(-20);
    } else {
      this.meeple.diary = newDiary;
    }
  }

  /**
   * Checks if rules can be evaluated (action queue is complete)
   */
  public canEvaluateRules(): boolean {
    try {
      return this.meeple.actions.getQueue().isComplete();
    } catch (error) {
      console.warn("Action queue check failed for", this.meeple.name, error);
      return true; // Allow rule evaluation on error
    }
  }

  /**
   * Checks if enough time has passed to evaluate rules
   */
  public shouldEvaluateRules(): boolean {
    const currentTime = Date.now();
    if (this.meeple.lastUpdateTime === 0) {
      this.meeple.lastUpdateTime = currentTime;
    }
    if (currentTime - this.meeple.lastUpdateTime < MEEPLE_UPDATE_INTERVAL_MS) {
      return false;
    }
    this.meeple.lastUpdateTime = currentTime;
    return true;
  }
}

// Import constants from game-config
import {
  MEEPLE_UPDATE_INTERVAL_MS
} from "../game-config";
