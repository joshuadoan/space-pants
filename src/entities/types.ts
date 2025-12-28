import type { MeepleAction, Meeple } from "./Meeple";

export enum RoleId {
  Asteroid = "Asteroid",
  Miner = "Miner",
  SpaceStore = "SpaceStore",
  SpaceBar = "SpaceBar",
  SpaceApartments = "SpaceApartments",
}
export type Instruction = {
  id: string;
  name: string;
  conditions: Condition[];
  actions: MeepleAction[];
};

export enum Operator {
  Equal = "=",
  LessThan = "<",
  GreaterThan = ">",
  LessThanOrEqual = "<=",
  GreaterThanOrEqual = ">=",
  NotEqual = "!=",
}

export enum UserActionType {
  Back = "back",
  HideUi = "hide-ui",
}

export type Condition = {
  good: MiningType | ProductType | CurrencyType;
  operator: Operator;
  value: number;
  target: () => Meeple;
};

// take from source and add to target
export type Transaction = {
  good: MiningType | ProductType | CurrencyType;
  quantity: number;
  source: Meeple;
  target: Meeple;
  transactionType: "buy" | "sell" | "add-self" | "remove-self";
};

export enum MiningType {
  Ore = "ore",
}

export enum ProductType {
  Gruffle = "gruffle",
  Fizzy = "fizzy",
}

export enum CurrencyType {
  Money = "money",
}

export enum VitalsType {
  Health = "health",
  Energy = "energy",
  Happiness = "happiness",
}
export type GoodType = MiningType | ProductType | CurrencyType;

// exhnage rate everything for eveything buying and selling
export const EXCHANGE_RATE: Record<
  GoodType,
  Record<CurrencyType, number>
> = {
  [MiningType.Ore]: {
    [CurrencyType.Money]: 2,
  },
  [ProductType.Gruffle]: {
    [CurrencyType.Money]: 1,
  },
  [ProductType.Fizzy]: {
    [CurrencyType.Money]: 1,
  },
  [CurrencyType.Money]: {
    [CurrencyType.Money]: 1,
  },
};
