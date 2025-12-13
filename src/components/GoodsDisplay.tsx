import type { Goods, GoodType } from "../entities/types";
import { Resources } from "../entities/types";
import { getGoodMetadata, getGoodIcon, getGoodLabel } from "../utils/goodsMetadata";
import { IconMailOff } from "@tabler/icons-react";
import { cloneElement } from "react";

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
  if (good === Resources.Treasure) {
    return "badge-warning";
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
        <IconMailOff size={16} className="cursor-pointer" />
        <span>No goods</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {goodsEntries.map(([key, quantity]) => {
        const good = key as GoodType;
        const metadata = getGoodMetadata(good);
        const icon = getGoodIcon(good, 18);
        const label = metadata?.label || getGoodLabel(good);
        const badgeColor = getBadgeColor(good);
        const iconWithPointer = cloneElement(icon, {
          className: `${icon.props.className || ""} cursor-pointer`.trim(),
        });
        
        return (
          <div key={key} className="tooltip">
            <div className="tooltip-content">
              <div className="text-sm font-semibold text-base-content">
                {label}: {quantity}
              </div>
            </div>
            <div
              className={`badge ${badgeColor} badge-lg gap-1.5 px-3 py-2.5 shadow-sm hover:shadow-md transition-all duration-200 flex items-center`}
            >
              {iconWithPointer}
              <span className="font-semibold">{quantity}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
