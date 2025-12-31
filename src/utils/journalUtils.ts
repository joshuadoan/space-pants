import type { MeepleState, MeepleAction } from "../entities/Meeple";

type JournalEntry = {
  timestamp: number;
  state: MeepleState;
  action: MeepleAction;
};

/**
 * Formats a good name for display (e.g., "iron-ore" -> "iron ore")
 */
const formatGoodName = (good: string): string => {
  return good.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

/**
 * Gets the target name from a Meeple object, handling edge cases
 */
const getTargetName = (target: any): string => {
  if (!target) return "unknown location";
  if (typeof target === "string") return target;
  if (target.name) return target.name;
  if (target.roleId) return target.roleId;
  return "unknown location";
};

/**
 * Creates a human-readable sentence from a journal entry
 * Uses all properties from the action and state to create a descriptive sentence
 */
export const formatJournalEntry = (entry: JournalEntry): string => {
  const { action, state } = entry;

  switch (action.name) {
    case "travel-to": {
      const targetName = getTargetName(action.target);
      return `Started traveling to ${targetName}`;
    }

    case "visit": {
      const targetName = getTargetName(action.target);
      return `Started visiting ${targetName}`;
    }

    case "transact-inventory": {
      const { good, quantity, transactionType } = action;
      const goodName = formatGoodName(good);
      const actionVerb = transactionType === "add" ? "gained" : "spent";
      return `${actionVerb.charAt(0).toUpperCase() + actionVerb.slice(1)} ${quantity} ${goodName}`;
    }

    case "finish": {
      // When finishing, describe what they were doing based on the state at that time
      if (state.name === "traveling" && "target" in state) {
        const targetName = getTargetName(state.target);
        return `Arrived at ${targetName}`;
      } else if (state.name === "visiting" && "target" in state) {
        const targetName = getTargetName(state.target);
        return `Finished visiting ${targetName}`;
      } else if (state.name === "transacting" && "good" in state) {
        const { good, quantity, transactionType } = state;
        const goodName = formatGoodName(good);
        const actionVerb = transactionType === "add" ? "purchased" : "sold";
        return `Finished transaction: ${actionVerb} ${quantity} ${goodName}`;
      } else if (state.name === "idle") {
        return "Became idle";
      }
      return "Finished current activity";
    }

    default:
      return `Performed ${action.name.replace(/-/g, " ")}`;
  }
};

