import { useState } from "react";
import type { LogicRule } from "../entities/types";

export function RulesReadOnly({ rules }: { rules: LogicRule[] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full">
      <button
        className="btn btn-primary mb-2 w-full sm:w-auto sm:self-end"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? "Collapse Rules" : "Expand Rules"}
      </button>
      {isExpanded && (
        <div className="flex flex-col gap-4">
          {rules.length === 0 ? (
            <div className="text-sm text-base-content/70">No rules configured</div>
          ) : (
            rules.map((rule, index) => (
            <div
              key={index}
              className="card bg-base-200 shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="card-body p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <div className="text-xs text-base-content/70 mb-1">Good</div>
                    <div className="text-sm">{rule.good || "—"}</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-base-content/70 mb-1">Operator</div>
                    <div className="text-sm font-mono">{rule.operator || "—"}</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-base-content/70 mb-1">Value</div>
                    <div className="text-sm">{rule.value ?? "—"}</div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-3">
                  <div className="flex-1">
                    <div className="text-xs text-base-content/70 mb-1">Action</div>
                    <div className="text-sm">{rule.action || "—"}</div>
                  </div>
                </div>
              </div>
            </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

