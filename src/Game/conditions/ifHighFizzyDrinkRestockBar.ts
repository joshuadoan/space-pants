import { DEFAULT_DELAY } from "../../consts";
import { MeepleInventoryItem, MeepleStateNames, Operator, ConditionType } from "../../types";
import type { ConditionSelfInventory } from "../../types";
import type { Meeple } from "../Meeple";
import type { Game } from "../Game";

/// for bartenders
// if fizzy drink is >= 1 then fly back to
// the bar and restock fizzy drinks
export const ifHighFizzyDrinkRestockBar = (): ConditionSelfInventory => ({
  description: "Return to the bar and restock it with fizzy drinks.",
  type: ConditionType.Inventory,
  property: MeepleInventoryItem.Fizzy,
  operator: Operator.GreaterThanOrEqual,
  quantity: 1,
  action: (meeple: Meeple, _game: Game) => {
    return {
      [MeepleStateNames.Idle]: () => {
        if (!meeple.home) {
          return;
        }
        const bar = meeple.home;
        meeple.actions
          .callMethod(() => {
            meeple.dispatch({
              type: "travel",
              target: bar,
            });
          })
          .moveTo(bar.pos, meeple.speed)
          .callMethod(() => {
            meeple.dispatch({
              type: "visit",
              target: bar,
            });
          })
          .delay(DEFAULT_DELAY)
          .callMethod(() => {
            meeple.dispatch({
              type: "sell",
              target: bar,
              property: MeepleInventoryItem.Fizzy,
              quantity: 1,
              price: 2,
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
