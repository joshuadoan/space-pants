import type { GoodType, MeepleAction, VitalsType } from "./Meeple";

export enum RoleId {
  Asteroid = "Asteroid",
  Miner = "Miner",
}

export type Rule = {
  id: string;
  name: string;
  conditions: Condition[];
  actions: MeepleAction[];
};

export type RuleTemplate = {
  id: RoleId
  name: string;
  rules: Rule[];
}
export enum Operator {
  Equal = "=",
  LessThan = "<",
  GreaterThan = ">",
  LessThanOrEqual = "<=",
  GreaterThanOrEqual = ">=",
  NotEqual = "!=",
}

export type Condition = {
  good: GoodType | VitalsType;
  operator: Operator;
  value: number;
};