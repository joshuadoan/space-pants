import { Products, Resources, type GoodType } from "../types";

export type GoodMetadata = {
  value: GoodType;
  label: string;
  emoji: string;
};

export const GOODS_METADATA: GoodMetadata[] = [
  { value: Resources.Money, label: "Money", emoji: "💰" },
  { value: Resources.Ore, label: "Ore", emoji: "⛏️" },
  { value: Products.Gruffle, label: "Gruffle", emoji: "📦" },
  { value: Products.Druffle, label: "Druffle", emoji: "📦" },
  { value: Products.Klintzpaw, label: "Klintzpaw", emoji: "📦" },
  { value: Products.Grogin, label: "Grogin", emoji: "📦" },
  { value: Products.Fizz, label: "Fizz", emoji: "🍺" },
];

export function getGoodMetadata(good: GoodType): GoodMetadata | undefined {
  return GOODS_METADATA.find((g) => g.value === good);
}

export function getGoodEmoji(good: GoodType): string {
  return getGoodMetadata(good)?.emoji || "📦";
}

export function getGoodLabel(good: GoodType): string {
  return getGoodMetadata(good)?.label || good;
}

export function formatGoodDisplay(good: GoodType, quantity: number): string {
  const metadata = getGoodMetadata(good);
  if (!metadata) {
    return `📦 ${quantity}x ${good}`;
  }

  if (good === Resources.Money) {
    return `${metadata.emoji} $${quantity}`;
  }
  if (good === Resources.Ore) {
    return `${metadata.emoji} ${quantity} ore`;
  }
  // Products
  return `${metadata.emoji} ${quantity}x ${metadata.label}`;
}

