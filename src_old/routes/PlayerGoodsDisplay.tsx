import { cloneElement, isValidElement, useMemo } from "react";
import { getGoodIcon, getGoodLabel, getGoodMetadata } from "../utils/goodsMetadata";
import { MeepleStats, Resources, type GoodType } from "../entities/types";
import { useGame } from "../hooks/useGame";

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

export function PlayerGoodsDisplay() {
  const { players } = useGame();

  const compactGoodsEntries = useMemo(
    () =>
      Object.entries(players.goods).filter(
        ([key, quantity]) =>
          quantity !== undefined &&
          quantity > 0 &&
          key !== MeepleStats.Health &&
          key !== MeepleStats.Energy
      ),
    [players.goods]
  );

  if (compactGoodsEntries.length === 0) {
    return (
      <div className="shrink-0">
        <div className="flex items-center gap-3 px-3 py-1.5 bg-base-200/50 rounded-lg border border-base-300 shadow-sm">
          <span className="text-xs font-semibold text-base-content/70 uppercase tracking-wide whitespace-nowrap">
            Player
          </span>
          <div className="h-4 w-px bg-base-300" />
          <span className="text-xs text-base-content/50 italic">No goods</span>
        </div>
      </div>
    );
  }

  return (
    <div className="shrink-0">
      <div className="flex items-center gap-3 px-3 py-1.5 bg-base-200/50 rounded-lg border border-base-300 shadow-sm">
        <span className="text-xs font-semibold text-base-content/70 uppercase tracking-wide whitespace-nowrap">
          Player
        </span>
        <div className="h-4 w-px bg-base-300" />
        <div className="flex items-center gap-1.5 flex-wrap">
          {compactGoodsEntries.map(([key, quantity]) => {
            const good = key as GoodType;
            const metadata = getGoodMetadata(good);
            const icon = getGoodIcon(good, 14);
            const label = metadata?.label || getGoodLabel(good);
            const badgeColor = getBadgeColor(good);

            const iconWithPointer = isValidElement(icon)
              ? cloneElement(icon as React.ReactElement<{ className?: string }>, {
                  className: `${(icon.props as { className?: string }).className ?? ""} cursor-pointer`.trim(),
                })
              : icon;

            return (
              <div key={key} className="tooltip tooltip-bottom">
                <div className="tooltip-content">
                  <div className="text-sm font-semibold text-base-content">
                    {label}: {quantity}
                  </div>
                </div>
                <div
                  className={`badge ${badgeColor} badge-sm gap-1 px-2 py-1 shadow-sm hover:shadow-md transition-all duration-200 flex items-center`}
                >
                  {iconWithPointer}
                  <span className="font-semibold text-xs">{quantity}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

