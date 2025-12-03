import { Products, Resources, type GoodType } from "../types";
import {
  IconCurrencyDollar,
  IconPick,
  IconPackage,
  IconBeer,
} from "@tabler/icons-react";
import type { ReactElement, ComponentType } from "react";

export type GoodMetadata = {
  value: GoodType;
  label: string;
  IconComponent: ComponentType<{ size?: number }>;
};

const GOODS_METADATA_MAP: Record<GoodType, GoodMetadata> = {
  [Resources.Money]: {
    value: Resources.Money,
    label: "Money",
    IconComponent: IconCurrencyDollar,
  },
  [Resources.Ore]: {
    value: Resources.Ore,
    label: "Ore",
    IconComponent: IconPick,
  },
  [Products.Gruffle]: {
    value: Products.Gruffle,
    label: "Gruffle",
    IconComponent: IconPackage,
  },
  [Products.Druffle]: {
    value: Products.Druffle,
    label: "Druffle",
    IconComponent: IconPackage,
  },
  [Products.Klintzpaw]: {
    value: Products.Klintzpaw,
    label: "Klintzpaw",
    IconComponent: IconPackage,
  },
  [Products.Grogin]: {
    value: Products.Grogin,
    label: "Grogin",
    IconComponent: IconPackage,
  },
  [Products.Fizz]: {
    value: Products.Fizz,
    label: "Fizz",
    IconComponent: IconBeer,
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

