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

export type Transaction = {
  good: MiningType | ProductType | CurrencyType;
  quantity: number;
  transactionType: "add" | "remove";
  target?: Meeple;
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
