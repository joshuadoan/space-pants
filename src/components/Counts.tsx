import { useGame } from "../Game/useGame";
import { MeepleInventoryItem, MeepleRoles } from "../types";
import { IconComponent } from "../utils/iconMap";

export const Counts = () => {
  const { meeples } = useGame();

  type Counts = {
    [key in MeepleRoles | MeepleInventoryItem]: number;
  };
  // total counts for roles, inventory
  const counts = meeples.reduce(
    (acc: Counts, meeple) => {
      return {
        ...acc,
        [meeple.roleId]: (acc[meeple.roleId] || 0) + 1,
        [MeepleInventoryItem.Minirals]:
          (acc[MeepleInventoryItem.Minirals] || 0) + meeple.inventory[MeepleInventoryItem.Minirals],
        [MeepleInventoryItem.Money]:
          (acc[MeepleInventoryItem.Money] || 0) + meeple.inventory[MeepleInventoryItem.Money],
        [MeepleInventoryItem.Fizzy]:
          (acc[MeepleInventoryItem.Fizzy] || 0) + meeple.inventory[MeepleInventoryItem.Fizzy],
      };
    },
    {
      [MeepleRoles.Miner]: 0,
      [MeepleRoles.Asteroid]: 0,
      [MeepleRoles.SpaceStore]: 0,
      [MeepleRoles.SpaceBar]: 0,
      [MeepleRoles.SpaceApartment]: 0,
      [MeepleRoles.Bartender]: 0,
      [MeepleInventoryItem.Minirals]: 0,
      [MeepleInventoryItem.Money]: 0,
      [MeepleInventoryItem.Fizzy]: 0,
    }
  );

  const roleEntries = Object.entries(counts).filter(([key]) =>
    Object.values(MeepleRoles).includes(key as MeepleRoles)
  ) as [MeepleRoles, number][];

  const inventoryEntries = Object.entries(counts).filter(([key]) =>
    Object.values(MeepleInventoryItem).includes(key as MeepleInventoryItem)
  ) as [MeepleInventoryItem, number][];

  console.log("inventoryEntries", inventoryEntries);

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
