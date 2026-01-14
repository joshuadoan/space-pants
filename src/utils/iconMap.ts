import type { ComponentType } from "react";
import { createElement } from "react";
import {
  IconArrowLeft,
  IconArrowsExchange,
  IconBottle,
  IconBox,
  IconCash,
  IconCheck,
  IconChefHat,
  IconClock,
  IconCurrencyDollar,
  IconDiamond,
  IconEye,
  IconGlassFull,
  IconHammer,
  IconHome,
  IconMapPin,
  IconMeteor,
  IconRoute,
  IconShip,
  IconShoppingBag,
  IconShoppingCart,
  IconSparkles,
} from "@tabler/icons-react";
import type {
  MeepleRoles,
  MeepleInventoryItem,
  MeepleAction,
  MeepleStateNames,
} from "../types";

// ============================================================================
// Icon Component Type
// ============================================================================

export type IconComponent = ComponentType<{
  size?: number;
  className?: string;
}>;

// ============================================================================
// Type-safe Icon Keys
// ============================================================================

// Extract action types from MeepleAction union
type ActionType = MeepleAction["type"];

// Extract enum values as string literal types
type MeepleRolesValue = `${MeepleRoles}`;
type MeepleInventoryItemValue = `${MeepleInventoryItem}`;
type MeepleStateNamesValue = `${MeepleStateNames}`;

// Union of all required icon keys
type RequiredIconKeys =
  | MeepleRolesValue // All role enum values
  | MeepleInventoryItemValue // All inventory item enum values
  | ActionType // All action type strings
  | MeepleStateNamesValue // All state enum values
  | "arrow-left" // Navigation
  | "position" // Position indicator
  | "trader" // Legacy/alternative role identifier
  | "stuff"; // Legacy inventory item

// Type that requires all keys to be present
// Using Record ensures all RequiredIconKeys must have a value
type IconMapType = Record<RequiredIconKeys, IconComponent>;

// This will error if any RequiredIconKeys are missing from the object
const IconMap: IconMapType = {
  // Roles
  "miner": IconHammer,
  "trader": IconShoppingCart,
  "asteroid": IconMeteor,
  "space-store": IconShoppingBag,
  "space-bar": IconGlassFull,
  "space-apartment": IconHome,
  "bartender": IconChefHat,
  "pirate-base":  IconHome,
  "pirate-ship": IconShip,
  // Navigation
  "arrow-left": IconArrowLeft,
  // Inventory Items
  "stuff": IconBox,
  "money": IconCurrencyDollar,
  "fizzy": IconBottle,
  // Actions
  "travel": IconRoute,
  "visit": IconMapPin,
  "transact": IconArrowsExchange,
  "transmutation": IconArrowsExchange,
  "mine": IconHammer,
  "buy": IconShoppingCart,
  "sell": IconCash,
  "generate": IconSparkles,
  "consume": IconBottle,
  "patrol-for-role": IconMapPin,
  "chase": IconMapPin,
  "flee": IconMapPin,
  // States
  "idle": IconClock,
  "traveling": IconRoute,
  "visiting": IconMapPin,
  "transacting": IconArrowsExchange,
  "generating": IconSparkles,
  "mining": IconHammer,
  "consuming": IconBottle,
  "buying": IconShoppingCart,
  "selling": IconCash,
  "transmuting": IconArrowsExchange,
  "position": IconMapPin,
  "minirals": IconDiamond,
  "patrolling": IconMapPin,
  "chasing": IconMapPin,
  "fleeing": IconMapPin,
  "targeted": IconEye,
  "finish": IconCheck,
};

// ============================================================================
// Icon Component Wrapper
// ============================================================================

type IconComponentProps = {
  icon: keyof typeof IconMap;
  title: string;
  size?: number;
  className?: string;
  fill?: string;
  [key: string]: unknown; // Allow other props to pass through
};

/**
 * Wrapper component to render an icon from the icon map
 */
export function IconComponent({
  icon,
  title,
  size,
  className,
  fill,
  ...rest
}: IconComponentProps) {
  const iconElement = createElement(IconMap[icon], {
    title,
    size,
    className,
    fill,
    ...rest,
  } as Record<string, unknown>);

  return createElement(
    "div",
    {
      className: "tooltip tooltip-top cursor-pointer",
      "data-tip": title,
    },
    iconElement
  );
}
