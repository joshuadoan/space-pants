import { MeepleStateType, type Goods, type GoodType, type MeepleState } from "../types";

// Forward declaration for Meeple to avoid circular dependency
// Using a type-only import pattern - the actual Meeple class will be imported where needed
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type Meeple = import("./Meeple").Meeple;

// Action types for Meeple state management
export type SetStateAction = {
  type: "set-state";
  payload: MeepleState;
};

export type SetIdleAction = {
  type: "set-idle";
};

export type SetTravelingAction = {
  type: "set-traveling";
  payload: { target: Meeple };
};

export type SetActiveStateAction = {
  type: "set-active-state";
  payload: { stateType: MeepleStateType; target: Meeple };
};

export type SetBrokenAction = {
  type: "set-broken";
};

export type AddGoodAction = {
  type: "add-good";
  payload: { good: GoodType; quantity: number };
};

export type RemoveGoodAction = {
  type: "remove-good";
  payload: { good: GoodType; quantity: number };
};

export type SetGoodAction = {
  type: "set-good";
  payload: { good: GoodType; quantity: number };
};

export type MeepleAction =
  | SetStateAction
  | SetIdleAction
  | SetTravelingAction
  | SetActiveStateAction
  | SetBrokenAction
  | AddGoodAction
  | RemoveGoodAction
  | SetGoodAction;

// State interface for the reducer
export interface MeepleReducerState {
  goods: Partial<Goods>;
  state: MeepleState;
}

