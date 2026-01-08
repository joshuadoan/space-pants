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

/// for miners
// if money >= 1 then fly to space bar and buy 1 fizzy drink
export const IF_HAS_MONEY_BUY_FIZZY_DRINK: ConditionSelfInventory = {
  description: "Visit a space bar and buy a fizzy drink when you have money",
  type: ConditionType.Inventory,
  property: MeepleInventoryItem.Money,
  operator: Operator.GreaterThanOrEqual,
  quantity: 1,
  action: (meeple: Meeple, game: Game) => {
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
          type: "transact",
          transaction: {
            from: meeple,
            to: target,
            property: MeepleInventoryItem.Money,
            quantity: 1,
          },
        });
        meeple.dispatch({
          type: "transact",
          transaction: {
            from: target,
            to: meeple,
            property: MeepleInventoryItem.Fizzy,
            quantity: 1,
          },
        });
      })
      .delay(DEFAULT_DELAY);
  },
};

/// If ore is less than 100 then generate ore
export const IF_LOW_ORE_GENERATE_ORE: ConditionSelfInventory = {
  description: "Generate ore when ore is less than 100",
  type: ConditionType.Inventory,
  property: MeepleInventoryItem.Stuff,
  operator: Operator.LessThan,
  quantity: 100,
  action: (meeple: Meeple) => {
       meeple.actions
      .callMethod(() => {
        meeple.dispatch({
          type: "transact",
          transaction: {
            from: null,
            to: meeple,
            property: MeepleInventoryItem.Stuff,
            quantity: 1,
          },
        });
      })
      .delay(DEFAULT_DELAY);
  },
};


/// turn ore into money
export const IF_ORE_TURN_INTO_MONEY: ConditionSelfInventory = {
  description: "Turn 1 ore into 2 fizzy drinks",
  type: ConditionType.Inventory,
  property: MeepleInventoryItem.Stuff,
  operator: Operator.GreaterThanOrEqual,
  quantity: 1,
  action: (meeple: Meeple) => {
    meeple.actions
      .callMethod(() => {
        meeple.dispatch({
          type: "transact",
          transaction: {
            from: meeple,
            to: null,
            property: MeepleInventoryItem.Stuff,
            quantity: 1,
          },
        });
      })
      .callMethod(() => {
        meeple.dispatch({
          type: "transact",
          transaction: {
            from: null,
            to: meeple,
            property: MeepleInventoryItem.Fizzy,
            quantity: 1,
          },
        });
      })
      .callMethod(() => {
        meeple.dispatch({
          type: "transact",
          transaction: {
            from: null,
            to: meeple,
            property: MeepleInventoryItem.Fizzy,
            quantity: 1,
          },
        });
      })
      .delay(DEFAULT_DELAY);
  },
};


/// for bartenders
// if fizzy drink is < 100 then fly to 
// nearest space store and buy 1 fizzy drink
export const IF_LOW_FIZZY_DRINK_BUY_FIZZY_DRINK: ConditionSelfInventory = {
  description: "Buy 1 fizzy drink when fizzy drink is less than 100",
  type: ConditionType.Inventory,
  property: MeepleInventoryItem.Fizzy,
  operator: Operator.LessThan,
  quantity: 100,
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
            property: MeepleInventoryItem.Fizzy,
            quantity: 1,
          },
        });
      })
      .delay(DEFAULT_DELAY);
  },
};

/// for bartenders
// if fizzy drink is >= 1 then fly back to 
// the bar and restock fizzy drinks
export const IF_HIGH_FIZZY_DRINK_RESTOCK_BAR: ConditionSelfInventory = {
  description: "Return to bar and restock fizzy drinks when fizzy drink is greater than or equal to 1",
  type: ConditionType.Inventory,
  property: MeepleInventoryItem.Fizzy,
  operator: Operator.GreaterThanOrEqual,
  quantity: 1,
  action: (meeple: Meeple, _game: Game) => {
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
        // Transfer all fizzy drinks from bartender to bar
        const fizzyAmount = meeple.inventory.fizzy;
        meeple.dispatch({
          type: "transact",
          transaction: {
            from: meeple,
            to: bar,
            property: MeepleInventoryItem.Fizzy,
            quantity: fizzyAmount,
          },
        });
      })
      .delay(DEFAULT_DELAY);
  },
};
