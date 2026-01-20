import { MeepleInventoryItem, MeepleStateNames, Operator, ConditionType, MeepleRoles } from "../../types";
import type { ConditionSelfInventory } from "../../types";
import type { Meeple } from "../Meeple";
import type { Game } from "../Game";

export const ifNoMoneyMineOre = (): ConditionSelfInventory => ({
  description: "Travel to an asteroid field and mine ore.",
  type: ConditionType.Inventory,
  property: MeepleInventoryItem.Minirals,
  operator: Operator.LessThan,
  quantity: 1,
  action: (meeple: Meeple, game: Game) => {
    const target = game.getRandomMeepleByRole(MeepleRoles.Asteroid);
    return {
      [MeepleStateNames.Idle]: () => {
        meeple.travelToAndVisit(target);
      },
      [MeepleStateNames.Visiting]: () => {
        meeple.dispatch({
          type: "mine",
          target,
          property: MeepleInventoryItem.Minirals,
          quantity: 1,
        });
      },
    };
  },
});
