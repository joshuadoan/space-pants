import { Link } from "react-router-dom";
import { IconComponent } from "../utils/iconMap";
import { StateType } from "./StateType";
import type { Meeple } from "../Game/Meeple";

type MeepleInfoProps = {
  selectedMeeple: Meeple;
};

export const MeepleInfo = ({ selectedMeeple }: MeepleInfoProps) => {
  return (
    <div className="p-4 border-b">
      <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 justify-between">
        <Link to={`/${selectedMeeple.id}`} className="link link-hover">
          {selectedMeeple.name}
        </Link>
        <Link
          to="/"
          className="link link-hover flex items-center gap-1 text-sm"
        >
          <IconComponent icon="arrow-left" title="Back" />
        </Link>
      </h2>
      <div className="flex items-center gap-2 text-sm uppercase font-semibold opacity-60 mb-2">
        <IconComponent
          icon={selectedMeeple.roleId}
          size={16}
          title={selectedMeeple.roleId}
        />
        {selectedMeeple.roleId}
      </div>
      <StateType state={selectedMeeple.state} />
      <div className="text-xs uppercase font-semibold opacity-60 flex items-center gap-1 mt-2">
        <IconComponent icon="position" size={12} title="Position" />
        {selectedMeeple.pos.x.toFixed(2)}, {selectedMeeple.pos.y.toFixed(2)}
      </div>
    </div>
  );
};
