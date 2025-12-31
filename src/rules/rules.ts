import type { Game } from "../entities/Game";
import {
  type Inventory,
  type Meeple,
  type MeepleState,
  type Stats,
} from "../entities/Meeple";
import {
  CurrencyType,
  MiningType,
  Operator,
  ProductType,
  RoleId,
  VitalsType,
} from "../entities/types";
import { DEFAULT_DELAY, EXCHANGE_RATE_TO_MONEY } from "../consts";

const UNIT = 1;

export type Rule = {
  name: string;
  description: string;
  property: MiningType | ProductType | CurrencyType | VitalsType;
  operator: Operator;
  value: number;
  actions: ((meeple: Meeple, game: Game) => void)[];
};

export type Rules = {
  [key in MeepleState["name"]]: Rule[];
};

export const MINER_RULES: Rules = {
  idle: [
    {
      name: "Low on Ore",
      description:
        "When the miner has less than 1 ore, they will travel to an asteroid to mine more.",
      property: MiningType.Ore,
      operator: Operator.LessThan,
      value: 1,
      actions: [
        (meeple, game) => {
          const asteroid = game.findRandomMeepleByRoleId(RoleId.Asteroid);
          if (asteroid) {
            meeple.travelTo(asteroid);
          }
        },
      ],
    },
    {
      name: "Has Ore to Sell",
      description:
        "When the miner has 1 or more ore, they will travel to a space store to sell it.",
      property: MiningType.Ore,
      operator: Operator.GreaterThanOrEqual,
      value: 1,
      actions: [
        (meeple, game) => {
          const spaceStore = game.findRandomMeepleByRoleId(RoleId.SpaceStore);
          if (spaceStore) {
            meeple.travelTo(spaceStore);
          }
        },
      ],
    },
  ],
  traveling: [],
  visiting: [
    {
      name: "Mine Ore",
      description:
        "When visiting an asteroid with less than 1 ore, the miner will extract 1 ore from the asteroid.",
      property: MiningType.Ore,
      operator: Operator.LessThan,
      value: 1,
      actions: [
        (meeple, _game) => {
          if (meeple.state.name !== "visiting") {
            return;
          }

          switch (meeple.state.target.roleId) {
            case RoleId.Asteroid:
              meeple.addToInventory(MiningType.Ore, UNIT);
              meeple.state.target
                .removeFromInventory(MiningType.Ore, UNIT)
                .callMethod(() => {
                  meeple.dispatch({
                    name: "finish",
                  });
                })
                .delay(DEFAULT_DELAY);
              break;
            case RoleId.SpaceStore:
              break;
          }
        },
      ],
    },
    {
      name: "Sell Ore",
      description:
        "When visiting a space store with 1 or more ore, the miner will sell 1 ore for 1 money.",
      property: MiningType.Ore,
      operator: Operator.GreaterThanOrEqual,
      value: 1,
      actions: [
        (meeple, _game) => {
          if (meeple.state.name === "visiting") {
            switch (meeple.state.target.roleId) {
              case RoleId.SpaceStore:
                meeple.state.target.addToInventory(MiningType.Ore, UNIT);
                meeple.removeFromInventory(MiningType.Ore, UNIT);
                meeple.state.target.removeFromInventory(
                  CurrencyType.Money,
                  UNIT
                );
                meeple
                  .addToInventory(CurrencyType.Money, UNIT)
                  .callMethod(() => {
                    meeple.dispatch({
                      name: "finish",
                    });
                  })
                  .delay(DEFAULT_DELAY);
                break;
            }
          }
        },
      ],
    },
  ],
  transacting: [
    // lose one health per transaction
    {
      name: "Lose Health per Transaction",
      description:
        "When the miner is transacting, they will lose 1 health per transaction.",
      property: VitalsType.Health,
      operator: Operator.GreaterThan,
      value: 0,
      actions: [
        (meeple, _game) => {
          meeple
            .removeFromVitals(VitalsType.Health, UNIT)
            .callMethod(() => {
              meeple.dispatch({
                name: "finish",
              });
            })
            .delay(DEFAULT_DELAY);
        },
      ],
    },
  ],
};

