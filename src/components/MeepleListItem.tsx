import { Link } from "react-router-dom";
import { IconComponent } from "../utils/iconMap";
import type { Meeple } from "../Game/Meeple";

export const MeepleListItem = ({ meeple }: { meeple: Meeple }) => {
  return (
    <li className="list-row">
      <div>
        <IconComponent icon={meeple.roleId} />
      </div>
      <div>
        <Link to={`/${meeple.id}`} className="link link-hover">
          {meeple.name}
        </Link>
        <div className="flex items-center gap-1 text-xs uppercase font-semibold opacity-60">
          <IconComponent icon={meeple.roleId} size={12} />
          {meeple.roleId}{" "}
          <IconComponent icon={meeple.state.type} size={12} />{" "}
          {meeple.state.type}
        </div>
        <div className="text-xs uppercase font-semibold opacity-60 flex items-center gap-1">
          <IconComponent icon="position" size={12} />
          {meeple.pos.x.toFixed(2)}, {meeple.pos.y.toFixed(2)}
        </div>
      </div>
    </li>
  );
};

