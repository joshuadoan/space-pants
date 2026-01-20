import { DEFAULT_DELAY, TRANSMUTATION_RATIOS } from "../../consts";
import { MeepleInventoryItem, MeepleStateNames, Operator, ConditionType } from "../../types";
import type { ConditionSelfInventory } from "../../types";
import type { Meeple } from "../Meeple";

/// turn ore into money
export const ifOreTurnIntoFizzy = (): ConditionSelfInventory => ({
  description: "Convert 1 ore into 10 fizzy drinks and 10 money.",
  type: ConditionType.Inventory,
  property: MeepleInventoryItem.Minirals,
  operator: Operator.GreaterThanOrEqual,
  quantity: 1,
  action: (meeple: Meeple) => {
    return {
      [MeepleStateNames.Idle]: () => {
        meeple.actions
          .callMethod(() => {
            meeple.dispatch({
              type: "transmutation",
              fromProperty: MeepleInventoryItem.Minirals,
              toProperty: MeepleInventoryItem.Fizzy,
              fromQuantity: 1,
              toQuantity:
                TRANSMUTATION_RATIOS[MeepleInventoryItem.Minirals][
                MeepleInventoryItem.Fizzy
                ],
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
