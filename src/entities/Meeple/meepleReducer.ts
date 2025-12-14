import { MeepleStateType, MeepleStats } from "../types";

import type { MeepleAction, MeepleReducerState } from "./meepleTypes";

/**
 * Reducer function for managing Meeple state and goods
 */
export function meepleReducer(
  state: MeepleReducerState,
  action: MeepleAction
): MeepleReducerState {
  switch (action.type) {
    case "set-state":
      return {
        ...state,
        state: action.payload,
      };
    case "set-idle":
      return {
        ...state,
        state: {
          type: MeepleStateType.Idle,
        },
      };
    case "set-traveling":
      return {
        ...state,
        state: {
          type: MeepleStateType.Traveling,
          target: action.payload.target,
        },
      };
    case "set-active-state":
      return {
        ...state,
        state: {
          type: action.payload.stateType,
          target: action.payload.target,
        } as MeepleReducerState["state"],
      };
    case "set-broken":
      return {
        ...state,
        state: {
          type: MeepleStateType.Broken,
        },
      };
    case "add-good":
      return {
        ...state,
        goods: {
          ...state.goods,
          [action.payload.good]:
            (state.goods[action.payload.good] || 0) + action.payload.quantity,
        },
      };
    case "remove-good":
      const currentValue = state.goods[action.payload.good] || 0;
      const newValue = currentValue - action.payload.quantity;
      // Ensure health never drops below 0
      const clampedValue =
        action.payload.good === MeepleStats.Health
          ? Math.max(0, newValue)
          : newValue;
      return {
        ...state,
        goods: {
          ...state.goods,
          [action.payload.good]: clampedValue,
        },
      };
    case "set-good":
      // Ensure health never drops below 0
      const setValue =
        action.payload.good === MeepleStats.Health
          ? Math.max(0, action.payload.quantity)
          : action.payload.quantity;
      return {
        ...state,
        goods: {
          ...state.goods,
          [action.payload.good]: setValue,
        },
      };
    default:
      return state;
  }
}

