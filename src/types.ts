import type { Vector } from "excalibur";
import type { Game } from "./Game/Game";
import type { Meeple } from "./Game/Meeple";

export enum MeepleRoles {
  Miner = "miner",
  Asteroid = "asteroid",
  SpaceStore = "space-store",
  SpaceBar = "space-bar",
  SpaceApartment = "space-apartment",
  Bartender = "bartender",
  PirateBase = "pirate-base",
  PirateShip = "pirate-ship",
}

export enum MeepleInventoryItem {
  Minirals = "minirals",
  Money = "money",
  Fizzy = "fizzy",
}

export type MeepleInventory = Record<MeepleInventoryItem, number>;

export type MeepleActionTravel = {
  type: "travel";
  target: Meeple | Vector;
};

// finish (goes to passed in state or idle by default)
export type MeepleActionFinish = {
  type: "finish";
  state?: MeepleState;
};

// chase 
export type MeepleActionChase = {
  type: "chase";
  target: Meeple;
  startTime: number; // when the chase started
};


// flee
export type MeepleActionFlee = {
  type: "flee";
  target: Meeple;
  startTime: number; // when the flee started
};

export type MeepleActionVisit = {
  type: "visit";
  target: Meeple;
};

export type MeepleActionTransact = {
  type: "transact";
  transaction: MeepleTransaction;
};

export type MeepleActionMine = {
  type: "mine";
  target: Meeple;
  property: MeepleInventoryItem;
  quantity: number;
};

export type MeepleActionBuy = {
  type: "buy";
  target: Meeple;
  property: MeepleInventoryItem;
  quantity: number;
  price: number;
};

export type MeepleActionConsume = {
  type: "consume";
  property: MeepleInventoryItem;
  quantity: number;
};

export type MeepleActionSell = {
  type: "sell";
  target: Meeple;
  property: MeepleInventoryItem;
  quantity: number;
  price: number;
};

export type MeepleActionTransmutation = {
  type: "transmutation";
  fromProperty: MeepleInventoryItem;
  fromQuantity: number;
  toProperty: MeepleInventoryItem;
  toQuantity: number;
};

export type MeepleActionPatrolForRole = {
  type: "patrol-for-role";
  role: MeepleRoles;
}

export type GenerateAction = {
  type: "generate";
  property: MeepleInventoryItem;
  quantity: number;
};

export type MeepleAction =
  | MeepleActionTravel
  | MeepleActionVisit
  | MeepleActionTransact
  | MeepleActionMine
  | MeepleActionBuy
  | MeepleActionSell
  | MeepleActionTransmutation
  | GenerateAction
  | MeepleActionConsume
  | MeepleActionPatrolForRole
  | MeepleActionChase
  | MeepleActionFlee
  | MeepleActionFinish;

export enum MeepleStateNames {
  Idle = "idle",
  Traveling = "traveling",
  Visiting = "visiting",
  Transacting = "transacting",
  Mining = "mining",
  Buying = "buying",
  Selling = "selling",
  Transmuting = "transmuting",
  Generating = "generating",
  Consuming = "consuming",
  Patrolling = "patrolling",
  Chasing = "chasing",
  Fleeing = "fleeing",
  Targeted = "targeted",
};

export type MeepleStatePatrolling = {
  type: MeepleStateNames.Patrolling;
  role: MeepleRoles;
};

export type MeepleStateIdle = {
  type: MeepleStateNames.Idle;
};

export type MeepleStateChasing = {
  type: MeepleStateNames.Chasing;
  target: Meeple;
  startTime: number; // when the chase started
};

export type MeepleStateTraveling = {
  type: MeepleStateNames.Traveling;
  target: Meeple | Vector;
};

export type MeepleStateVisiting = {
  type: MeepleStateNames.Visiting;
  target: Meeple;
};

export type MeepleStateTransacting = {
  type: MeepleStateNames.Transacting;
  transaction: MeepleTransaction;
};

export type MeepleStateMining = {
  type: MeepleStateNames.Mining;
  target: Meeple;
  property: MeepleInventoryItem;
  quantity: number;
};

export type MeepleStateBuying = {
  type: MeepleStateNames.Buying;
  target: Meeple;
  property: MeepleInventoryItem;
  quantity: number;
  price: number;
};

export type MeepleStateSelling = {
  type: MeepleStateNames.Selling;
  target: Meeple;
  property: MeepleInventoryItem;
  quantity: number;
  price: number;
};

export type MeepleStateTransmuting = {
  type: MeepleStateNames.Transmuting;
  fromProperty: MeepleInventoryItem;
  fromQuantity: number;
  toProperty: MeepleInventoryItem;
  toQuantity: number;
};

export type MeepleStateGenerating = {
  type: MeepleStateNames.Generating;
  property: MeepleInventoryItem;
  quantity: number;
};

export type MeepleStateConsuming = {
  type: MeepleStateNames.Consuming;
  property: MeepleInventoryItem;
  quantity: number;
};

export type MeepleStateFleeing = {
  type: MeepleStateNames.Fleeing;
  target: Meeple;
};

export type MeepleStateTargeted = {
  type: MeepleStateNames.Targeted;
  pursuer: Meeple;
};

export type MeepleState =
  | MeepleStateIdle
  | MeepleStateTraveling
  | MeepleStateVisiting
  | MeepleStateTransacting
  | MeepleStateMining
  | MeepleStateBuying
  | MeepleStateSelling
  | MeepleStateTransmuting
  | MeepleStateGenerating
  | MeepleStateConsuming
  | MeepleStatePatrolling
  | MeepleStateChasing
  | MeepleStateFleeing
  | MeepleStateTargeted;

export type MeepleActionHistory = {
  action: MeepleAction;
  timestamp: number;
  state: MeepleState;
};

export type MeepleTransaction = {
  from: Meeple | null;
  to: Meeple | null;
  property: MeepleInventoryItem;
  quantity: number;
};

export enum ConditionType {
  Inventory = "inventory",
  Radar = "radar",
}

export enum Operator {
  Equal = "equal",
  LessThan = "less-than",
  GreaterThan = "greater-than",
  LessThanOrEqual = "less-than-or-equal",
  GreaterThanOrEqual = "greater-than-or-equal",
  NotEqual = "not-equal",
}

export type ConditionAction = {
  [key in MeepleStateNames]?: () => void;
};

export type ConditionSelfInventory = {
  description: string;
  type: ConditionType.Inventory;
  property: MeepleInventoryItem;
  operator: Operator;
  quantity: number;
  action: (meeple: Meeple, game: Game) => ConditionAction;
  target?: Meeple;
};

export type ConditionSelfRadar = {
  description: string;
  type: ConditionType.Radar;
  roles: MeepleRoles[];
  operator: Operator;
  action: (meeple: Meeple, game: Game) => ConditionAction;
  target?: Meeple;
};

export type Condition = ConditionSelfInventory | ConditionSelfRadar;

export type ActionHistory = {
  action: MeepleAction;
  timestamp: number;
  state: MeepleState;
};