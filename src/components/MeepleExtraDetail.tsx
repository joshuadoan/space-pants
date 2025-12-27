import type {
  CurrencyType,
  MiningType,
  ProductType,
  VitalsType,
  Instruction,
} from "../entities/types";
import type { Stats, Inventory } from "../entities/Meeple";
import { evaluateCondition } from "../utils/evaluateCondition";
import { IconComponent } from "../utils/iconMap";
import cx from "classnames";

export const MeepleExtraDetail = ({
  stats,
  inventory,
  instructions,
}: {
  stats: Stats;
  inventory: Inventory;
  instructions: Instruction[];
}) => {
  return (
    <div>
      <MeepleExtraDetails>
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

        {instructions.map((instruction) => (
          <MeepleExtraDetailsCard key={instruction.id}>
            <MeepleExtraDetailCardInstructions>
              {instruction.conditions.map((condition, conditionIndex) => {
                const isMet = evaluateCondition(
                  condition,
                  inventory
                );
                return (
                  <MeepleExtraDetailCardInstruction
                    key={conditionIndex}
                    isMet={isMet}
                  >
                    <span className="text-sm text-base-content flex-1">
                      <span className="text-base-content/70">if</span>{" "}
                      <span className="font-medium">{condition.good}</span>{" "}
                      <span className="text-base-content/70">
                        {condition.operator}
                      </span>{" "}
                      <span className="font-semibold text-primary">
                        {condition.value}
                      </span>{" "}
                      <span className="text-base-content/70">then</span>{" "}
                      <span className="text-base-content/70">
                        {instruction.name}
                      </span>
                    </span>
                  </MeepleExtraDetailCardInstruction>
                );
              })}
            </MeepleExtraDetailCardInstructions>
          </MeepleExtraDetailsCard>
        ))}
      </MeepleExtraDetails>
    </div>
  );
};

export const MeepleExtraDetails = ({
  children,
}: {
  children: React.ReactNode;
}) => <div className="flex flex-col gap-4">{children}</div>;

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
