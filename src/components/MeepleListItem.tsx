import { Link } from "react-router-dom";
import { IconComponent } from "../utils/iconMap";
import type { Meeple } from "../Game/Meeple";
import { StateType } from "./StateType";

export const MeepleListItem = ({ meeple }: { meeple: Meeple }) => {
  return (
    <li className="list-row">
      <div className="flex flex-col gap-1.5">
        <Link
          to={`/${meeple.id}`}
          className="link link-hover flex items-center gap-1"
        >
          {meeple.name}
        </Link>
        <div className="flex items-center gap-2 text-xs uppercase font-semibold opacity-60">
          <span className="flex items-center gap-1">
            <IconComponent icon={meeple.roleId} size={12} />
            {meeple.roleId}
          </span>
        </div>
        <StateType state={meeple.state} />
        <div className="text-xs uppercase font-semibold opacity-60 flex items-center gap-1">
          <IconComponent icon="position" size={12} />
          {meeple.pos.x.toFixed(2)}, {meeple.pos.y.toFixed(2)}
        </div>
      </div>
    </li>
  );
};
