import { Link, useParams } from "react-router-dom";
import { IconComponent } from "../utils/iconMap";
import type { Meeple } from "../Game/Meeple";
import { StateType } from "./StateType";
import { MeepleInventoryItem } from "../types";

export const MeepleListItem = ({ meeple }: { meeple: Meeple }) => {
  const { meepleId } = useParams();
  const isSelected = meepleId === meeple.id.toString();
  return (
    <li className="list-row">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 py-2">
          {isSelected && (
            <Link to="/">
              <IconComponent icon="arrow-left" title="Back" size={16} />
            </Link>
          )}
          <Link
            to={`/${meeple.id}`}
            className="link link-hover flex items-center gap-1"
          >
            {meeple.name}
          </Link>
        </div>
        <div className="flex items-center gap-2 text-xs uppercase font-semibold opacity-60">
          <span className="flex items-center gap-1">
            <IconComponent
              icon={meeple.roleId}
              size={12}
              title={meeple.roleId}
            />
            {meeple.roleId}
          </span>
        </div>
        <StateType state={meeple.state} />
        <div className="text-xs uppercase font-semibold opacity-60 flex items-center gap-1">
          <IconComponent icon="position" size={12} title="Position" />
          {meeple.pos.x.toFixed(2)}, {meeple.pos.y.toFixed(2)}
        </div>
        <div className="text-xs uppercase font-semibold opacity-60 flex items-center gap-1">
          // Money: {meeple.inventory[MeepleInventoryItem.Money]}
        </div>
      </div>
    </li>
  );
};
