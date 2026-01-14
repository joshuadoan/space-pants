import { MeepleInventoryItem, MeepleRoles } from "../types";
import { IconComponent } from "../utils/iconMap";

export const Counts = ({
  roleEntries,
  inventoryEntries,
}: {
  roleEntries: [MeepleRoles, number][];
  inventoryEntries: [MeepleInventoryItem, number][];
}) => {

  return (
    <div className="flex flex-col gap-1 rounded-lg p-2">
      {/* Roles Section */}
      <div className="flex items-center gap-2">
        {roleEntries.map(([key, value]) => (
          <div
            key={key}
            className="flex items-center gap-0.5 py-1 bg-base-200 rounded-lg"
          >
            <IconComponent icon={key} size={18} title={key} />
            <span className="text-sm font-semibold min-w-6 text-right">
              {value}
            </span>
          </div>
        ))}
        {inventoryEntries.map(([key, value]) => (
          <div
            key={key}
            className="flex items-center gap-0.5 py-1 bg-base-200 rounded-lg"
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
