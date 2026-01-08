import { DEFAULT_DELAY, DEFAULT_PRICE } from "../consts";
import { ConditionType, Operator, MeepleRoles, MeepleInventoryItem } from "../types";
import type { Meeple } from "./Meeple";
import type { Game } from "./Game";
import type { ConditionSelfInventory } from "../types";

export const ifNoMoneyMineOre = (): ConditionSelfInventory => ({
  description: "Venture to the nearest asteroid and extract minirals",
  type: ConditionType.Inventory,
  property: MeepleInventoryItem.Minirals,
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
            property: MeepleInventoryItem.Minirals,
            quantity: 1,
          },
        });
      })
      .delay(DEFAULT_DELAY);
  },
});

export const ifOreSellToSpaceStore = (): ConditionSelfInventory => ({
  description: "Cash in your hard-earned minerals at the SpaceStore for credits",
  type: ConditionType.Inventory,
  property: MeepleInventoryItem.Minirals,
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
            property: MeepleInventoryItem.Minirals,
            quantity: 1,
          },
        });
      })
      .delay(DEFAULT_DELAY);
  },
});


export const ifHasMoneyBuyFizzyDrink = (): ConditionSelfInventory => ({
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
            quantity: DEFAULT_PRICE,
          },
        });
        meeple.dispatch({
          type: "transact",
          transaction: {
            from: target,
            to: meeple,
            property: MeepleInventoryItem.Fizzy,
            quantity: DEFAULT_PRICE,
          },
        });
      })
      .delay(DEFAULT_DELAY);
  },
});

/// If ore is less than 100 then generate ore
export const ifLowOreGenerateOre = (): ConditionSelfInventory => ({
  description: "Generate ore when ore is less than 100",
  type: ConditionType.Inventory,
  property: MeepleInventoryItem.Minirals,
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
            property: MeepleInventoryItem.Minirals,
            quantity: DEFAULT_PRICE,
          },
        });
      })
      .delay(DEFAULT_DELAY);
  },
});


/// turn ore into money
export const ifOreTurnIntoFizzy = (): ConditionSelfInventory => ({
  description: "Turn 1 ore into 2 fizzy drinks",
  type: ConditionType.Inventory,
  property: MeepleInventoryItem.Minirals,
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
            property: MeepleInventoryItem.Minirals,
            quantity: DEFAULT_PRICE,
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
            quantity: DEFAULT_PRICE * 2,
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
            quantity: DEFAULT_PRICE,
          },
        });
      })
      .delay(DEFAULT_DELAY);
  },
});


export const ifLowFizzyDrinkBuyFizzyDrink = (bar: Meeple): ConditionSelfInventory => ({
  description: "Buy fizzy drinks from space store when bar has less than 100",
  type: ConditionType.Inventory,
  property: MeepleInventoryItem.Fizzy,
  operator: Operator.LessThan,
  quantity: 100,
  target: bar, // Check the bar's inventory, not the bartender's
  action: (meeple: Meeple, game: Game) => {
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
          type: "transact",
          transaction: {
            from: meeple,
            to: spaceStore,
            property: MeepleInventoryItem.Money,
            quantity: DEFAULT_PRICE,
          },
        });
        meeple.dispatch({
          type: "transact",
          transaction: {
            from: spaceStore,
            to: meeple,
            property: MeepleInventoryItem.Fizzy,
            quantity: DEFAULT_PRICE,
          },
        });
      })
      .delay(DEFAULT_DELAY);
  },
});

/// for bartenders
// if fizzy drink is >= 1 then fly back to 
// the bar and restock fizzy drinks
export const ifHighFizzyDrinkRestockBar = (): ConditionSelfInventory => ({
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
        meeple.dispatch({
          type: "transact",
          transaction: {
            from: meeple,
            to: bar,
            property: MeepleInventoryItem.Fizzy,
            quantity: DEFAULT_PRICE,
          },
        });
        // Bar pays bartender money for restocking
        meeple.dispatch({
          type: "transact",
          transaction: {
            from: bar,
            to: meeple,
            property: MeepleInventoryItem.Money,
            quantity: DEFAULT_PRICE * 2,
          },
        });
      })
      .delay(DEFAULT_DELAY);
  },
});
