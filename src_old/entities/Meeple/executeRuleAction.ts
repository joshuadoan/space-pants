import { LogicRuleActionType, MeepleStateType, type LogicRule } from "../types";
import { executeChaseTarget } from "./executeChaseTarget";
import { findChaseTarget } from "./meepleFinders";
import { executeChillingAtHome } from "./executeChillingAtHome";
import { executeFixBrokenMeeple } from "./executeFixBrokenMeeple";
import { executeGoSelling } from "./executeGoSelling";
import { executeGoShopping } from "./executeGoShopping";
import { executeMineOre } from "./executeMineOre";
import { executePatrol } from "./executePatrol";
import { executeSocialize } from "./executeSocialize";
import { executeTradeOreForMoney } from "./executeTradeOreForMoney";
import { executeWork } from "./executeWork";
import { Meeple } from "./Meeple";

/**
 * Executes a rule action for a meeple.
 * @returns true if the action was actually executed, false otherwise.
 * This is used to determine if rule evaluation should continue to the next rule.
 */
export function executeRuleAction(meeple: Meeple, rule: LogicRule): boolean {
  switch (rule.action) {
    case LogicRuleActionType.MineOreFromAsteroid:
      executeMineOre(meeple, rule.destinationName, rule.destinationType);
      return true;
    case LogicRuleActionType.SellOreToStation:
      executeTradeOreForMoney(
        meeple,
        rule.destinationName,
        rule.destinationType
      );
      return true;
    case LogicRuleActionType.SocializeAtBar:
      executeSocialize(meeple, rule.destinationName, rule.destinationType);
      return true;
    case LogicRuleActionType.WorkAtBar:
      executeWork(meeple, rule.destinationName, rule.destinationType);
      return true;
    case LogicRuleActionType.BuyProductFromStation:
      executeGoShopping(
        meeple,
        rule.productType,
        rule.destinationName,
        rule.destinationType
      );
      return true;
    case LogicRuleActionType.SellProductToStation:
      executeGoSelling(
        meeple,
        rule.productType,
        rule.destinationName,
        rule.destinationType
      );
      return true;
    case LogicRuleActionType.RestAtApartments:
      executeChillingAtHome(meeple, rule.destinationName, rule.destinationType);
      return true;
    case LogicRuleActionType.Patrol:
      executePatrol(meeple);
      return true;
    case LogicRuleActionType.ChaseTarget:
      // Find a target to chase (only if not already chasing)
      if (meeple.state.type === MeepleStateType.Chasing || !meeple.scene) {
        // Already chasing, don't start a new chase - rule was not executed
        return false;
      }
      // Use helper function to find target by name, type, or proximity
      const target = findChaseTarget(
        meeple,
        rule.destinationName,
        rule.destinationType
      );
      if (target) {
        executeChaseTarget(meeple, target);
        return true; // Chase was started
      }
      // No target found - rule was not executed, should try next rule
      return false;
    case LogicRuleActionType.SetBroken:
      // Set the meeple to broken state and handle all broken state setup
      // Only set broken if not already broken
      if (meeple.state.type !== MeepleStateType.Broken) {
        // Cancel all actions immediately
        meeple.actions.clearActions();
        meeple.stopMovement();
        
        // Store original speed before breaking
        if (meeple.originalSpeed === null) {
          meeple.originalSpeed = meeple.speed;
        }
        // Set speed to zero when broken
        meeple.speed = 0;
        
        // Stop any ongoing chase
        if (meeple.chaseTarget) {
          meeple.chaseTarget = null;
          meeple.hasStolen = false;
        }
        
        // Set broken state
        meeple.dispatch({ type: "set-broken" });
      }
      return true;
    case LogicRuleActionType.FixBrokenMeeple:
      // Find and fix a broken meeple
      return executeFixBrokenMeeple(meeple);
    default:
      // TypeScript exhaustiveness check - if we get here, we've missed a case
      const _exhaustive: never = rule.action;
      void _exhaustive; // Mark as intentionally unused
      return false;
  }
}
