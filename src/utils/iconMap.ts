import type { ComponentType } from "react";
import { createElement } from "react";
import {
  IconArrowLeft,
  IconArrowsExchange,
  IconBeer,
  IconBuilding,
  IconClock,
  IconCurrencyDollar,
  IconGlassCocktail,
  IconMapPin,
  IconMeteor,
  IconPackage,
  IconPick,
  IconRoute,
  IconMoon,
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
  "space-bar": IconBeer,
  "space-apartment": IconBuilding,
  "bartender": IconBeer,
  // Navigation
  "arrow-left": IconArrowLeft,
  // Inventory Items
  "stuff": IconPackage,
  "money": IconCurrencyDollar,
  "fizzy": IconGlassCocktail,
  // Actions
  "travel": IconRoute,
  "visit": IconMapPin,
  "transact": IconArrowsExchange,
  "transmutation": IconArrowsExchange,
  "mine": IconPick,
  "buy": IconCurrencyDollar,
  "sell": IconArrowsExchange,
  "generate": IconMoon,
  // States
  "idle": IconClock,
  "traveling": IconRoute,
  "visiting": IconMapPin,
  "transacting": IconArrowsExchange,
  "generating": IconMoon,
  "mining": IconPick,
  "buying": IconCurrencyDollar,
  "selling": IconArrowsExchange,
  "transmuting": IconArrowsExchange,
  "position": IconMapPin,
  "minirals": IconMoon,
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
