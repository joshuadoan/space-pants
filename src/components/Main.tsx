import { useGame } from "../Game/useGame";
import { RoleFilter } from "./RoleFilter";
import { MeepleListItem } from "./MeepleListItem";

export const Main = () => {
  const { hasStarted, meeples, setFilterbyRole, filterbyRole } = useGame();

  if (!hasStarted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full flex flex-col w-full">
      <header className="p-4">
        <h1 className="text-2xl font-bold">space-pants</h1>
        <p className="text-sm text-gray-500">
          A game about trading and mining in space
        </p>
      </header>
      <RoleFilter filterbyRole={filterbyRole} setFilterbyRole={setFilterbyRole} />
      <ul className="list bg-base-100 rounded-box shadow-md w-xs h-full overflow-y-auto">
        {meeples
          .filter((meeple) => {
            const hasAnyFilter = Object.values(filterbyRole).some(Boolean);
            return hasAnyFilter ? filterbyRole[meeple.roleId] : true;
          })
          .map((meeple) => (
            <MeepleListItem key={meeple.id} meeple={meeple} />
          ))}
      </ul>
    </div>
  );
};

