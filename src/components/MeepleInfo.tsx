import { Link } from "react-router-dom";
import { IconComponent } from "../utils/iconMap";
import { StateType } from "./StateType";
import { MeepleRoles, MeepleStateNames } from "../types";

type MeepleInfoProps = {
  roleId: MeepleRoles;
  name: string;
  stateType: MeepleStateNames;
  pos: {
    x: number;
    y: number;
  }
  id: string;
};

export const MeepleInfo = ({ 
  roleId,
  name,
  stateType,
  pos,
  id,
 }: MeepleInfoProps) => {
  return (
    <div className="p-4 border-b">
      <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 justify-between">
        <Link to={`/${id}`} className="link link-hover">
          {name}
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
          icon={roleId}
          size={16}
          title={roleId}
        />
        {roleId}
      </div>
      <StateType stateType={stateType} />
      <div className="text-xs uppercase font-semibold opacity-60 flex items-center gap-1 mt-2">
        <IconComponent icon="position" size={12} title="Position" />
        {pos.x.toFixed(2)}, {pos.y.toFixed(2)}
      </div>
    </div>
  );
};
