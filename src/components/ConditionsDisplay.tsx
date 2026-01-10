import type { Condition } from "../types";

export const ConditionsDisplay = ({
  condition,
  isMet,
}: {
  condition: Condition;
  isMet: boolean;
}) => {
  console.log('condition', condition, isMet);
  return (
    <div
      key={condition.description}
      className={`p-3 bg-base-200 rounded-lg border-l-4 flex items-center gap-2 ${
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
    </div>
  );
};
