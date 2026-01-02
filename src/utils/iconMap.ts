import type { ComponentType } from "react";
import { createElement } from "react";
import {
  IconArrowLeft,
  IconBeer,
  IconBolt,
  IconBuilding,
  IconCamera,
  IconCurrencyDollar,
  IconEyeOff,
  IconHeart,
  IconMeteor,
  IconMoodSmile,
  IconPackage,
  IconPick,
  IconSparkles,
  IconUser,
} from "@tabler/icons-react";
import {
  CurrencyType,
  MiningType,
  ProductType,
  VitalsType,
} from "../entities/types";
import { RoleId, UserActionType } from "../entities/types";

// ============================================================================
// Icon Component Type
// ============================================================================

export type IconComponent = ComponentType<{
  size?: number;
  className?: string;
}>;

const IconMap: Record<
  | MiningType
  | ProductType
  | CurrencyType
  | VitalsType
  | RoleId
  | UserActionType,
  IconComponent
> = {
  [VitalsType.Health]: IconHeart,
  [VitalsType.Energy]: IconBolt,
  [VitalsType.Happiness]: IconMoodSmile,
  [MiningType.Ore]: IconPick,
  [CurrencyType.Money]: IconCurrencyDollar,
  [ProductType.Gruffle]: IconPackage,
  [RoleId.Miner]: IconPick,
  [RoleId.Asteroid]: IconMeteor,
  [RoleId.SpaceStore]: IconBuilding,
  [UserActionType.Back]: IconArrowLeft,
  [UserActionType.HideUi]: IconEyeOff,
  [ProductType.Fizzy]: IconSparkles,
  [RoleId.SpaceBar]: IconBeer,
  [RoleId.SpaceApartments]: IconBuilding,
  [UserActionType.TakeControl]: IconCamera,
  [RoleId.Player]: IconUser,
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
