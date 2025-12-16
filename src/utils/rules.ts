import type { Game } from "../entities/Game";
import { RoleId, type RuleTemplate } from "../entities/types";
import { GoodType } from "../entities/Meeple";
import { Operator } from "../entities/types";

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
      const asteroid = game.findRabdomMeepleByRoleId(RoleId.Asteroid);
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
                operator: Operator.LessThanOrEqual,
                value: 0,
              },
            ],
            actions: [
              // travel to asteroid
              {
                type: "travel-to",
                payload: {
                  target: asteroid,
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
                  target: asteroid,
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
    default:
      throw new Error(`Unknown rule id: ${ruleId}`);
  }
}
