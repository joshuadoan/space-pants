import { useGame } from "../Game/useGame";
import { MeepleInventoryItem, MeepleRoles } from "../types";
import { IconComponent } from "../utils/iconMap";

export const Counts = () => {
  const { meeples } = useGame();

  // total counts for roles, inventory
  const counts = {
    ...Object.fromEntries(
      Object.values(MeepleRoles).map((role) => [
        role,
        meeples.filter((meeple) => meeple.roleId === role).length,
      ])
    ),
    ...Object.fromEntries(
      Object.values(MeepleInventoryItem).map((item) => [
        item,
        meeples.reduce(
          (acc, meeple) => acc + meeple.inventory[item],
          0
        ),
      ])
    ),
  };

  const roleEntries = Object.entries(counts).filter(([key]) =>
    Object.values(MeepleRoles).includes(key as MeepleRoles)
  ) as [MeepleRoles, number][];

  const inventoryEntries = Object.entries(counts).filter(([key]) =>
    Object.values(MeepleInventoryItem).includes(key as MeepleInventoryItem)
  ) as [MeepleInventoryItem, number][];

  return (
    <div className="flex flex-col gap-1 border border-secondary rounded-lg p-2">
      {/* Roles Section */}
      <div className="flex items-center gap-1.5">
        {roleEntries.map(([key, value]) => (
          <div
            key={key}
            className="flex items-center gap-1.5 px-2 py-1 bg-base-200 rounded-lg"
          >
            <IconComponent icon={key} size={18} title={key} />
            <span className="text-sm font-semibold min-w-6 text-right">
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Inventory Section */}
      <div className="flex items-center gap-3">
        {inventoryEntries.map(([key, value]) => (
          <div
            key={key}
            className="flex items-center gap-1.5 px-2 py-1 bg-base-200 rounded-lg"
          >
            <IconComponent icon={key} size={18} title={key} />
            <span className="text-sm font-semibold min-w-6 text-right">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
