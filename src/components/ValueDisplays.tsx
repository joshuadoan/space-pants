import { GOODS_ICONS, IconComponent } from "../utils/iconMap";
import { Resources } from "../entities/types";

type MoneyDisplayProps = {
  amount: number;
};

export function MoneyDisplay({ amount }: MoneyDisplayProps) {
  return (
    <span className="flex items-center gap-1">
      <IconComponent icon={GOODS_ICONS[Resources.Money]} size={16} />
      ${amount}
    </span>
  );
}

type OreDisplayProps = {
  current: number;
  max: number;
  showLabel?: boolean;
};

export function OreDisplay({ current, max, showLabel = true }: OreDisplayProps) {
  return (
    <span className="flex items-center gap-1">
      <IconComponent icon={GOODS_ICONS[Resources.Ore]} size={16} />
      {current}/{max}
      {showLabel ? " ore" : ""}
    </span>
  );
}

type DistanceDisplayProps = {
  distance: number;
};

export function DistanceDisplay({ distance }: DistanceDisplayProps) {
  return <span>Distance: {distance}</span>;
}

type PositionDisplayProps = {
  x: number;
  y: number;
};

export function PositionDisplay({ x, y }: PositionDisplayProps) {
  return <span>{Math.round(x)}, {Math.round(y)}</span>;
}

