import type { Game } from "../entities/Game";
import type { Inventory, Meeple, MeepleState, Stats } from "../entities/Meeple";
import {
  CurrencyType,
  MiningType,
  Operator,
  ProductType,
  RoleId,
  VitalsType,
} from "../entities/types";

const UNIT = 1;

export type Rule = {
  name: string;
  description: string;
  property: MiningType | ProductType | CurrencyType | VitalsType;
  operator: Operator;
  value: number;
  actions: ((meeple: Meeple, game: Game,) => void)[];
};

export type Rules = {
  [key in MeepleState["name"]]: Rule[];
};

export const MINER_RULES: Rules = {
  idle: [
    {
      name: "need-ore",
      description: "If the miner has less than 1 ore, it will travel to the asteroid.",
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
      name: "have-ore",
      description: "If the miner has more than or equal to 1 ore, it will travel to the space store.",
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
      name: "mine-ore",
      description: "If the miner is visiting an asteroid and has less than 1 ore, it will mine 1 ore.",
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
              meeple.state.target.removeFromInventory(MiningType.Ore, UNIT)
              .callMethod(() => {
                meeple.dispatch({
                  name: "finish",
                });
              });
              break;
            case RoleId.SpaceStore:
              break;
          }
        },
      ],
    },
    {
      name: "have-ore",
      description: "If the miner is visiting a space store and has more than or equal to 1 ore, it will add 1 ore to the space store and remove 1 ore from the miner.",
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
                meeple.state.target.removeFromInventory(CurrencyType.Money, UNIT);
                meeple.addToInventory(CurrencyType.Money, UNIT)
                .callMethod(() => {
                  meeple.dispatch({
                    name: "finish",
                  });
                });
                break;
            }
          }
        },
      ],
    },
  ],
  transacting: [],
};

// Space Store Rules - for every ore generate 2 money for the space store
export const SPACE_STORE_RULES: Rules = {
  idle: [
    {
      name: "generate-money",
      description: "If the space store has more than or equal to 1 ore, it will generate 2 money.",
      property: MiningType.Ore,
      operator: Operator.GreaterThanOrEqual,
      value: 1,
      actions: [
        (meeple, _game) => {
          meeple.addToInventory(CurrencyType.Money, UNIT * 2);
          meeple.removeFromInventory(MiningType.Ore, UNIT)
          .callMethod(() => {
            meeple.dispatch({
              name: "finish",
            });
          });
        },
      ],
    },
  ],
  traveling: [],
  visiting: [],
  transacting: [],
};

// Asteroid Rules - if ore below 100 generate 1 ore for the asteroid
export const ASTEROID_RULES: Rules = {
  idle: [
    {
      name: "generate-ore",
      description: "If the asteroid has less than 100 ore, it will generate 1 ore.",
      property: MiningType.Ore,
      operator: Operator.LessThan,
      value: 100,
      actions: [
        (meeple, _game) => {
          meeple.addToInventory(MiningType.Ore, UNIT)
          .callMethod(() => {
            meeple.dispatch({
              name: "finish",
            });
          });
        },
      ],
    },
  ],
  traveling: [],
  visiting: [],
  transacting: [],
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
  rulesMap: Rules
) {
  if (meeple.actions.getQueue().hasNext()) {
    return;
  }
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
