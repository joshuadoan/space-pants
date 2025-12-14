import type { Meeple } from "./Meeple/Meeple";

// ============================================================================
// Branded Types for IDs
// ============================================================================

/**
 * Branded type for rule IDs to prevent mixing with other ID types
 */
export type RuleId = string & { readonly __brand: "RuleId" };

/**
 * Branded type for behavior IDs to prevent mixing with other ID types
 */
export type BehaviorId = string & { readonly __brand: "BehaviorId" };

/**
 * Branded type for meeple IDs to prevent mixing with other ID types
 */
export type MeepleId = string & { readonly __brand: "MeepleId" };

/**
 * Helper function to create a RuleId from a string
 */
export function createRuleId(id: string): RuleId {
  return id as RuleId;
}

/**
 * Helper function to create a BehaviorId from a string
 */
export function createBehaviorId(id: string): BehaviorId {
  return id as BehaviorId;
}

/**
 * Helper function to create a MeepleId from a string
 */
export function createMeepleId(id: string): MeepleId {
  return id as MeepleId;
}

// ============================================================================
// Enums
// ============================================================================

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
  SpaceCafe = "SpaceCafe",
  SpaceDance = "SpaceDance",
  SpaceFun = "SpaceFun",
  SpaceApartments = "SpaceApartments",
  Bartender = "Bartender",
  Pirate = "Pirate",
  PirateDen = "PirateDen",
  Mechanic = "Mechanic",
  Custom = "Custom",
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
  Patrolling = "patrolling",
  Chasing = "chasing",
  Broken = "broken",
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

export type MeepleStateTraveling = {
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

export type MeepleStatePatrolling = {
  type: MeepleStateType.Patrolling;
};

export type MeepleStateChasing = {
  type: MeepleStateType.Chasing;
  target: Meeple;
};

export type MeepleStateBroken = {
  type: MeepleStateType.Broken;
};

export type MeepleState =
  | MeepleStateIdle
  | MeepleStateMining
  | MeepleStateTraveling
  | MeepleStateTrading
  | MeepleStateChilling
  | MeepleStateSocializing
  | MeepleStateTransacting
  | MeepleStateWorking
  | MeepleStateConverting
  | MeepleStatePatrolling
  | MeepleStateChasing
  | MeepleStateBroken;

export enum ComparisonOperator {
  Equal = "=",
  LessThan = "<",
  GreaterThan = ">",
  LessThanOrEqual = "<=",
  GreaterThanOrEqual = ">=",
  NotEqual = "!=",
}

export type LogicRule = {
  id: RuleId;
  good: GoodType;
  operator: ComparisonOperator;
  value: number;
  action: LogicRuleActionType;
  productType?: Products; // Optional product type, defaults to meeple's productType
  destinationType?: MeepleType; // Optional destination type to target specific entity types
  destinationName?: string; // Optional specific destination name (takes precedence over destinationType)
  required?: boolean; // If true, this rule cannot be edited or removed (default rules)
};

export enum LogicRuleActionType {
  MineOreFromAsteroid = "Mine Ore From Asteroid",
  SellOreToStation = "Sell Ore To Station",
  SocializeAtBar = "Socialize At Bar",
  WorkAtBar = "Work At Bar",
  BuyProductFromStation = "Buy Product From Station",
  SellProductToStation = "Sell Product To Station",
  RestAtApartments = "Rest At Apartments",
  Patrol = "Patrol",
  GoToPirateDen = "Go To Pirate Den",
  ChaseTarget = "Chase Target",
  SetBroken = "Set Broken",
  FixBrokenMeeple = "Fix Broken Meeple",
}

export type RuleBehavior = {
  id: BehaviorId;
  name: string;
  rules: LogicRule[];
};

// ============================================================================
// Diary Types
// ============================================================================

/**
 * A diary entry that records an action or state change for a meeple
 */
export type DiaryEntry = {
  timestamp: number;
  ruleId: RuleId | null;
  action: LogicRuleActionType | null;
  state: MeepleStateType;
  targetName: string | null;
  goods: Partial<Goods>; // Snapshot of inventory at the time of the entry
};
