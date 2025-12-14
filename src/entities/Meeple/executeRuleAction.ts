import { PIRATE_CHASE_DETECTION_DISTANCE } from "../game-config";
import { LogicRuleActionType, MeepleType, type LogicRule } from "../types";
import { executeChaseTarget } from "./executeChaseTarget";
import { executeChillingAtHome } from "./executeChillingAtHome";
import { executeFixBrokenMeeple } from "./executeFixBrokenMeeple";
import { executeGoSelling } from "./executeGoSelling";
import { executeGoShopping } from "./executeGoShopping";
import { executeGoToPirateDen } from "./executeGoToPirateDen";
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
      executeTradeOreForMoney(meeple, rule.destinationName, rule.destinationType);
      return true;
    case LogicRuleActionType.SocializeAtBar:
      executeSocialize(meeple, rule.destinationName, rule.destinationType);
      return true;
    case LogicRuleActionType.WorkAtBar:
      executeWork(meeple, rule.destinationName, rule.destinationType);
      return true;
    case LogicRuleActionType.BuyProductFromStation:
      executeGoShopping(meeple, rule.productType, rule.destinationName, rule.destinationType);
      return true;
    case LogicRuleActionType.SellProductToStation:
      executeGoSelling(meeple, rule.productType, rule.destinationName, rule.destinationType);
      return true;
    case LogicRuleActionType.RestAtApartments:
      executeChillingAtHome(meeple, rule.destinationName, rule.destinationType);
      return true;
    case LogicRuleActionType.Patrol:
      executePatrol(meeple);
      return true;
    case LogicRuleActionType.GoToPirateDen:
      executeGoToPirateDen(meeple, rule.destinationName, rule.destinationType);
      return true;
    case LogicRuleActionType.ChaseTarget:
      // Find a nearby target (trader, miner, or player) to chase (only if not already chasing)
      if (meeple.chaseTarget) {
        // Already chasing, don't start a new chase - rule was not executed
        return false;
      }
      const scene = meeple.scene;
      if (scene) {
        const allActors = scene.actors.filter(
          (actor) => actor instanceof Meeple
        ) as Meeple[];
        // Find the nearest target (trader, miner, or player) within detection distance
        const nearbyTarget = allActors.find((m) => {
          if (m === meeple) return false;
          // Pirates can chase traders, miners, and players
          if (m.type !== MeepleType.Trader && 
              m.type !== MeepleType.Miner && 
              m.type !== MeepleType.Player) {
            return false;
          }
          const distance = meeple.pos.distance(m.pos);
          return distance <= PIRATE_CHASE_DETECTION_DISTANCE;
        });
        if (nearbyTarget) {
          executeChaseTarget(meeple, nearbyTarget);
          return true; // Chase was started
        }
      }
      // No nearby target found - rule was not executed, should try next rule
      return false;
    case LogicRuleActionType.SetBroken:
      // Set the meeple to broken state and stop movement
      meeple.stopMovement();
      meeple.dispatch({ type: "set-broken" });
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

