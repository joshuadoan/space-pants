import { DEFAULT_DELAY, SELL_PRICES } from "../../consts";
import { MeepleInventoryItem, MeepleStateNames, Operator, ConditionType, MeepleRoles } from "../../types";
import type { ConditionSelfInventory } from "../../types";
import type { Meeple } from "../Meeple";
import type { Game } from "../Game";

export const ifOreSellToSpaceStore = (): ConditionSelfInventory => ({
  description: "Sell ore at the SpaceStore for money.",
  type: ConditionType.Inventory,
  property: MeepleInventoryItem.Minirals,
  operator: Operator.GreaterThanOrEqual,
  quantity: 1,
  action: (meeple: Meeple, game: Game) => {
    return {
      [MeepleStateNames.Mining]: () => {
        const target = game.getRandomMeepleByRole(MeepleRoles.SpaceStore);
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
            meeple.dispatch({
              type: "sell",
              target: target,
              property: MeepleInventoryItem.Minirals,
              quantity: 1,
              price: SELL_PRICES[MeepleInventoryItem.Minirals],
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
