import { MeepleStateType, MeepleType } from "../types";
import type { Meeple } from "./Meeple";

/**
 * Initiates a chase sequence where a pirate chases a target (trader, miner, or player).
 * The actual chasing logic is handled in Meeple.onPreUpdate().
 */
export function executeChaseTarget(meeple: Meeple, target: Meeple): void {
  // Pirates can chase traders, miners, and players
  if (!target || 
      (target.type !== MeepleType.Trader && 
       target.type !== MeepleType.Miner && 
       target.type !== MeepleType.Player)) {
    return;
  }

  // Set the chase target and start time
  meeple.chaseTarget = target;
  meeple.chaseStartTime = Date.now();
  meeple.lastLaserFireTime = 0; // Initialize laser fire time
  meeple.hasStolen = false;

  // Set state to chasing
  meeple.dispatch({
    type: "set-active-state",
    payload: {
      stateType: MeepleStateType.Chasing,
      target,
    },
  });
}

