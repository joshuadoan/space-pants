import type { Game } from "../entities/Game";
import {
  MeepleStateName,
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
  allowedStates: MeepleState["name"][];
};

export type Rules = {
  [key in MeepleState["name"]]: Rule[];
};

export const MINER_RULES: Rule[] = [
  {
    name: "Low on Ore",
    description:
      "When the miner has less than 1 ore, they will travel to an asteroid to mine more.",
    property: MiningType.Ore,
    operator: Operator.LessThan,
    value: 1,
    allowedStates: [MeepleStateName.Idle],
    actions: [
      (meeple, game) => {
        const asteroid = game.findRandomMeepleByRoleId(RoleId.Asteroid);
        if (asteroid) {
          meeple
            .travelTo(asteroid)
            .callMethod(() => {
              meeple.addToInventory(MiningType.Ore, UNIT);
              asteroid.removeFromInventory(MiningType.Ore, UNIT);
            })
            .callMethod(() => {
              meeple.dispatch({
                name: "finish",
              });
            })
        }
      },
    ],
  },
  // if ore is 1 or more go to space store and sell 1 ore for 1 money
  {
    name: "Sell Ore to SpaceStore",
    description:
      "When the miner has 1 or more ore, they will travel to a space store and sell 1 ore for 1 money.",
    property: MiningType.Ore,
    operator: Operator.GreaterThanOrEqual,
    value: 1,
    allowedStates: [MeepleStateName.Idle],
    actions: [
      (meeple, game) => {
        const spaceStore = game.findRandomMeepleByRoleId(RoleId.SpaceStore);
        if (spaceStore) {
          meeple.travelTo(spaceStore).callMethod(() => {
            // minor
            meeple.removeFromInventory(MiningType.Ore, UNIT);
            meeple.addToInventory(CurrencyType.Money, UNIT);

            // space store
            spaceStore.addToInventory(MiningType.Ore, UNIT);
            spaceStore.removeFromInventory(CurrencyType.Money, UNIT);
          });
        }
      },
    ],
  },
];

// Space Store Rules - for every ore generate 2 money for the space store
export const SPACE_STORE_RULES: Rule[] = [
  // turn every ore into money wiht exchange rate
  {
    name: "Turn Ore into Money",
    description:
      "When the space store has ore, it will turn it into money with the exchange rate.",
    property: MiningType.Ore,
    operator: Operator.GreaterThanOrEqual,
    value: 1,
    allowedStates: [MeepleStateName.Idle],
    actions: [
      (meeple) => {
        meeple.removeFromInventory(MiningType.Ore, UNIT);
        meeple.addToInventory(
          CurrencyType.Money,
          UNIT * EXCHANGE_RATE_TO_MONEY[MiningType.Ore]
        );
      },
    ],
  },
];

// Asteroid Rules - if ore below 100 generate 1 ore for the asteroid
export const ASTEROID_RULES: Rule[] = [
  // if ore less than 100 generate 1 ore for the asteroid
  {
    name: "Generate Ore",
    description:
      "When the asteroid has less than 100 ore, it will generate 1 ore.",
    property: MiningType.Ore,
    operator: Operator.LessThan,
    allowedStates: [MeepleStateName.Idle],
    value: 100,
    actions: [
      (meeple) => {
        meeple.addToInventory(MiningType.Ore, UNIT);
      },
    ],
  },
];

export const RULES: Record<RoleId, Rule[]> = {
  [RoleId.Miner]: MINER_RULES,
  [RoleId.Asteroid]: ASTEROID_RULES,
  [RoleId.SpaceStore]: SPACE_STORE_RULES,
  [RoleId.SpaceBar]: [],
  [RoleId.SpaceApartments]: [],
  [RoleId.Player]: [],
};

export function applyMeepleRules(
  meeple: Meeple,
  engine: Game,
  rulesMap: Rule[]
) {
  if (meeple.actions.getQueue().hasNext()) {
    return;
  }
  for (let i = 0; i < rulesMap.length; i++) {
    const rule = rulesMap[i];
    if (
      evaluateCondition(
        meeple.state.name,
        rule.property,
        rule.operator,
        rule.value,
        meeple.state.inventory,
        meeple.state.stats,
        rule.allowedStates
      )
    ) {
      for (const action of rule.actions) {
        action(meeple, engine);
      }
      break;
    }
  }
}

export function evaluateCondition(
  stateName: MeepleStateName,
  property: MiningType | ProductType | CurrencyType | VitalsType,
  operator: Operator,
  value: number,
  inventory: Inventory,
  stats: Stats,
  allowedStates: MeepleStateName[]
): boolean {
  if (!allowedStates.includes(stateName)) {
    return false;
  }
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
