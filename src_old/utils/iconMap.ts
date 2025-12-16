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

import { MeepleType, MeepleStateType, Resources, Products, MeepleStats, type GoodType } from "../entities/types";

// ============================================================================
// Icon Component Type
// ============================================================================

export type IconComponent = ComponentType<{ size?: number; className?: string }>;

// ============================================================================
// Goods Icons
// ============================================================================

export const GOODS_ICONS: Record<GoodType, IconComponent> = {
  [Resources.Money]: IconCurrencyDollar,
  [Resources.Ore]: IconPick,
  [Products.Gruffle]: IconPackage,
  [Products.Druffle]: IconPackage,
  [Products.Klintzpaw]: IconPackage,
  [Products.Grogin]: IconPackage,
  [Products.Fizz]: IconBeer,
  [MeepleStats.Health]: IconHeart,
  [MeepleStats.Energy]: IconBolt,
};

// ============================================================================
// MeepleType Icons
// ============================================================================

export const MEEPLE_TYPE_ICONS: Record<MeepleType, IconComponent> = {
  [MeepleType.Trader]: IconShip,
  [MeepleType.Miner]: IconPick,
  [MeepleType.Asteroid]: IconMeteor,
  [MeepleType.SpaceStation]: IconSatellite,
  [MeepleType.SpaceBar]: IconBeer,
  [MeepleType.SpaceApartments]: IconBuilding,
  [MeepleType.Bartender]: IconBeer,
  [MeepleType.Player]: IconRocket,
  [MeepleType.Pirate]: IconShip,
  [MeepleType.PirateDen]: IconBuilding,
  [MeepleType.Mechanic]: IconTool,
  [MeepleType.Custom]: IconShip,
};

// ============================================================================
// Tab Icons
// ============================================================================

export type MainTabType = "ships" | "destinations" | "player" | "help" | "economy";
export type TabType = "traders" | "miners" | "stations" | "asteroids" | "spacebars" | "spaceapartments" | "bartenders" | "pirates" | "piratedens" | "mechanics" | "all" | "player" | "my-meeples" | "create" | "help" | "economy";

export const MAIN_TAB_ICONS: Record<MainTabType, IconComponent> = {
  player: IconUser,
  ships: IconShip,
  destinations: IconMapPin,
  economy: IconCurrencyDollar,
  help: IconHelp,
};

export const SUBTAB_ICONS: Record<TabType, IconComponent> = {
  // Ship subtabs
  traders: IconShip,
  miners: IconPick,
  bartenders: IconUser,
  pirates: IconShip,
  mechanics: IconTool,
  // Destination subtabs
  stations: IconSatellite,
  asteroids: IconMeteor,
  spacebars: IconBeer,
  spaceapartments: IconBuilding,
  piratedens: IconBuilding,
  // Player subtabs
  "my-meeples": IconUsers,
  create: IconPlus,
  // Other tabs
  all: IconUsers,
  player: IconUser,
  help: IconHelp,
  economy: IconCurrencyDollar,
};

// ============================================================================
// State Icons
// ============================================================================

export const STATE_ICONS: Record<MeepleStateType, IconComponent> = {
  [MeepleStateType.Idle]: IconMoodSmile,
  [MeepleStateType.Traveling]: IconShip,
  [MeepleStateType.Mining]: IconPick,
  [MeepleStateType.Trading]: IconCurrencyDollar,
  [MeepleStateType.Socializing]: IconUsers,
  [MeepleStateType.Chilling]: IconMoodSmile,
  [MeepleStateType.Transacting]: IconCurrencyDollar,
  [MeepleStateType.Working]: IconBeer,
  [MeepleStateType.Converting]: IconRefresh,
  [MeepleStateType.Patrolling]: IconShip,
  [MeepleStateType.Chasing]: IconShip,
  [MeepleStateType.Broken]: IconBolt,
};

// ============================================================================
// Action Icons
// ============================================================================

export const ACTION_ICONS = {
  // CRUD actions
  add: IconPlus,
  edit: IconEdit,
  delete: IconTrash,
  save: IconDeviceFloppy,
  cancel: IconX,
  // Navigation
  back: IconArrowLeft,
  forward: IconArrowRight,
  up: IconArrowUp,
  down: IconArrowDown,
  // UI actions
  drag: IconGripVertical,
  randomize: IconDice,
  refresh: IconRefresh,
  info: IconInfoCircle,
  // Other
  click: IconClick,
  bulb: IconBulb,
} as const;

// ============================================================================
// Economy Icons
// ============================================================================

export const ECONOMY_ICONS = {
  exchange: IconExchange,
  trending: IconTrendingUp,
  chart: IconChartBar,
  coins: IconCoins,
  sword: IconSword,
} as const;

// ============================================================================
// Other Icons
// ============================================================================

export const OTHER_ICONS = {
  rocket: IconRocket,
  home: IconHome,
  clock: IconClock,
  book: IconBook,
  target: IconTarget,
  mailOff: IconMailOff,
} as const;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get icon for a good type
 */
export function getGoodIcon(good: GoodType): IconComponent {
  return GOODS_ICONS[good] || IconPackage;
}

/**
 * Get icon for a meeple type
 */
export function getMeepleTypeIcon(type: MeepleType): IconComponent {
  return MEEPLE_TYPE_ICONS[type] || IconShip;
}

/**
 * Get icon for a tab type
 */
export function getTabIcon(tab: TabType): IconComponent {
  return SUBTAB_ICONS[tab] || IconUser;
}

/**
 * Get icon for a main tab type
 */
export function getMainTabIcon(tab: MainTabType): IconComponent {
  return MAIN_TAB_ICONS[tab] || IconUser;
}

/**
 * Get icon for a meeple state type
 */
export function getStateIcon(state: MeepleStateType): IconComponent {
  return STATE_ICONS[state] || IconMoodSmile;
}

// ============================================================================
// Icon Component Wrapper
// ============================================================================

type IconComponentProps = {
  icon: IconComponent;
  size?: number;
  className?: string;
  fill?: string;
  [key: string]: unknown; // Allow other props to pass through
};

/**
 * Wrapper component to render an icon from the icon map
 */
export function IconComponent({ icon, size, className, fill, ...rest }: IconComponentProps) {
  return createElement(icon, { size, className, fill, ...rest } as Record<string, unknown>);
}

