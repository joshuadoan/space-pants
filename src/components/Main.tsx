import { useGame } from "../Game/useGame";
import { MeepleRoles } from "../types";
import { MeepleListItem } from "./MeepleListItem";

export const Main = () => {
  const { hasStarted, meeples, setFilterBy, filterBy } = useGame();

  if (!hasStarted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full flex flex-col w-full">
      <select
        defaultValue={filterBy || "Pick a Framework"}
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
          .filter((meeple) => (filterBy ? meeple.roleId === filterBy : true))
          .map((meeple) => (
            <MeepleListItem key={meeple.id} meeple={meeple} />
          ))}
      </ul>
    </div>
  );
};
