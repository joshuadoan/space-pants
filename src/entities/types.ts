import type { Meeple } from "./Meeple/Meeple";

export enum Products {
    Gruffle = "gruffle",
    Druffle = "druffle",
    Klintzpaw = "klintzpaw",
    Grogin = "grogin",
    Fizz = "fizz",
}

export enum Resources {
    Ore = "ore",
    Money = "money",
}

export enum MeepleStats {
  Health = "health",
  Energy = "energy",
}



export type GoodType = Products | Resources | MeepleStats;
export type Goods = Record<Products | Resources | MeepleStats, number>;


export enum MeepleType {
  Miner = "Miner",
  Trader = "Trader",
  Asteroid = "Asteroid",
  Player = "Player",
  SpaceStation = "SpaceStation",
  SpaceBar = "SpaceBar",
  SpaceApartments = "SpaceApartments",
  Bartender = "Bartender",
}

export enum MeepleStateType {
  Idle = "idle",
  Traveling = "traveling",
  Mining = "mining",
  Trading = "trading",
  Socializing = "socializing",
  Chilling = "chilling",
  Transacting = "transacting",
  Working = "working",
  Converting = "converting",
}

export type MeepleStateIdle = {
  type: MeepleStateType.Idle;
};

export type MeepleStateTransacting = {
  type: MeepleStateType.Transacting;
  target: Meeple;
};

export type MeepleStateChilling = {
  type: MeepleStateType.Chilling;
  target: Meeple;
};

export type MeepleStateSocializing = {
  type: MeepleStateType.Socializing;
  target: Meeple;
};

export type MeepleStateWorking = {
  type: MeepleStateType.Working;
  target: Meeple;
};

export type MeeplStateTraveling = {
  type: MeepleStateType.Traveling;
  target: Meeple;
};

export type MeepleStateMining = {
  type: MeepleStateType.Mining;
  target: Meeple;
};

export type MeepleStateTrading = {
  type: MeepleStateType.Trading;
  target: Meeple;
};

export type MeepleStateConverting = {
  type: MeepleStateType.Converting;
  productType: Products;
};

export type MeepleState =
  | MeepleStateIdle
  | MeepleStateMining
  | MeeplStateTraveling
  | MeepleStateTrading
  | MeepleStateChilling
  | MeepleStateSocializing
  | MeepleStateTransacting
  | MeepleStateWorking
  | MeepleStateConverting;

export enum ComparisonOperator {
  Equal = "=",
  LessThan = "<",
  GreaterThan = ">",
  LessThanOrEqual = "<=",
  GreaterThanOrEqual = ">=",
  NotEqual = "!=",
}

export type LogicRule = {
  id: string;
  good: GoodType;
  operator: ComparisonOperator;
  value: number;
  action: LogicRuleActionType;
  productType?: Products; // Optional product type, defaults to meeple's productType
  destinationType?: MeepleType; // Optional destination type to target specific entity types
  destinationName?: string; // Optional specific destination name (takes precedence over destinationType)
};

export enum LogicRuleActionType {
  MineOreFromAsteroid = "Mine Ore From Asteroid",
  SellOreToStation = "Sell Ore To Station",
  SocializeAtBar = "Socialize At Bar",
  WorkAtBar = "Work At Bar",
  BuyProductFromStation = "Buy Product From Station",
  SellProductToStation = "Sell Product To Station",
  RestAtApartments = "Rest At Apartments",
}

export type RuleBehavior = {
  id: string;
  name: string;
  rules: LogicRule[];
};
