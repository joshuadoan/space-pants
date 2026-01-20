import { DEFAULT_DELAY } from "../../consts";
import { MeepleInventoryItem, MeepleStateNames, Operator, ConditionType } from "../../types";
import type { ConditionSelfInventory } from "../../types";
import type { Meeple } from "../Meeple";

/// If ore is less than 100 then generate ore
export const ifLowOreGenerateOre = (): ConditionSelfInventory => ({
  description: "Generate ore reserves.",
  type: ConditionType.Inventory,
  property: MeepleInventoryItem.Minirals,
  operator: Operator.LessThan,
  quantity: 100,
  action: (meeple: Meeple) => {
    return {
      [MeepleStateNames.Idle]: () => {
        meeple.actions
          .callMethod(() => {
            meeple.dispatch({
              type: "generate",
              property: MeepleInventoryItem.Minirals,
              quantity: 1,
            });
          })
          .delay(DEFAULT_DELAY)
          .callMethod(() => {
            meeple.dispatch({
              type: "finish",
              state: {
                type: MeepleStateNames.Idle,
              },
            });
          });
      },
    };
  },
});
