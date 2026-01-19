import { MeepleStateNames, Operator, ConditionType, MeepleRoles } from "../../types";
import type { ConditionSelfRadar } from "../../types";
import type { Meeple } from "../Meeple";

// ConditionSelfRadar
export const ifTargetThenChase = (): ConditionSelfRadar => ({
  description: `Chase target if found in radar`,
  type: ConditionType.Radar,
  roles: [MeepleRoles.Miner, MeepleRoles.Bartender],
  operator: Operator.LessThan,
  action: function (meeple: Meeple) {
    return {
      [MeepleStateNames.Idle]: () => {
        const target = this.target;
        if (target) {
          meeple.actions.clearActions();
          meeple.dispatch({
            type: "chase",
            target: target,
            startTime: Date.now(),
          });
        }
      },
      // same for patrolling
      [MeepleStateNames.Patrolling]: () => {
        const target = this.target;
        if (target) {
          meeple.actions.clearActions();
          meeple.dispatch({
            type: "chase",
            target: target,
            startTime: Date.now(),
          });
        }
      },
    };
  },
});
