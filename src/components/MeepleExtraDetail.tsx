import type {
  CurrencyType,
  MiningType,
  ProductType,
  VitalsType,
} from "../entities/types";
import type { Stats, Inventory } from "../entities/Meeple";
import { IconComponent } from "../utils/iconMap";
import cx from "classnames";

export const MeepleExtraDetail = ({
  stats,
  inventory,
}: {
  stats: Stats;
  inventory: Inventory;
}) => {
  return (
    <div>
      <MeepleExtraDetails className="mb-4">
        <MeepleExtraDetailsCard>
          <MeepleExtraDetailCardTitle>Stats</MeepleExtraDetailCardTitle>
          <MeepleExtraDetailCardItemList>
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
          </MeepleExtraDetailCardItemList>
        </MeepleExtraDetailsCard>

        <MeepleExtraDetailsCard>
          <MeepleExtraDetailCardTitle>Inventory</MeepleExtraDetailCardTitle>
          <MeepleExtraDetailCardItemList>
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
          </MeepleExtraDetailCardItemList>
        </MeepleExtraDetailsCard>
      </MeepleExtraDetails>
    </div>
  );
};

export const MeepleExtraDetails = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={cx("flex flex-col gap-4", className)}>{children}</div>;

export const MeepleExtraDetailsCard = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div className="card card-compact bg-base-200 shadow-sm p-3">{children}</div>
);

export const MeepleExtraDetailCardTitle = ({
  children,
}: {
  children: React.ReactNode;
}) => <h4 className="card-title text-base text-primary">{children}</h4>;

export const MeepleExtraDetailCardItemList = ({
  children,
}: {
  children: React.ReactNode;
}) => <div className="flex flex-wrap gap-2 mt-2">{children}</div>;

export const MeepleExtraDetailCardItem = ({
  goodType,
  quantity,
}: {
  goodType: MiningType | ProductType | CurrencyType | VitalsType;
  quantity: number;
}) => (
  <div className="tooltip tooltip-top" data-tip={goodType}>
    <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-base-100">
      <IconComponent icon={goodType} size={16} className="text-secondary" />
      <span className="text-sm font-semibold text-secondary">{quantity}</span>
    </div>
  </div>
);

export const MeepleExtraDetailCardInstructions = ({
  children,
}: {
  children: React.ReactNode;
}) => <div className="flex flex-col gap-2 mt-2">{children}</div>;

export const MeepleExtraDetailCardInstruction = ({
  children,
  isMet,
}: {
  children: React.ReactNode;
  isMet: boolean;
}) => (
  <div
    className={cx("flex items-center gap-2 p-2 rounded-lg border", {
      "bg-success/10 border-success/30": isMet,
      "bg-error/10 border-error/30": !isMet,
    })}
  >
    {children}
  </div>
);
