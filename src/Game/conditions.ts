import { DEFAULT_DELAY } from "../consts";
import {
  ConditionType,
  Operator,
  MeepleRoles,
  MeepleInventoryItem,
} from "../types";
import type { Meeple } from "./Meeple";
import type { Game } from "./Game";
import type { ConditionSelfInventory } from "../types";

export const ifNoMoneyMineOre = (): ConditionSelfInventory => ({
  description: "Blast off to a distant asteroid field and mine precious space minerals!",
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
          type: "mine",
          target: target,
          property: MeepleInventoryItem.Minirals,
          quantity: 1,
        });
      })
      .delay(DEFAULT_DELAY);
  },
});

export const ifOreSellToSpaceStore = (): ConditionSelfInventory => ({
  description:
    "Exchange your cosmic crystals at the SpaceStore for galactic credits!",
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
          type: "sell",
          target: target,
          property: MeepleInventoryItem.Minirals,
          quantity: 1,
        });
      })
      .delay(DEFAULT_DELAY);
  },
});

export const ifHasMoneyBuyFizzyDrink = (): ConditionSelfInventory => ({
  description: "Head to the space cantina and grab a refreshing quantum fizzy drink!",
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
          type: "buy",
          target: target,
          property: MeepleInventoryItem.Fizzy,
          quantity: 1,
        });
      })
      .delay(DEFAULT_DELAY);
  },
});

/// If ore is less than 100 then generate ore
export const ifLowOreGenerateOre = (): ConditionSelfInventory => ({
  description: "Activate the quantum matter synthesizer to generate ore reserves!",
  type: ConditionType.Inventory,
  property: MeepleInventoryItem.Minirals,
  operator: Operator.LessThan,
  quantity: 100,
  action: (meeple: Meeple) => {
    meeple.actions
      .callMethod(() => {
        meeple.dispatch({
          type: "generate",
          property: MeepleInventoryItem.Minirals,
          quantity: 1,
        });
      })
      .delay(DEFAULT_DELAY);
  },
});

/// turn ore into money
export const ifOreTurnIntoFizzy = (): ConditionSelfInventory => ({
  description: "Use alchemical transmutation to convert 1 ore into 2 fizzy drinks!",
  type: ConditionType.Inventory,
  property: MeepleInventoryItem.Minirals,
  operator: Operator.GreaterThanOrEqual,
  quantity: 1,
  action: (meeple: Meeple) => {
    meeple.actions
      .callMethod(() => {
        meeple.dispatch({
          type: "transmutation",
          fromProperty: MeepleInventoryItem.Minirals,
          toProperty: MeepleInventoryItem.Fizzy,
          fromQuantity: 1,
          toQuantity: 2,
        });
      })
      .delay(DEFAULT_DELAY);
  },
});

export const ifLowFizzyDrinkBuyFizzyDrink = (
  bar: Meeple
): ConditionSelfInventory => ({
  description: "Restock the bar's quantum fizzy drink supply from the SpaceStore!",
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
          type: "buy",
          target: spaceStore,
          property: MeepleInventoryItem.Fizzy,
          quantity: 1,
        });
      })
      .delay(DEFAULT_DELAY);
  },
});

/// for bartenders
// if fizzy drink is >= 1 then fly back to
// the bar and restock fizzy drinks
export const ifHighFizzyDrinkRestockBar = (): ConditionSelfInventory => ({
  description:
    "Warp back to your home base and restock the bar with fizzy drinks!",
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
          type: "sell",
          target: bar,
          property: MeepleInventoryItem.Fizzy,
          quantity: 1,
        });
      })
      .delay(DEFAULT_DELAY);
  },
});
