import type { Goods, GoodType } from "../types";
import { Resources } from "../types";
import { getGoodMetadata, getGoodEmoji, getGoodLabel } from "../utils/goodsMetadata";

type GoodsDisplayProps = {
  goods: Partial<Goods>;
};

function getBadgeColor(good: GoodType): string {
  if (good === Resources.Money) {
    return "badge-success";
  }
  if (good === Resources.Ore) {
    return "badge-secondary";
  }
  // Products
  return "badge-primary";
}

export function GoodsDisplay({ goods }: GoodsDisplayProps) {
  const goodsEntries = Object.entries(goods).filter(
    ([_, quantity]) => quantity !== undefined && quantity > 0
  );

  if (goodsEntries.length === 0) {
    return (
      <div className="text-base-content/50 text-sm italic flex items-center gap-1">
        <span>📭</span>
        <span>No goods</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {goodsEntries.map(([key, quantity]) => {
        const good = key as GoodType;
        const metadata = getGoodMetadata(good);
        const emoji = metadata?.emoji || getGoodEmoji(good);
        const label = metadata?.label || getGoodLabel(good);
        const badgeColor = getBadgeColor(good);
        
        return (
          <div
            key={key}
            className={`badge ${badgeColor} badge-lg gap-1.5 px-3 py-2.5 shadow-sm hover:shadow-md transition-all duration-200`}
            title={`${label}: ${quantity}`}
          >
            <span className="text-base">{emoji}</span>
            <span className="font-semibold">{quantity}</span>
        
          </div>
        );
      })}
    </div>
  );
}
