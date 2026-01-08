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
  Stuff = "stuff",
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

export type MeepleAction =
  | MeepleActionTravel
  | MeepleActionVisit
  | MeepleActionTransact;

export enum MeepleStateNames {
  Idle = "idle",
  Traveling = "traveling",
  Visiting = "visiting",
  Transacting = "transacting",
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

export type MeepleState =
  | MeepleStateIdle
  | MeepleStateTraveling
  | MeepleStateVisiting
  | MeepleStateTransacting;

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
};

export type Condition = ConditionSelfInventory;
