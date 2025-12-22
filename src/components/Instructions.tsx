import type { Inventory, Meeple, MeepleStateType } from "../entities/Meeple";
import type { Instruction } from "../entities/types";
import { evaluateCondition } from "../utils/evaluateCondition";

export function Instructions({ meeple }: { meeple: Meeple }) {
  if (meeple.instructions.length === 0) {
    return (
      <div className="text-sm text-base-content/50 italic p-2">
        No instructions
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 mt-2">
      <h3 className="text-sm font-semibold text-base-content">Instructions </h3>
      {meeple.instructions.map((instruction) => (
        <div key={instruction.id} >
          <div>{instruction.name}</div>
          {instruction.conditions.map((condition, index) => (
            <div key={index} className="flex flex-col gap-2">
              <div>
                {condition.good} {condition.operator} {condition.value}{" "}
                {condition.target?.name === meeple.name
                  ? "self"
                  : condition.target?.name}
                {evaluateCondition(condition, condition.target?.inventory) ? "✅" : "❌"}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
