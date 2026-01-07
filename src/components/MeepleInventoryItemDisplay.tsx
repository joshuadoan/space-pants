import { IconComponent } from "../utils/iconMap";
import type { MeepleInventoryItem } from "../types";

export const MeepleInventoryItemDisplay = ({
  item,
}: {
  item: MeepleInventoryItem;
}) => {
  return (
    <div className="flex items-center gap-2">
      <IconComponent icon={item} size={16} />
      <span className="text-sm capitalize">{item}</span>
    </div>
  );
};

