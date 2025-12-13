import type { MeepleAction, MeepleReducerState } from "./meepleTypes";
import { MeepleStateType } from "../types";

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
      return {
        ...state,
        goods: {
          ...state.goods,
          [action.payload.good]:
            (state.goods[action.payload.good] || 0) - action.payload.quantity,
        },
      };
    case "set-good":
      return {
        ...state,
        goods: {
          ...state.goods,
          [action.payload.good]: action.payload.quantity,
        },
      };
    default:
      return state;
  }
}

