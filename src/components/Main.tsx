import { MeepleRoles } from "../types";
import { MeepleListItem } from "./MeepleListItem";
import { Detail } from "./Detail";
import { Link, useOutletContext } from "react-router-dom";
import { BackButton } from "./BackButton";
import { IconComponent } from "../utils/iconMap";
import { StateType } from "./StateType";
import type { Meeple } from "../Game/Meeple";

type MainProps = {
  selectedMeeple: Meeple | null;
  meepleId: string | null;
  hasStarted: boolean;
  meeples: Meeple[];
  setFilterBy: (role: MeepleRoles | null) => void;
  filterBy: MeepleRoles | null;
};
export const Main = () => {
  const {
    selectedMeeple,
    meepleId,
    hasStarted,
    meeples,
    setFilterBy,
    filterBy,
  } = useOutletContext<MainProps>();

  if (!selectedMeeple && meepleId && !hasStarted) {
    return (
      <div className="p-4">
        <BackButton />
        <div className="p-4">Meeple not found.</div>
        <Link to="/" className="btn btn-primary">
          Back to main page
        </Link>
      </div>
    );
  }

  // Detail view - when a meeple is selected
  if (selectedMeeple) {
    return (
      <div className="h-full flex flex-col w-xs">
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
        <div className="flex-1 overflow-y-auto">
          <Detail
            inventory={selectedMeeple.inventory}
            actionsHistory={selectedMeeple.actionsHistory}
            conditions={selectedMeeple.conditions}
            evaluateCondition={(condition) =>
              selectedMeeple.evaluateCondition(condition)
            }
          />
        </div>
      </div>
    );
  }

  // List view - when no meeple is selected
  return (
    <div className="h-full flex flex-col w-full">
      <select
        defaultValue={filterBy || "Pick a Role"}
        className="select select-info"
        onChange={(e) =>
          setFilterBy(
            e.target.value === "" ? null : (e.target.value as MeepleRoles)
          )
        }
      >
        <option disabled={true}>Pick a Role</option>
        <option value="">All</option>
        {Object.values(MeepleRoles).map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
      <ul className="list bg-base-100 rounded-box shadow-md w-xs h-full overflow-y-auto">
        {meeples
          .filter((meeple) => {
            if (filterBy) {
              return meeple.roleId === filterBy;
            }
            return true;
          })
          .map((meeple) => (
            <MeepleListItem key={meeple.id} meeple={meeple} />
          ))}
      </ul>
    </div>
  );
};
