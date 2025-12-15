import type { ComponentType, ReactElement } from "react";
import { IconPackage } from "@tabler/icons-react";

import { MeepleStats, Products, Resources, type GoodType } from "../entities/types";
import { GOODS_ICONS } from "./iconMap";

export type GoodMetadata = {
  value: GoodType;
  label: string;
  IconComponent: ComponentType<{ size?: number }>;
};

const GOODS_METADATA_MAP: Record<GoodType, GoodMetadata> = {
  [Resources.Money]: {
    value: Resources.Money,
    label: "Money",
    IconComponent: GOODS_ICONS[Resources.Money],
  },
  [Resources.Ore]: {
    value: Resources.Ore,
    label: "Ore",
    IconComponent: GOODS_ICONS[Resources.Ore],
  },
  [Products.Gruffle]: {
    value: Products.Gruffle,
    label: "Gruffle",
    IconComponent: GOODS_ICONS[Products.Gruffle],
  },
  [Products.Druffle]: {
    value: Products.Druffle,
    label: "Druffle",
    IconComponent: GOODS_ICONS[Products.Druffle],
  },
  [Products.Klintzpaw]: {
    value: Products.Klintzpaw,
    label: "Klintzpaw",
    IconComponent: GOODS_ICONS[Products.Klintzpaw],
  },
  [Products.Grogin]: {
    value: Products.Grogin,
    label: "Grogin",
    IconComponent: GOODS_ICONS[Products.Grogin],
  },
  [Products.Fizz]: {
    value: Products.Fizz,
    label: "Fizz",
    IconComponent: GOODS_ICONS[Products.Fizz],
  },
  [MeepleStats.Health]: {
    value: MeepleStats.Health,
    label: "Health",
    IconComponent: GOODS_ICONS[MeepleStats.Health],
  },
  [MeepleStats.Energy]: {
    value: MeepleStats.Energy,
    label: "Energy",
    IconComponent: GOODS_ICONS[MeepleStats.Energy],
  },
};

export function getGoodMetadata(good: GoodType): GoodMetadata | undefined {
  return GOODS_METADATA_MAP[good];
}

export function getGoodIcon(good: GoodType, size: number = 18): ReactElement {
  const metadata = getGoodMetadata(good);
  const IconComponent = metadata?.IconComponent || IconPackage;
  return <IconComponent size={size} />;
}

export function getGoodLabel(good: GoodType): string {
  return getGoodMetadata(good)?.label || good;
}

// Legacy function for backward compatibility - returns string without emoji
export function getGoodEmoji(_good: GoodType): string {
  return "";
}

export function formatGoodDisplay(good: GoodType, quantity: number): string {
  const metadata = getGoodMetadata(good);
  if (!metadata) {
    return `${quantity}x ${good}`;
  }

  if (good === Resources.Money) {
    return `$${quantity}`;
  }
  if (good === Resources.Ore) {
    return `${quantity} ore`;
  }
  // Products
  return `${quantity}x ${metadata.label}`;
}

