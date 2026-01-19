import { DEFAULT_DELAY } from "../../consts";
import { MeepleInventoryItem, MeepleStateNames, Operator, ConditionType, MeepleRoles } from "../../types";
import type { ConditionSelfInventory } from "../../types";
import type { Meeple } from "../Meeple";
import type { Game } from "../Game";

export const ifHasMoneyBuyFizzyDrink = (): ConditionSelfInventory => ({
  description: "Buy a fizzy drink from the space bar.",
  type: ConditionType.Inventory,
  property: MeepleInventoryItem.Money,
  operator: Operator.GreaterThanOrEqual,
  quantity: 1,
  action: (meeple: Meeple, game: Game) => {
    return {
      [MeepleStateNames.Idle]: () => {
        const target = game.getRandomMeepleByRole(MeepleRoles.SpaceBar);
        meeple.actions
          .callMethod(() => {
            meeple.dispatch({
              type: "travel",
              target: target,
            });
          })
          .moveTo(target.pos, meeple.speed)
          .callMethod(() => {
            meeple.dispatch({
              type: "visit",
              target: target,
            });
          })
          .delay(DEFAULT_DELAY)
          .callMethod(() => {
            // Buy fizzy drink: pay money to bar, receive fizzy drink
            meeple.dispatch({
              type: "buy",
              target: target,
              property: MeepleInventoryItem.Fizzy,
              quantity: 1,
              price: 1,
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
