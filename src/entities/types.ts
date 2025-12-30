export enum RoleId {
  Asteroid = "Asteroid",
  Miner = "Miner",
  SpaceStore = "SpaceStore",
  SpaceBar = "SpaceBar",
  SpaceApartments = "SpaceApartments",
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
  HideUi = "hide-ui",
}

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
