import type { CurrencyType, MiningType, Meeple, ProductType, MeepleAction } from "./Meeple";

export enum RoleId {
  Asteroid = "Asteroid",
  Miner = "Miner",
  SpaceStore = "SpaceStore",
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
  target: Meeple;
}