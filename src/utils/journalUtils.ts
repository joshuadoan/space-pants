import type { MeepleState, MeepleAction } from "../entities/Meeple";
import { CurrencyType, MiningType, ProductType, RoleId, VitalsType, UserActionType } from "../entities/types";

type JournalEntry = {
  timestamp: number;
  state: MeepleState;
  action: MeepleAction;
  source?: "rule" | "generator";
};

export type IconKey = 
  | MiningType 
  | ProductType
  | CurrencyType 
  | RoleId 
  | VitalsType 
  | UserActionType;

export type FormattedJournalEntry = {
  text: string;
  icons: IconKey[];
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
 * Gets the target role from a Meeple object
 */
const getTargetRole = (target: any): RoleId | null => {
  if (!target) return null;
  if (target.roleId) return target.roleId;
  return null;
};

/**
 * Formats transaction text based on context and role
 */
const formatTransactionText = (
  state: MeepleState,
  good: MiningType | ProductType | CurrencyType,
  quantity: number,
  transactionType: "add" | "remove",
  goodName: string,
  icons: IconKey[],
  source?: "rule" | "generator"
): FormattedJournalEntry => {
  // Handle transactions while visiting another meeple
  if (state.name === "visiting" && "target" in state) {
    const targetRole = getTargetRole(state.target);
    
    switch (targetRole) {
      case RoleId.Asteroid:
        return formatAsteroidVisitTransaction(good, quantity, transactionType, goodName, icons);
      
      case RoleId.SpaceStore:
        return formatSpaceStoreVisitTransaction(state, good, quantity, transactionType, goodName, icons);
      
      case RoleId.SpaceBar:
      case RoleId.SpaceApartments:
        return formatGenericVisitTransaction(good, quantity, transactionType, goodName, icons);
      
      default:
        return formatGenericVisitTransaction(good, quantity, transactionType, goodName, icons);
    }
  }
  
  // Handle transactions when not visiting (internal operations)
  return formatInternalTransaction(good, quantity, transactionType, goodName, icons, source);
};

/**
 * Formats transaction text when visiting an asteroid
 */
const formatAsteroidVisitTransaction = (
  good: MiningType | ProductType | CurrencyType,
  quantity: number,
  transactionType: "add" | "remove",
  goodName: string,
  icons: IconKey[]
): FormattedJournalEntry => {
  switch (good) {
    case MiningType.Ore:
      if (transactionType === "add") {
        icons.push(MiningType.Ore);
        return {
          text: `Mined ${quantity} ${goodName}`,
          icons,
        };
      }
      break;
    
    default:
      return formatGenericTransaction(good, quantity, transactionType, goodName, icons);
  }
  
  return formatGenericTransaction(good, quantity, transactionType, goodName, icons);
};

/**
 * Formats transaction text when visiting a space store
 */
const formatSpaceStoreVisitTransaction = (
  state: MeepleState,
  good: MiningType | ProductType | CurrencyType,
  quantity: number,
  transactionType: "add" | "remove",
  goodName: string,
  icons: IconKey[]
): FormattedJournalEntry => {
  switch (good) {
    case MiningType.Ore:
      if (transactionType === "remove") {
        // Selling ore to the store
        icons.push(MiningType.Ore);
        return {
          text: `Sold ${quantity} ${goodName}`,
          icons,
        };
      } else if (transactionType === "add") {
        // Store is receiving ore (purchasing from visitor)
        icons.push(MiningType.Ore);
        return {
          text: `Purchased ${quantity} ${goodName}`,
          icons,
        };
      }
      break;
    
    case CurrencyType.Money:
      if (transactionType === "add") {
        // Gaining money - likely from selling ore
        if (state.inventory && state.inventory[MiningType.Ore] > 0) {
          icons.push(MiningType.Ore);
          icons.push(CurrencyType.Money);
          return {
            text: `Sold ${quantity} ${formatGoodName(MiningType.Ore)} for ${quantity} ${goodName}`,
            icons,
          };
        }
        icons.push(CurrencyType.Money);
        return {
          text: `Earned ${quantity} ${goodName}`,
          icons,
        };
      } else if (transactionType === "remove") {
        // Spending money - purchasing from store
        icons.push(CurrencyType.Money);
        return {
          text: `Spent ${quantity} ${goodName}`,
          icons,
        };
      }
      break;
    
    default:
      return formatGenericTransaction(good, quantity, transactionType, goodName, icons);
  }
  
  return formatGenericTransaction(good, quantity, transactionType, goodName, icons);
};

/**
 * Formats transaction text for generic visit (bar, apartments, etc.)
 */
const formatGenericVisitTransaction = (
  good: MiningType | ProductType | CurrencyType,
  quantity: number,
  transactionType: "add" | "remove",
  goodName: string,
  icons: IconKey[]
): FormattedJournalEntry => {
  return formatGenericTransaction(good, quantity, transactionType, goodName, icons);
};

/**
 * Formats transaction text for internal operations (not visiting)
 */
const formatInternalTransaction = (
  good: MiningType | ProductType | CurrencyType,
  quantity: number,
  transactionType: "add" | "remove",
  goodName: string,
  icons: IconKey[],
  source?: "rule" | "generator"
): FormattedJournalEntry => {
  // Generator-based transactions are internal generation/processing
  if (source === "generator") {
    switch (good) {
      case MiningType.Ore:
        icons.push(MiningType.Ore);
        if (transactionType === "add") {
          return {
            text: `Generated ${quantity} ${goodName}`,
            icons,
          };
        } else {
          return {
            text: `Processed ${quantity} ${goodName}`,
            icons,
          };
        }
      
      case CurrencyType.Money:
        icons.push(CurrencyType.Money);
        return {
          text: `Generated ${quantity} ${goodName}`,
          icons,
        };
      
      default:
        return formatGenericTransaction(good, quantity, transactionType, goodName, icons);
    }
  }
  
  // Rule-based transactions when not visiting are typically receiving goods
  switch (good) {
    case MiningType.Ore:
      if (transactionType === "remove") {
        // Ore being extracted (asteroid being mined)
        icons.push(MiningType.Ore);
        return {
          text: `Ore was extracted: lost ${quantity} ${goodName}`,
          icons,
        };
      } else if (transactionType === "add") {
        // Ore being received (store purchasing from miner)
        icons.push(MiningType.Ore);
        return {
          text: `Received ${quantity} ${goodName}`,
          icons,
        };
      }
      break;
    
    case CurrencyType.Money:
      if (transactionType === "add") {
        // Money being received (miner earning from sale)
        icons.push(CurrencyType.Money);
        return {
          text: `Received ${quantity} ${goodName}`,
          icons,
        };
      } else if (transactionType === "remove") {
        // Money being paid (store paying for ore)
        icons.push(CurrencyType.Money);
        return {
          text: `Paid ${quantity} ${goodName}`,
          icons,
        };
      }
      break;
    
    default:
      return formatGenericTransaction(good, quantity, transactionType, goodName, icons);
  }
  
  return formatGenericTransaction(good, quantity, transactionType, goodName, icons);
};

/**
 * Formats a generic transaction (fallback)
 */
const formatGenericTransaction = (
  good: MiningType | ProductType | CurrencyType,
  quantity: number,
  transactionType: "add" | "remove",
  goodName: string,
  icons: IconKey[]
): FormattedJournalEntry => {
  const actionVerb = transactionType === "add" ? "gained" : "spent";
  icons.push(good);
  return {
    text: `${actionVerb.charAt(0).toUpperCase() + actionVerb.slice(1)} ${quantity} ${goodName}`,
    icons,
  };
};

/**
 * Formats transaction completion messages
 */
const formatTransactionCompletion = (
  good: MiningType | ProductType | CurrencyType | VitalsType,
  quantity: number,
  transactionType: "add" | "remove",
  goodName: string,
  icons: IconKey[]
): FormattedJournalEntry => {
  // Only process valid icon keys (not VitalsType)
  if (good === "health" || good === "energy" || good === "happiness") {
    const actionVerb = transactionType === "add" ? "gained" : "lost";
    return {
      text: `${actionVerb.charAt(0).toUpperCase() + actionVerb.slice(1)} ${quantity} ${goodName}`,
      icons,
    };
  }
  
  switch (good) {
    case CurrencyType.Money:
      icons.push(CurrencyType.Money);
      if (transactionType === "add") {
        return {
          text: `Completed sale: earned ${quantity} ${goodName}`,
          icons,
        };
      } else {
        return {
          text: `Completed payment: paid ${quantity} ${goodName}`,
          icons,
        };
      }
    
    case MiningType.Ore:
      icons.push(MiningType.Ore);
      if (transactionType === "add") {
        return {
          text: `Completed mining: extracted ${quantity} ${goodName}`,
          icons,
        };
      } else {
        return {
          text: `Completed sale: sold ${quantity} ${goodName}`,
          icons,
        };
      }
    
    default:
      const actionVerb = transactionType === "add" ? "purchased" : "sold";
      icons.push(good);
      return {
        text: `Finished transaction: ${actionVerb} ${quantity} ${goodName}`,
        icons,
      };
  }
};

/**
 * Creates a human-readable sentence from a journal entry with contextual information
 * Uses all properties from the action and state to create a descriptive sentence
 */
export const formatJournalEntry = (entry: JournalEntry): FormattedJournalEntry => {
  const { action, state } = entry;
  const icons: IconKey[] = [];

  switch (action.name) {
    case "travel-to": {
      const targetName = getTargetName(action.target);
      const targetRole = getTargetRole(action.target);
      if (targetRole) {
        icons.push(targetRole);
      }
      return {
        text: `Started traveling to ${targetName}`,
        icons,
      };
    }

    case "visit": {
      const targetName = getTargetName(action.target);
      const targetRole = getTargetRole(action.target);
      if (targetRole) {
        icons.push(targetRole);
      }
      return {
        text: `Started visiting ${targetName}`,
        icons,
      };
    }

    case "transact-inventory": {
      const { good, quantity, transactionType } = action;
      const goodName = formatGoodName(good);
      
      return formatTransactionText(state, good, quantity, transactionType, goodName, icons, entry.source);
    }

    case "finish": {
      // When finishing, describe what they were doing based on the state at that time
      if (state.name === "traveling" && "target" in state) {
        const targetName = getTargetName(state.target);
        const targetRole = getTargetRole(state.target);
        if (targetRole) {
          icons.push(targetRole);
        }
        return {
          text: `Arrived at ${targetName}`,
          icons,
        };
      } else if (state.name === "visiting" && "target" in state) {
        const targetName = getTargetName(state.target);
        const targetRole = getTargetRole(state.target);
        if (targetRole) {
          icons.push(targetRole);
        }
        return {
          text: `Finished visiting ${targetName}`,
          icons,
        };
      } else if (state.name === "transacting" && "good" in state) {
        const { good, quantity, transactionType } = state;
        const goodName = formatGoodName(good);
        
        return formatTransactionCompletion(good, quantity, transactionType, goodName, icons);
      } else if (state.name === "idle") {
        return {
          text: "Became idle",
          icons: [],
        };
      }
      return {
        text: "Finished current activity",
        icons: [],
      };
    }

    default: {
      // TypeScript exhaustiveness check - this should never happen
      void action;
      return {
        text: "Performed unknown action",
        icons: [],
      };
    }
  }
};

