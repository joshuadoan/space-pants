import { DEFAULT_DELAY } from "../../consts";
import { MeepleInventoryItem, MeepleStateNames, Operator, ConditionType, MeepleRoles } from "../../types";
import type { ConditionSelfInventory } from "../../types";
import  { Meeple } from "../Meeple";
import type { Game } from "../Game";

/// For bankers: if bank (home) has >= 7 money, find a space store with negative money and transfer 7 money to it
export const ifSpaceStoreNeedsMoneyTransfer = (
  bank: Meeple
): ConditionSelfInventory => ({
  description: "Find space store with negative money and transfer money from bank.",
  type: ConditionType.Inventory,
  property: MeepleInventoryItem.Money,
  operator: Operator.GreaterThanOrEqual,
  quantity: 7,
  // Check the bank's inventory, not the banker's own inventory
  target: bank,
  action: (meeple: Meeple, game: Game) => {
    return {
      [MeepleStateNames.Idle]: () => {
        // Check if bank has at least 7 money
        if (bank.inventory[MeepleInventoryItem.Money] < 7) {
          return;
        }

        // Find all space stores with negative money
        const spaceStores = game.currentScene.actors.filter(
          (actor): actor is Meeple =>
            actor instanceof Meeple &&
            actor.roleId === MeepleRoles.SpaceStore &&
            actor.inventory[MeepleInventoryItem.Money] < 0
        );

        if (spaceStores.length === 0) {
          return; // No space stores need money
        }

        // Pick a random space store that needs money
        const targetStore = spaceStores[Math.floor(Math.random() * spaceStores.length)];

        // First, go to the bank to get money
        meeple.actions
          .callMethod(() => {
            meeple.dispatch({
              type: "travel",
              target: bank,
            });
          })
          .moveTo(bank.pos, meeple.speed)
          .callMethod(() => {
            meeple.dispatch({
              type: "visit",
              target: bank,
            });
          })
          .delay(DEFAULT_DELAY)
          .callMethod(() => {
            // Transfer 7 money from bank to banker
            meeple.dispatch({
              type: "transact",
              transaction: {
                from: bank,
                to: meeple,
                property: MeepleInventoryItem.Money,
                quantity: 7,
              },
            });
          })
          .delay(DEFAULT_DELAY)
          .callMethod(() => {
            // Now travel to the space store
            meeple.dispatch({
              type: "travel",
              target: targetStore,
            });
          })
          .moveTo(targetStore.pos, meeple.speed)
          .callMethod(() => {
            meeple.dispatch({
              type: "visit",
              target: targetStore,
            });
          })
          .delay(DEFAULT_DELAY)
          .callMethod(() => {
            // Transfer 7 money from banker to space store
            meeple.dispatch({
              type: "transact",
              transaction: {
                from: meeple,
                to: targetStore,
                property: MeepleInventoryItem.Money,
                quantity: 7,
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
      },
    };
  },
});
