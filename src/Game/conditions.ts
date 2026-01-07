import { DEFAULT_DELAY } from "../consts";
import { ConditionType, Operator, MeepleRoles, MeepleInventoryItem } from "../types";
import type { Meeple } from "./Meeple";
import type { Game } from "./Game";
import type { ConditionSelfInventory } from "../types";

export const IF_NO_MONEY_MINE_ORE: ConditionSelfInventory = {
  description: "Venture to the nearest asteroid and extract precious ore",
  type: ConditionType.Inventory,
  property: MeepleInventoryItem.Stuff,
  operator: Operator.LessThan,
  quantity: 1,
  action: (meeple: Meeple, game: Game) => {
    const target = game.getRandomMeepleByRole(MeepleRoles.Asteroid);
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
          type: "transact",
          transaction: {
            from: target,
            to: meeple,
            property: MeepleInventoryItem.Stuff,
            quantity: 1,
          },
        });
      })
      .delay(DEFAULT_DELAY);
  },
};

export const IF_ORE_SELL_TO_SPACE_STORE: ConditionSelfInventory = {
  description: "Cash in your hard-earned ore at the SpaceStore for credits",
  type: ConditionType.Inventory,
  property: MeepleInventoryItem.Stuff,
  operator: Operator.GreaterThanOrEqual,
  quantity: 1,
  action: (meeple: Meeple, game: Game) => {
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
          type: "transact",
          transaction: {
            from: target,
            to: meeple,
            property: MeepleInventoryItem.Money,
            quantity: 1,
          },
        });
        meeple.dispatch({
          type: "transact",
          transaction: {
            from: meeple,
            to: target,
            property: MeepleInventoryItem.Stuff,
            quantity: 1,
          },
        });
      })
      .delay(DEFAULT_DELAY);
  },
};
