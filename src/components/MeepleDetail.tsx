import { Link } from "react-router-dom";
import {
  MeepleStateType,
  type CurrencyType,
  type Inventory,
  type MeepleState,
  type MiningType,
  type ProductType,
  type Stats,
  type VitalsType,
} from "../entities/Meeple";
import { IconComponent } from "../utils/iconMap";
import { evaluateCondition } from "../utils/evaluateCondition";
import type { Instruction, RoleId } from "../entities/types";
import { IconPlayerPause, IconRoute } from "@tabler/icons-react";
import { IconArrowsExchange } from "@tabler/icons-react";
import cx from "classnames";

export const MeepleDetails = (props: {
  name: string;
  roleId: RoleId;
  state: MeepleState;
  stats: Stats;
  inventory: Inventory;
  instructions: Instruction[];
  id: number;
  isSelected: boolean;
  style: React.CSSProperties;
}) => {
  const { id, isSelected, style, ...meeple } = props;
  return (
    <MeepleDetail style={style}>
      <Link
        className="cursor-pointer hover:text-primary underline"
        to={`/meeple/${id}`}
      >
        {meeple.name}
      </Link>
      <MeepleRoleBadge roleId={meeple.roleId} />
      <MeepleStateBadge state={meeple.state} />
      {isSelected && (
        <MeepleExtraDetails>
          <MeepleExtraDetailsCard>
            <MeepleExtraDetailCardTitle>Stats</MeepleExtraDetailCardTitle>
            <MeepleExtraDetailCardItemList>
              {Object.entries(meeple.stats).map(([key, value]) => {
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
              {Object.entries(meeple.inventory).map(([key, value]) => {
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

          {meeple.instructions.map((instruction) => (
            <MeepleExtraDetailsCard key={instruction.id}>
              <MeepleExtraDetailCardInstructions>
                {instruction.conditions.map((condition, conditionIndex) => {
                  const isMet = evaluateCondition(
                    condition,
                    condition.target?.inventory
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
                        <span className="text-base-content/70">targeting</span>{" "}
                        <span className="font-medium text-secondary">
                          {condition.target.name}
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
      )}
    </MeepleDetail>
  );
};

export const MeepleDetail = ({ children, style }: { children: React.ReactNode, style: React.CSSProperties }) => (
  <div className="flex flex-col gap-2 p-3 border border-gray-300 rounded-md mb-2" style={style}>
    {children}
  </div>
);

export const MeepleRoleBadge = ({ roleId }: { roleId: RoleId }) => (
  <div className="flex items-center gap-1.5 text-sm text-base-content/70">
    <IconComponent icon={roleId} size={14} />
    <span>{roleId}</span>
  </div>
);

export const MeepleStateBadge = ({ state }: { state: MeepleState }) => (
  <div className="flex items-center gap-2 mb-2">
    {state.type === MeepleStateType.Idle && (
      <div className="badge badge-lg gap-1.5 bg-info/20 text-info border-info/30">
        <IconPlayerPause size={14} />
        <span className="font-semibold capitalize">{state.type}</span>
        {state.target && (
          <span className="text-info/70 text-xs">→ {state.target.name}</span>
        )}
      </div>
    )}
    {state.type === MeepleStateType.Traveling && (
      <div className="badge badge-lg gap-1.5 bg-warning/20 text-warning border-warning/30">
        <IconRoute size={14} />
        <span className="font-semibold capitalize">{state.type}</span>
        <span className="text-warning/70 text-xs">→ {state.target.name}</span>
      </div>
    )}
    {state.type === MeepleStateType.Transacting && (
      <div className="badge badge-lg gap-1.5 bg-success/20 text-success border-success/30">
        <IconArrowsExchange size={14} />
        <span className="font-semibold capitalize">{state.type}</span>
        <span className="text-success/70 text-xs">
          {state.transactionType === "add" ? "+" : "-"}
          {state.quantity} {state.good} with {state.target.name}
        </span>
      </div>
    )}
  </div>
);

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
