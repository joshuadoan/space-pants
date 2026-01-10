import type { ComponentType } from "react";
import { createElement } from "react";
import {
  IconArrowLeft,
  IconArrowsExchange,
  IconBottle,
  IconBox,
  IconCash,
  IconChefHat,
  IconClock,
  IconCurrencyDollar,
  IconDiamond,
  IconGlassFull,
  IconHammer,
  IconHome,
  IconMapPin,
  IconMeteor,
  IconRoute,
  IconShoppingBag,
  IconShoppingCart,
  IconSparkles,
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
  "miner": IconHammer,
  "trader": IconShoppingCart,
  "asteroid": IconMeteor,
  "space-store": IconShoppingBag,
  "space-bar": IconGlassFull,
  "space-apartment": IconHome,
  "bartender": IconChefHat,
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
} as const;

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
