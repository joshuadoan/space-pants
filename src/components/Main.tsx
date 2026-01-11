import { MeepleRoles } from "../types";
import { MeepleListItem } from "./MeepleListItem";
import { useOutletContext } from "react-router-dom";
import type { Meeple } from "../Game/Meeple";

type MainProps = {
  meeples: Meeple[];
  setFilterBy: (role: MeepleRoles | null) => void;
  filterBy: MeepleRoles | null;
};
export const Main = () => {
  const {
    meeples,
    setFilterBy,
    filterBy,
  } = useOutletContext<MainProps>();

  // List view - when no meeple is selected
  return (
    <div className="flex flex-col w-full h-full min-h-0">
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
      <ul className="list bg-base-100 rounded-box shadow-md w-xs overflow-y-auto flex-1">
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
