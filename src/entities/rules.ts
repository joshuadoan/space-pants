import type { Game } from "./Game";
import type { Inventory, Meeple, MeepleState, Stats } from "./Meeple";
import {
  CurrencyType,
  MiningType,
  Operator,
  ProductType,
  RoleId,
  VitalsType,
} from "./types";

type Rule = {
  name: string;
  property: MiningType | ProductType | CurrencyType | VitalsType;
  operator: Operator;
  value: number;
  actions: ((meeple: Meeple, game: Game) => void)[];
};

type Rules = {
  [key in MeepleState["name"]]: Rule[];
};

const MINER_RULES: Rules = {
  idle: [
    {
      name: "need-ore",
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
      property: MiningType.Ore,
      operator: Operator.LessThan,
      value: 1,
      actions: [
        (meeple, _game) => {
          // TODO FIX THIS WEIRD TYPE CHECK
          if (meeple.state.name !== "visiting") {
            return;
          }

          switch (meeple.state.target.roleId) {
            case RoleId.Asteroid:
              meeple.addToInventory(MiningType.Ore, 1);
              meeple.state.target.removeFromInventory(MiningType.Ore, 1);
              break;
            case RoleId.SpaceStore:
              break;
          }
        },
      ],
    },
    {
      name: "have-ore",
      property: MiningType.Ore,
      operator: Operator.GreaterThanOrEqual,
      value: 1,
      actions: [
        (meeple, _game) => {
          if (meeple.state.name === "visiting") {
            switch (meeple.state.target.roleId) {
              case RoleId.SpaceStore:
                // transfer ore from space store to miner
                meeple.state.target.addToInventory(MiningType.Ore, 1);
                // transfer ore from miner to space store
                meeple.removeFromInventory(MiningType.Ore, 1);

                // transfer money from space store to miner
                meeple.state.target.removeFromInventory(CurrencyType.Money, 1);
                // transfer money from miner to space store
                meeple.addToInventory(CurrencyType.Money, 1);
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
const SPACE_STORE_RULES: Rules = {
  idle: [
    {
      name: "generate-money",
      property: MiningType.Ore,
      operator: Operator.GreaterThanOrEqual,
      value: 1,
      actions: [
        (meeple, _game) => {
          meeple.addToInventory(CurrencyType.Money, 2);
          meeple.removeFromInventory(MiningType.Ore, 1);
        },
      ],
    },
  ],
  traveling: [],
  visiting: [],
  transacting: [],
};

// Asteroid Rules - if ore below 100 generate 1 ore for the asteroid
const ASTEROID_RULES: Rules = {
  idle: [
    {
      name: "generate-ore",
      property: MiningType.Ore,
      operator: Operator.LessThan,
      value: 100,
      actions: [
        (meeple, _game) => {
          meeple.addToInventory(MiningType.Ore, 1);
        },
      ],
    },
  ],
  traveling: [],
  visiting: [],
  transacting: [],
};

const RULES = {
  [RoleId.Miner]: MINER_RULES,
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
export function meepleActionsRule(meeple: Meeple, engine: Game) {
  if (meeple.actions.getQueue().hasNext()) {
    return;
  }
  for (const rule of RULES[meeple.roleId][meeple.state.name]) {
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

function evaluateCondition(
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
