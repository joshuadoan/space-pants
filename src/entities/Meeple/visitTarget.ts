import { MeepleStateType } from "../types";
import type { Meeple } from "./Meeple";

/**
 * Makes a meeple visit a target, execute an action, and return to idle state.
 */
export function visitTarget(
  meeple: Meeple,
  target: Meeple,
  activeStateType: MeepleStateType,
  actionCallback: () => void,
  delayMs: number
): void {
  meeple.actions
    .callMethod(() => {
      console.log("Traveling to", target.name);
      meeple.dispatch({
        type: "set-traveling",
        payload: { target },
      });
    })
    .meet(target, meeple.speed)
    .callMethod(() => target.visitors.add(meeple))
    .callMethod(() => {
      meeple.dispatch({
        type: "set-active-state",
        payload: { stateType: activeStateType, target },
      });
    })
    .callMethod(actionCallback)
    .delay(delayMs)
    .callMethod(() => target.visitors.delete(meeple))
    .callMethod(() => {
      meeple.dispatch({ type: "set-idle" });
    });
}