// Space Store Rules - for every ore generate 2 money for the space store
export const SPACE_STORE_RULES: Rules = {
  idle: [],
  traveling: [],
  visiting: [],
  transacting: [
    {
      name: "Convert Ore to Money",
      description:
        "When the space store has 1 or more ore, it will convert 1 ore into 10 money.",
      property: MiningType.Ore,
      operator: Operator.GreaterThanOrEqual,
      value: 1,
      actions: [
        (meeple, _game) => {
          meeple.addToInventory(
            CurrencyType.Money,
            EXCHANGE_RATE_TO_MONEY[MiningType.Ore]
          );
          console.log("generate-money", meeple.id);
          meeple
            .removeFromInventory(MiningType.Ore, UNIT)
            .callMethod(() => {
              meeple.dispatch({
                name: "finish",
              });
            })
            .delay(DEFAULT_DELAY);
        },
      ],
    },
  ],
};

// Asteroid Rules - if ore below 100 generate 1 ore for the asteroid
export const ASTEROID_RULES: Rules = {
  idle: [
    {
      name: "Replenish Ore while idle",
      description:
        "When the asteroid has less than 100 ore, it will naturally regenerate 1 ore over time.",
      property: MiningType.Ore,
      operator: Operator.LessThan,
      value: 100,
      actions: [
        (meeple, _game) => {
          meeple
            .addToInventory(MiningType.Ore, UNIT)
            .callMethod(() => {
              meeple.dispatch({
                name: "finish",
              });
            })
            .delay(DEFAULT_DELAY);
        },
      ],
    },
  ],
  traveling: [],
  visiting: [],
  transacting: [
    {
      name: "Replenish Ore while transacting",
      description:
        "We need to generate while transacting to avoid running out of ore if the asteroid is popular.",
      property: MiningType.Ore,
      operator: Operator.LessThan,
      value: 100,
      actions: [
        (meeple, _game) => {
          meeple
            .addToInventory(MiningType.Ore, UNIT)
            .callMethod(() => {
              meeple.dispatch({
                name: "finish",
              });
            })
            .delay(DEFAULT_DELAY);
        },
      ],
    },
  ],
};

export const RULES: Record<RoleId, Rules> = {
  [RoleId.Miner]: MINER_RULES,
  [RoleId.Asteroid]: {
    idle: [],
    traveling: [],
    visiting: [],
    transacting: [],
  },
  [RoleId.SpaceStore]: {
    idle: [],
    traveling: [],
    visiting: [],
    transacting: [],
  },
  [RoleId.SpaceBar]: {
    idle: [],
    traveling: [],
    visiting: [],
    transacting: [],
  },
  [RoleId.SpaceApartments]: {
    idle: [],
    traveling: [],
    visiting: [],
    transacting: [],
  },
};

export const GENERATORS: Record<RoleId, Rules> = {
  [RoleId.Miner]: {
    idle: [],
    traveling: [],
    visiting: [],
    transacting: [],
  },
  [RoleId.Asteroid]: ASTEROID_RULES,
  [RoleId.SpaceStore]: SPACE_STORE_RULES,
  [RoleId.SpaceBar]: {
    idle: [],
    traveling: [],
    visiting: [],
    transacting: [],
  },
  [RoleId.SpaceApartments]: {
    idle: [],
    traveling: [],
    visiting: [],
    transacting: [],
  },
};

export function applyMeepleRules(
  meeple: Meeple,
  engine: Game,
  rulesMap: Rules,
  source: "rule" | "generator" = "rule"
) {
  if (meeple.actions.getQueue().hasNext()) {
    return;
  }
  // Store source on meeple temporarily so rule actions can access it
  (meeple as any).__currentRuleSource = source;
  try {
    for (const rule of rulesMap[meeple.state.name]) {
      if (
        evaluateCondition(
          rule.property,
          rule.operator,
          rule.value,
          meeple.state.inventory,
          meeple.state.stats
        )
      ) {
        for (const action of rule.actions) {
          action(meeple, engine);
        }
      }
    }
  } finally {
    delete (meeple as any).__currentRuleSource;
  }
}

export function evaluateCondition(
  property: MiningType | ProductType | CurrencyType | VitalsType,
  operator: Operator,
  value: number,
  inventory: Inventory,
  stats: Stats
): boolean {
  // Check if property is a VitalsType
  const isVital = Object.values(VitalsType).includes(property as VitalsType);

  // Get the current value from either stats or inventory
  const currentValue = isVital
    ? stats[property as VitalsType]
    : inventory[property as MiningType | ProductType | CurrencyType];

  // Apply the operator comparison
  switch (operator) {
    case Operator.Equal:
      return currentValue === value;
    case Operator.LessThan:
      return currentValue < value;
    case Operator.GreaterThan:
      return currentValue > value;
    case Operator.LessThanOrEqual:
      return currentValue <= value;
    case Operator.GreaterThanOrEqual:
      return currentValue >= value;
    case Operator.NotEqual:
      return currentValue !== value;
    default:
      return false;
  }
}
