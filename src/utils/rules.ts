import type { Game } from "../entities/Game";
import { RoleId, type RuleTemplate } from "../entities/types";
import { GoodType, VitalsType } from "../entities/Meeple";
import { Operator } from "../entities/types";

/**
 * Exchange rate for the SpaceStore:
 * 1 ore = 1 money
 */
export const ORE_TO_MONEY_EXCHANGE_RATE = 1;

export function createRuleTemple(game: Game, ruleId: RoleId): RuleTemplate {
  switch (ruleId) {
    case RoleId.Asteroid: {
      return {
        id: RoleId.Asteroid,
        name: "Asteroid",
        rules: [],
      };
    }
    case RoleId.Miner: {
      return {
        id: RoleId.Miner,
        name: "Miner",
        rules: [
          {
            id: "need-ore",
            name: "Need Ore",
            conditions: [
              {
                good: GoodType.Ore,
                operator: Operator.LessThan,
                value: 14,
              },
              // Check that asteroid has ore available before mining
              {
                good: GoodType.Ore,
                operator: Operator.GreaterThan,
                value: 0,
                targetRoleId: RoleId.Asteroid,
              },
            ],
            actions: [
              // travel to asteroid (target will be resolved dynamically)
              {
                type: "travel-to",
                payload: {
                  targetRoleId: RoleId.Asteroid,
                },
              },
              // add ore to miner
              {
                type: "transact",
                payload: {
                  good: GoodType.Ore,
                  quantity: 1,
                  transactionType: "add",
                },
              },
              // remove ore from asteroid
              {
                type: "transact",
                payload: {
                  good: GoodType.Ore,
                  quantity: 1,
                  transactionType: "remove",
                  targetRoleId: RoleId.Asteroid,
                },
              },
              // finish
              {
                type: "finish",
                payload: {
                  state: {
                    type: "idle"
                  }
                }
              }
            ],
          },
          {
            id: "sell-ore-to-store",
            name: "Sell Ore to SpaceStore",
            conditions: [
              {
                good: GoodType.Ore,
                operator: Operator.GreaterThanOrEqual,
                value: 14,
              },
              // Safety condition: SpaceStore must have enough money to buy the ore
              {
                good: GoodType.Money,
                operator: Operator.GreaterThanOrEqual,
                value: 14,
                targetRoleId: RoleId.SpaceStore, // Check SpaceStore's money, not miner's
              },
            ],
            actions: [
              // travel to space store
              {
                type: "travel-to",
                payload: {
                  targetRoleId: RoleId.SpaceStore,
                },
              },
              // transfer ore from miner to space store
              {
                type: "transact",
                payload: {
                  good: GoodType.Ore,
                  quantity: 14,
                  transactionType: "remove",
                },
              },
              {
                type: "transact",
                payload: {
                  good: GoodType.Ore,
                  quantity: 14,
                  transactionType: "add",
                  targetRoleId: RoleId.SpaceStore,
                },
              },
              // transfer money from space store to miner (14 ore * 1 money/ore = 14 money)
              {
                type: "transact",
                payload: {
                  good: GoodType.Money,
                  quantity: 14,
                  transactionType: "remove",
                  targetRoleId: RoleId.SpaceStore,
                },
              },
              {
                type: "transact",
                payload: {
                  good: GoodType.Money,
                  quantity: 14,
                  transactionType: "add",
                },
              },
              // finish
              {
                type: "finish",
                payload: {
                  state: {
                    type: "idle"
                  }
                }
              }
            ],
          },
        ],
      };
    }
    case RoleId.SpaceStore: {
      return {
        id: RoleId.SpaceStore,
        name: "SpaceStore",
        rules: [],
      };
    }
    default:
      throw new Error(`Unknown rule id: ${ruleId}`);
  }
}

/**
 * Creates the initial inventory for a SpaceStore
 * @returns Inventory with 100 money and 0 ore
 */
export function createSpaceStoreInventory(): Record<GoodType | VitalsType, number> {
  return {
    [GoodType.Ore]: 0,
    [GoodType.Money]: 100,
    [VitalsType.Health]: 100,
    [VitalsType.Energy]: 100,
    [VitalsType.Happiness]: 50,
  };
}
