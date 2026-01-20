import { MeepleInventoryItem, MeepleStateNames, Operator, ConditionType, MeepleRoles } from "../../types";
import type { ConditionSelfInventory } from "../../types";
import type { Meeple } from "../Meeple";
import type { Game } from "../Game";

export function patrolForRole(role: MeepleRoles): ConditionSelfInventory {
  return {
    description: `Patrol for ${role}`,
    type: ConditionType.Inventory,
    property: MeepleInventoryItem.Money,
    operator: Operator.LessThan,
    quantity: 100,
    action: (meeple: Meeple, game: Game) => {
      const startPatrol = () => {
        meeple.actions
          .callMethod(() => {
            meeple.dispatch({
              type: "patrol-for-role",
              role: role,
            });
          })
          .moveTo(game.getRandomPointInGame(), meeple.speed)
          .callMethod(() => {
            meeple.dispatch({
              type: "finish",
              state: {
                type: MeepleStateNames.Idle,
              },
            });
          });
      };

      return {
        [MeepleStateNames.Idle]: startPatrol,
        // When patrolling and reaching destination, continue patrolling
        [MeepleStateNames.Patrolling]: startPatrol,
      };
    },
  };
}
