import type { ComponentType } from "react";
import { createElement } from "react";
import {
  IconArrowLeft,
  IconArrowsExchange,
  IconBuilding,
  IconClock,
  IconCurrencyDollar,
  IconMapPin,
  IconMeteor,
  IconPackage,
  IconPick,
  IconRoute,
} from "@tabler/icons-react";

// ============================================================================
// Icon Component Type
// ============================================================================

export type IconComponent = ComponentType<{
  size?: number;
  className?: string;
}>;

const IconMap: Record<
  string,
  IconComponent
> = {
  // Roles
  "miner": IconPick,
  "trader": IconPackage,
  "asteroid": IconMeteor,
  "space-store": IconBuilding,
  // Navigation
  "arrow-left": IconArrowLeft,
  // Inventory Items
  "stuff": IconPackage,
  "money": IconCurrencyDollar,
  // Actions
  "travel": IconRoute,
  "visit": IconMapPin,
  "transact": IconArrowsExchange,
  // States
  "idle": IconClock,
  "traveling": IconRoute,
  "visiting": IconMapPin,
  "transacting": IconArrowsExchange,
  "position": IconMapPin,
} as const;

// ============================================================================
// Icon Component Wrapper
// ============================================================================

type IconComponentProps = {
  icon: keyof typeof IconMap;
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
  size,
  className,
  fill,
  ...rest
}: IconComponentProps) {
  const iconElement = createElement(IconMap[icon], {
    size,
    className,
    fill,
    ...rest,
  } as Record<string, unknown>);

  return createElement(
    "div",
    {
      className: "tooltip tooltip-top cursor-pointer",
      "data-tip": icon,
    },
    iconElement
  );
}
