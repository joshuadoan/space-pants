import type { Condition, Operator } from "../types";
import { ConditionType } from "../types";
import { MeepleInventoryItemDisplay } from "./MeepleInventoryItemDisplay";
import { IconComponent } from "../utils/iconMap";

const formatOperator = (operator: Operator): string => {
  switch (operator) {
    case "equal":
      return "=";
    case "not-equal":
      return "≠";
    case "less-than":
      return "<";
    case "greater-than":
      return ">";
    case "less-than-or-equal":
      return "≤";
    case "greater-than-or-equal":
      return "≥";
    default:
      return operator;
  }
};

export const ConditionsDisplay = ({
  condition,
  isMet,
}: {
  condition: Condition;
  isMet: boolean;
}) => {
  return (
    <div
      key={condition.description}
      className={`p-3 bg-base-200 rounded-lg border-l-4 flex flex-col gap-2 ${
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
      <div className="flex items-center gap-2 pl-4 text-xs opacity-60">
        {condition.type === ConditionType.Inventory ? (
          <MeepleInventoryItemDisplay item={condition.property} />
        ) : (
          <div className="flex items-center gap-2">
            <IconComponent icon={condition.role} size={16} title={condition.role} />
            <span className="text-sm capitalize">{condition.role.replace("-", " ")}</span>
          </div>
        )}
        <span className="font-mono">{formatOperator(condition.operator)}</span>
        <span className="font-mono">{condition.quantity}</span>
        {condition.target && (
          <span className="ml-1 opacity-50">
            ({condition.target.name || condition.target.roleId}'s {condition.type === ConditionType.Inventory ? "inventory" : "radar"})
          </span>
        )}
      </div>
    </div>
  );
};
