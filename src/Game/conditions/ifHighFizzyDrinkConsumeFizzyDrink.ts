import { DEFAULT_DELAY } from "../../consts";
import { MeepleInventoryItem, MeepleStateNames, Operator, ConditionType } from "../../types";
import type { ConditionSelfInventory } from "../../types";
import type { Meeple } from "../Meeple";

// If fizzy drink is >= 1 then consume fizzy drink
export const ifHighFizzyDrinkConsumeFizzyDrink =
  (): ConditionSelfInventory => ({
    description: "Consume a fizzy drink.",
    type: ConditionType.Inventory,
    property: MeepleInventoryItem.Fizzy,
    operator: Operator.GreaterThanOrEqual,
    quantity: 1,
    action: (meeple: Meeple) => {
      return {
        [MeepleStateNames.Idle]: () => {
          meeple.actions
            .callMethod(() => {
              meeple.dispatch({
                type: "consume",
                property: MeepleInventoryItem.Fizzy,
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
