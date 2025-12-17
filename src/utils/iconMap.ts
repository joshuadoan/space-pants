import type { ComponentType } from "react";
import { createElement } from "react";
import {
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconArrowUp,
  IconBeer,
  IconBolt,
  IconBook,
  IconBuilding,
  IconBulb,
  IconChartBar,
  IconClick,
  IconClock,
  IconCoins,
  IconCurrencyDollar,
  IconDeviceFloppy,
  IconDice,
  IconEdit,
  IconExchange,
  IconGripVertical,
  IconHeart,
  IconHelp,
  IconHome,
  IconInfoCircle,
  IconMailOff,
  IconMapPin,
  IconMeteor,
  IconMoodSmile,
  IconPackage,
  IconPick,
  IconPlus,
  IconRefresh,
  IconRocket,
  IconSatellite,
  IconShip,
  IconSword,
  IconTarget,
  IconTool,
  IconTrendingUp,
  IconTrash,
  IconUser,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import { GoodType, VitalsType } from "../entities/Meeple";

// ============================================================================
// Icon Component Type
// ============================================================================

export type IconComponent = ComponentType<{ size?: number; className?: string }>;

const IconMap: Record<GoodType | VitalsType, IconComponent> = {
  [VitalsType.Health]: IconHeart,
  [VitalsType.Energy]: IconBolt,
  [VitalsType.Happiness]: IconMoodSmile,
  [GoodType.Ore]: IconPick,
  [GoodType.Money]: IconCurrencyDollar,
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
export function IconComponent({ icon, size, className, fill, ...rest }: IconComponentProps) {
  return createElement(IconMap[icon], { size, className, fill, ...rest } as Record<string, unknown>);
}

