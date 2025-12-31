import { Link } from "react-router-dom";
import {
  type Inventory,
  type MeepleState,
  type Stats,
} from "../entities/Meeple";
import { IconComponent } from "../utils/iconMap";
import type { RoleId } from "../entities/types";
import { IconPlayerPause, IconRoute } from "@tabler/icons-react";
import { IconArrowsExchange } from "@tabler/icons-react";
import cx from "classnames";

export const MeepleDetails = (props: {
  className?: string;
  name: string;
  roleId: RoleId;
  state: MeepleState;
  stats: Stats;
  inventory: Inventory;
  id: number;
  isSelected: boolean;
}) => {
  const { className, id, isSelected, ...meeple } = props;
  return (
    <MeepleDetail className={className}>
      <Link
        className="cursor-pointer hover:text-primary underline"
        to={`/meeple/${id}`}
      >
        {meeple.name}
      </Link>
      <MeepleRoleBadge roleId={meeple.roleId} />
      <MeepleStateBadge state={meeple.state} />
    </MeepleDetail>
  );
};

export const MeepleDetail = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cx("flex flex-col gap-2 p-3 border border-gray-300 rounded-md mb-2", className)}>
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
    {state.name === "idle" && (
      <div className="badge badge-lg gap-1.5 bg-info/20 text-info border-info/30">
        <IconPlayerPause size={14} />
        <span className="font-semibold capitalize">{state.name}</span>
      </div>
    )}
    {state.name === "traveling" && (
      <div className="badge badge-lg gap-1.5 bg-warning/20 text-warning border-warning/30">
        <IconRoute size={14} />
        <span className="font-semibold capitalize">{state.name}</span>
        <span className="text-warning/70 text-xs">→ {state.target.name}</span>
      </div>
    )}
    {state.name === "visiting" && (
      <div className="badge badge-lg gap-1.5 bg-success/20 text-success border-success/30">
        <IconArrowsExchange size={14} />
        <span className="font-semibold capitalize">{state.name}</span>
        <span className="text-success/70 text-xs">
          Visiting with {state.target.name}
        </span>
      </div>
    )}
    {state.name === "transacting" && (
      <div className="badge badge-lg gap-1.5 bg-base-200 text-base-content border-base-content/30">
        <IconArrowsExchange size={14} />
        <span className="font-semibold capitalize">{state.name}</span>
        <span className="text-base-content/70 text-xs">
          Transacting {state.transactionType} {state.quantity} {state.good}
        </span>
      </div>
    )}
  </div>
);
