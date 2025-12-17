import type { GoodType, Meeple, MeepleAction, VitalsType } from "./Meeple";

export enum RoleId {
  Asteroid = "Asteroid",
  Miner = "Miner",
  SpaceStore = "SpaceStore",
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
  target?: Meeple; // Optional target to check another entity's inventory (deprecated - use targetRoleId)
  targetRoleId?: RoleId; // Optional role ID to find target dynamically
};
