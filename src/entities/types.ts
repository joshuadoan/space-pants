export enum RoleId {
  Asteroid = "Asteroid",
  Miner = "Miner",
  SpaceStore = "SpaceStore",
}

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
}

export type Condition = () => boolean;