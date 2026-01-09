import type { MeepleState } from "../types";
import { MeepleStateNames } from "../types";

const getStateColor = (stateType: MeepleStateNames): string => {
  switch (stateType) {
    case MeepleStateNames.Idle:
      return "badge-neutral";
    case MeepleStateNames.Traveling:
      return "badge-primary";
    case MeepleStateNames.Visiting:
      return "badge-info";
    case MeepleStateNames.Transacting:
      return "badge-success";
    case MeepleStateNames.Mining:
      return "badge-warning";
    case MeepleStateNames.Buying:
      return "badge-error";
    case MeepleStateNames.Selling:
      return "badge-info";
    case MeepleStateNames.Transmuting:
      return "badge-warning";
    case MeepleStateNames.Generating:
      return "badge-success";
    default:
      return "badge-neutral";
  }
};

export const StateType = ({ state }: { state: MeepleState }) => {
  return (
    <span className={`badge badge-sm ${getStateColor(state.type)} uppercase font-semibold`}>
      {state.type}
    </span>
  );
};