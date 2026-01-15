import { DEFAULT_DELAY, SELL_PRICES, TRANSMUTATION_RATIOS } from "../consts";
import {
  ConditionType,
  Operator,
  MeepleRoles,
  MeepleInventoryItem,
  MeepleStateNames,
} from "../types";
import type { Meeple } from "./Meeple";
import type { Game } from "./Game";
import type { ConditionSelfInventory, ConditionSelfRadar } from "../types";

export const ifNoMoneyMineOre = (): ConditionSelfInventory => ({
  description: "Travel to an asteroid field and mine ore.",
  type: ConditionType.Inventory,
  property: MeepleInventoryItem.Minirals,
  operator: Operator.LessThan,
  quantity: 1,
  action: (meeple: Meeple, game: Game) => {
    return {
      [MeepleStateNames.Idle]: () => {
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
          .delay(DEFAULT_DELAY);
      },
      [MeepleStateNames.Visiting]: () => {
        if (meeple.state.type !== MeepleStateNames.Visiting) {
          return meeple.dispatch({
            type: "finish",
            state: {
              type: MeepleStateNames.Idle,
            },
          });
        }
        meeple.dispatch({
          type: "mine",
          target: meeple.state.target,
          property: MeepleInventoryItem.Minirals,
          quantity: 1,
        });
      },
    };
  },
});

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

export const ifHasMoneyBuyFizzyDrink = (): ConditionSelfInventory => ({
  description: "Buy a fizzy drink from the space bar.",
  type: ConditionType.Inventory,
  property: MeepleInventoryItem.Money,
  operator: Operator.GreaterThanOrEqual,
  quantity: 1,
  action: (meeple: Meeple, game: Game) => {
    return {
      [MeepleStateNames.Idle]: () => {
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

// If fizzy drink is >= 1 then consume fizzy drink
export const ifHighFizzyDrinkConsumeFizzyDrink =
  (): ConditionSelfInventory => ({
    description: "Consume a fizzy drink.",
    type: ConditionType.Inventory,
    property: MeepleInventoryItem.Fizzy,
    operator: Operator.GreaterThanOrEqual,
    quantity: 1,
    action: (meeple: Meeple) => {
      return {
        [MeepleStateNames.Idle]: () => {
          meeple.actions
            .callMethod(() => {
              meeple.dispatch({
                type: "consume",
                property: MeepleInventoryItem.Fizzy,
                quantity: 1,
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

/// If ore is less than 100 then generate ore
export const ifLowOreGenerateOre = (): ConditionSelfInventory => ({
  description: "Generate ore reserves.",
  type: ConditionType.Inventory,
  property: MeepleInventoryItem.Minirals,
  operator: Operator.LessThan,
  quantity: 100,
  action: (meeple: Meeple) => {
    return {
      [MeepleStateNames.Idle]: () => {
        meeple.actions
          .callMethod(() => {
            meeple.dispatch({
              type: "generate",
              property: MeepleInventoryItem.Minirals,
              quantity: 1,
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

/// turn ore into money
export const ifOreTurnIntoFizzy = (): ConditionSelfInventory => ({
  description: "Convert 1 ore into 10 fizzy drinks and 10 money.",
  type: ConditionType.Inventory,
  property: MeepleInventoryItem.Minirals,
  operator: Operator.GreaterThanOrEqual,
  quantity: 2,
  action: (meeple: Meeple) => {
    return {
      [MeepleStateNames.Idle]: () => {
        meeple.actions
          .callMethod(() => {
            meeple.dispatch({
              type: "transmutation",
              fromProperty: MeepleInventoryItem.Minirals,
              toProperty: MeepleInventoryItem.Fizzy,
              fromQuantity: 1,
              toQuantity:
                TRANSMUTATION_RATIOS[MeepleInventoryItem.Minirals][
                  MeepleInventoryItem.Fizzy
                ],
            });
          })
          .delay(DEFAULT_DELAY)
          .callMethod(() => {
            meeple.dispatch({
              type: "transmutation",
              fromProperty: MeepleInventoryItem.Minirals,
              toProperty: MeepleInventoryItem.Money,
              fromQuantity: 1,
              toQuantity:
                TRANSMUTATION_RATIOS[MeepleInventoryItem.Minirals][
                  MeepleInventoryItem.Money
                ],
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
              quantity: 2,
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

/// for bartenders
// if fizzy drink is >= 1 then fly back to
// the bar and restock fizzy drinks
export const ifHighFizzyDrinkRestockBar = (): ConditionSelfInventory => ({
  description: "Return to the bar and restock it with fizzy drinks.",
  type: ConditionType.Inventory,
  property: MeepleInventoryItem.Fizzy,
  operator: Operator.GreaterThanOrEqual,
  quantity: 1,
  action: (meeple: Meeple, _game: Game) => {
    return {
      [MeepleStateNames.Idle]: () => {
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
              price: 2,
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

export function patrolForRole(role: MeepleRoles): ConditionSelfInventory {
  return {
    description: `Patrol for ${role}`,
    type: ConditionType.Inventory,
    property: MeepleInventoryItem.Money,
    operator: Operator.LessThan,
    quantity: 100,
    action: (meeple: Meeple) => {
      return {
        [MeepleStateNames.Idle]: () => {
          meeple.dispatch({
            type: "patrol-for-role",
            role: role,
            found: [],
          });
        },
      };
    },
  };
}

// ConditionSelfRadar
export const ifTargetThenChase = (): ConditionSelfRadar => ({
  description: `Chase target if found in radar`,
  type: ConditionType.Radar,
  roles: [MeepleRoles.Miner, MeepleRoles.Bartender],
  operator: Operator.LessThan,
  radius: 300,
  action: function (meeple: Meeple) {
    return {
      [MeepleStateNames.Patrolling]: () => {
        if (meeple.state.type !== MeepleStateNames.Patrolling) {
          return;
        }

        if (meeple.state.found.length > 0) {
          console.log("chasing target", meeple.state.found[0]);
          meeple.dispatch({
            type: "chase",
            target: meeple.state.found[0],
            startTime: Date.now(),
          });
        }

        // meeple.dispatch({
        //   type: "chase",
        //   target: meeple.state.found[0],
        //   startTime: Date.now(),
        // });
      },
      [MeepleStateNames.Chasing]: () => {
        /// if it had been 4 seconds then finish
        if (meeple.state.type !== MeepleStateNames.Chasing) {
          return;
        }

        console.log("chasing target forever ", meeple.name);

        // console.log("chasing target", Date.now() - meeple.state.startTime );
        // if (Date.now() - meeple.state.startTime > 4000) {
        //   meeple.dispatch({
        //     type: "finish",
        //     state: {
        //       type: MeepleStateNames.Idle,
        //     },
        //   });
        // }
      },
    };
  },
});

// For pirate ships: if money > 100, fly home to pirate base and transfer all money to base
export const ifHighMoneyTransferToPirateBase = (): ConditionSelfInventory => ({
  description: "Return to pirate base and transfer all money.",
  type: ConditionType.Inventory,
  property: MeepleInventoryItem.Money,
  operator: Operator.GreaterThan,
  quantity: 100,
  action: (meeple: Meeple, _game: Game) => {
    return {
      [MeepleStateNames.Idle]: () => {
        if (!meeple.home) {
          return;
        }
        const pirateBase = meeple.home;
        const moneyAmount = meeple.inventory[MeepleInventoryItem.Money];
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
          .delay(DEFAULT_DELAY);
      },
    };
  },
});

// otherwise go home and transfer all money home
