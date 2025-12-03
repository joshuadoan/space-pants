type MoneyDisplayProps = {
  amount: number;
};

export function MoneyDisplay({ amount }: MoneyDisplayProps) {
  return <span>💰 ${amount}</span>;
}

type OreDisplayProps = {
  current: number;
  max: number;
  showLabel?: boolean;
};

export function OreDisplay({ current, max, showLabel = true }: OreDisplayProps) {
  const content = `⛏️ ${current}/${max}${showLabel ? " ore" : ""}`;
  return <span>{content}</span>;
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

