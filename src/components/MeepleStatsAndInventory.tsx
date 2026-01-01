import type { CurrencyType, MiningType, ProductType } from "../entities/types";
import { VitalsType } from "../entities/types";
import type { Stats, Inventory } from "../entities/Meeple";
import { IconComponent } from "../utils/iconMap";
import cx from "classnames";

export const MeepleStatsAndInventory = ({
  className,
  stats,
  inventory,
}: {
  className?: string;
  stats: Stats;
  inventory: Inventory;
}) => {
  return (
    <>
      <div className={cx("flex gap-2 items-center", className)}>
        {Object.entries(stats).map(([key, value]) => {
          const vitalsType = key as VitalsType;
          return (
            <MeepleExtraDetailCardItem
              key={vitalsType}
              goodType={vitalsType}
              quantity={value}
            />
          );
        })}
      </div>
      <div className={cx("flex gap-2 items-center", className)}>
        {Object.entries(inventory).map(([key, value]) => {
          const goodType = key as MiningType | ProductType | CurrencyType;
          return (
            <MeepleExtraDetailCardItem
              key={goodType}
              goodType={goodType}
              quantity={value}
            />
          );
        })}
      </div>
    </>
  );
};

export const MeepleExtraDetailCardItem = ({
  goodType,
  quantity,
}: {
  goodType: MiningType | ProductType | CurrencyType | VitalsType;
  quantity: number;
}) => (
  <div className="tooltip tooltip-top" data-tip={goodType}>
    <div className="flex items-center gap-1">
      <IconComponent icon={goodType} size={16} className="text-secondary" />
      <span className="text-sm font-semibold text-secondary">{quantity}</span>
    </div>
  </div>
);
