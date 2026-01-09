import type { Game } from "./Game/Game";
import type { Meeple } from "./Game/Meeple";

export enum MeepleRoles {
  Miner = "miner",
  Asteroid = "asteroid",
  SpaceStore = "space-store",
  SpaceBar = "space-bar",
  SpaceApartment = "space-apartment",
  Bartender = "bartender",
}

export enum MeepleInventoryItem {
  Minirals = "minirals",
  Money = "money",
  Fizzy = "fizzy",
}

export type MeepleInventory = Record<MeepleInventoryItem, number>;

export type MeepleActionTravel = {
  type: "travel";
  target: Meeple;
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
};

export type MeepleActionSell = {
  type: "sell";
  target: Meeple;
  property: MeepleInventoryItem;
  quantity: number;
};

export type MeepleActionTransmutation = {
  type: "transmutation";
  fromProperty: MeepleInventoryItem;
  fromQuantity: number;
  toProperty: MeepleInventoryItem;
  toQuantity: number;
};

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
  | GenerateAction;

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
}

export type MeepleStateIdle = {
  type: MeepleStateNames.Idle;
};

export type MeepleStateTraveling = {
  type: MeepleStateNames.Traveling;
  target: Meeple;
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
};

export type MeepleStateSelling = {
  type: MeepleStateNames.Selling;
  target: Meeple;
  property: MeepleInventoryItem;
  quantity: number;
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

export type MeepleState =
  | MeepleStateIdle
  | MeepleStateTraveling
  | MeepleStateVisiting
  | MeepleStateTransacting
  | MeepleStateMining
  | MeepleStateBuying
  | MeepleStateSelling
  | MeepleStateTransmuting
  | MeepleStateGenerating;

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
}

export enum Operator {
  Equal = "equal",
  LessThan = "less-than",
  GreaterThan = "greater-than",
  LessThanOrEqual = "less-than-or-equal",
  GreaterThanOrEqual = "greater-than-or-equal",
  NotEqual = "not-equal",
}

export type ConditionSelfInventory = {
  description: string;
  type: ConditionType.Inventory;
  property: MeepleInventoryItem;
  operator: Operator;
  quantity: number;
  action: (meeple: Meeple, game: Game) => void;
  target?: Meeple;
};

export type Condition = ConditionSelfInventory;
