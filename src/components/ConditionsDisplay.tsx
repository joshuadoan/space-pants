import { IconComponent } from "../utils/iconMap";
import type { Condition } from "../types";
import type { Meeple } from "../Game/Meeple";

export const ConditionsDisplay = ({
  conditions,
  meeple,
}: {
  conditions: Condition[];
  meeple: Meeple;
}) => {
  return (
    <div className="space-y-2">
      {conditions.map((condition) => {
        const isMet = meeple.evaluateCondition(condition);
        return (
          <div
            key={condition.description}
            className={`p-3 bg-base-200 rounded-lg border-l-4 ${
              isMet ? "border-green-400" : "border-gray-400"
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isMet ? "bg-green-400" : "bg-gray-400"
                }`}
              />
              <span className={`text-sm ${isMet ? "font-medium" : "opacity-70"}`}>
                {condition.description}
              </span>
            </div>
            {condition.type === "inventory" && (
              <div className="flex items-center gap-2 text-xs opacity-60 mt-1 ml-4">
                <IconComponent icon={condition.property} size={14} />
                <span>
                  {meeple.inventory[condition.property]} {condition.operator}{" "}
                  {condition.quantity}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

