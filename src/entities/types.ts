import type { Meeple } from "./Meeple";

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
    Treasure = "treasure",
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
  TreasureCollector = "TreasureCollector",
  Asteroid = "Asteroid",
  Player = "Player",
  SpaceStation = "SpaceStation",
  SpaceBar = "SpaceBar",
  SpaceApartments = "SpaceApartments",
}

export enum MeepleStateType {
  Idle = "idle",
  Traveling = "traveling",
  Mining = "mining",
  Trading = "trading",
  Socializing = "socializing",
  Chilling = "chilling",
  Transacting = "transacting",
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

export type MeepleState =
  | MeepleStateIdle
  | MeepleStateMining
  | MeeplStateTraveling
  | MeepleStateTrading
  | MeepleStateChilling
  | MeepleStateSocializing
  | MeepleStateTransacting;

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
};

export enum LogicRuleActionType {
  MineOre = "Mine Ore",
  TradeOreForMoney = "Trade Ore For Money",
  Socialize = "Socialize",
  GoShopping = "Go Shopping",
  GoSelling = "Go Selling",
  SellTreasure = "Sell Treasure",
  ChillAtHome = "Chill At Home",
}
