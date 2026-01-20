import { DEFAULT_DELAY } from "../../consts";
import { MeepleInventoryItem, MeepleStateNames, Operator, ConditionType, MeepleRoles } from "../../types";
import type { ConditionSelfInventory } from "../../types";
import type { Meeple } from "../Meeple";
import type { Game } from "../Game";

export const ifLowFizzyDrinkBuyFizzyDrink = (
  bar: Meeple
): ConditionSelfInventory => ({
  description: "Buy fizzy drinks from the SpaceStore.",
  type: ConditionType.Inventory,
  property: MeepleInventoryItem.Fizzy,
  operator: Operator.LessThan,
  quantity: 100,
  target: bar, // Check the bar's inventory, not the bartender's
  action: (meeple: Meeple, game: Game) => {
    return {
      [MeepleStateNames.Idle]: () => {
        const spaceStore = game.getRandomMeepleByRole(MeepleRoles.SpaceStore);
        meeple.actions
          .callMethod(() => {
            meeple.dispatch({
              type: "travel",
              target: spaceStore,
            });
          })
          .moveTo(spaceStore.pos, meeple.speed)
          .callMethod(() => {
            meeple.dispatch({
              type: "visit",
              target: spaceStore,
            });
          })
          .delay(DEFAULT_DELAY)
          .callMethod(() => {
            // Bartender pays money to space store and receives fizzy drink
            meeple.dispatch({
              type: "buy",
              target: spaceStore,
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
