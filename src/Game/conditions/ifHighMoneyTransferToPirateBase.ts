import { DEFAULT_DELAY } from "../../consts";
import { MeepleInventoryItem, MeepleStateNames, Operator, ConditionType } from "../../types";
import type { ConditionSelfInventory } from "../../types";
import type { Meeple } from "../Meeple";
import type { Game } from "../Game";

// For pirate ships: if money > 100, fly home to pirate base and transfer all money to base
export const ifHighMoneyTransferToPirateBase = (): ConditionSelfInventory => ({
  description: "Return to pirate base and transfer all money.",
  type: ConditionType.Inventory,
  property: MeepleInventoryItem.Money,
  operator: Operator.GreaterThan,
  quantity: 100,
  action: (meeple: Meeple, _game: Game) => {
    const goHomeAndTransfer = () => {
      if (!meeple.home) {
        return;
      }
      const pirateBase = meeple.home;
      const moneyAmount = meeple.inventory[MeepleInventoryItem.Money];
      meeple.actions.clearActions();
      meeple.actions
        .callMethod(() => {
          meeple.dispatch({
            type: "travel",
            target: pirateBase,
          });
        })
        .moveTo(pirateBase.pos, meeple.speed)
        .callMethod(() => {
          meeple.dispatch({
            type: "visit",
            target: pirateBase,
          });
        })
        .delay(DEFAULT_DELAY)
        .callMethod(() => {
          meeple.dispatch({
            type: "transact",
            transaction: {
              from: meeple,
              to: pirateBase,
              property: MeepleInventoryItem.Money,
              quantity: moneyAmount,
            },
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
    };

    return {
      [MeepleStateNames.Idle]: goHomeAndTransfer,
      [MeepleStateNames.Chasing]: goHomeAndTransfer,
      [MeepleStateNames.Patrolling]: goHomeAndTransfer,
    };
  },
});
