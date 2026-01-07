import { MeepleRoles } from "../types";

export const RoleFilter = ({
  filterbyRole,
  setFilterbyRole,
}: {
  filterbyRole: {
    [key in MeepleRoles]: boolean;
  };
  setFilterbyRole: (filters: {
    [key in MeepleRoles]: boolean;
  }) => void;
}) => {
  const hasAnyFilter = Object.values(filterbyRole).some(Boolean);

  return (
    <form className="filter">
      {hasAnyFilter && (
        <input
          className="btn btn-square"
          type="reset"
          value="×"
          onClick={() =>
            setFilterbyRole({
              [MeepleRoles.Miner]: false,
              [MeepleRoles.Asteroid]: false,
              [MeepleRoles.SpaceStore]: false,
            })
          }
        />
      )}
      {Object.values(MeepleRoles).map((role) => (
        <input
          key={role}
          className="btn"
          type="radio"
          name="roles"
          value={role}
          checked={filterbyRole[role]}
          onChange={() =>
            setFilterbyRole({ ...filterbyRole, [role]: !filterbyRole[role] })
          }
          aria-label={role}
        />
      ))}
    </form>
  );
};
