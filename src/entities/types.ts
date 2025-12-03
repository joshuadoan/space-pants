import type { GoodType } from "../types";
import type { Meeple } from "./Meeple";

export enum MeepleType {
  Miner = "Miner",
  Trader = "Trader",
  Asteroid = "Asteroid",
  Player = "Player",
  SpaceStation = "SpaceStation",
  SpaceBar = "SpaceBar",
}

export enum MeepleActionType {
  MineOre = "Mine Ore",
  StopMining = "Stop Mining",
  TravelToTarget = "Travel To Target",
  Trade = "Trade",
}

type MeepleActionMineOre = {
  type: MeepleActionType.MineOre;
};

type MeepleActionStopMining = {
  type: MeepleActionType.StopMining;
};

type MeepleActionTravelToTarget = {
  type: MeepleActionType.TravelToTarget;
  target: Meeple;
};

export type MeepleAction =
  | MeepleActionMineOre
  | MeepleActionStopMining
  | MeepleActionTravelToTarget;

export enum MeepleStateType {
  Idle = "idle",
  Traveling = "traveling",
  Mining = "mining",
  Trading = "trading",
  Socializing = "socializing",
}

export type MeepleStateIdle = {
  type: MeepleStateType.Idle;
};

export type MeepleStateFunning = {
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
  | MeepleStateFunning;

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
}
