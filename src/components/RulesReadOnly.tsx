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
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {/* IF badge */}
                  <span className="badge badge-primary badge-lg font-semibold px-3 py-2">
                    IF
                  </span>
                  
                  {/* Condition */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="badge badge-outline badge-lg px-3 py-2">
                      {rule.good || "—"}
                    </span>
                    <span className="text-lg font-mono text-primary font-semibold">
                      {rule.operator || "—"}
                    </span>
                    <span className="badge badge-outline badge-lg px-3 py-2">
                      {rule.value ?? "—"}
                    </span>
                  </div>
                  
                  {/* Arrow */}
                  <span className="text-2xl text-primary mx-1">→</span>
                  
                  {/* THEN badge */}
                  <span className="badge badge-secondary badge-lg font-semibold px-3 py-2">
                    THEN
                  </span>
                  
                  {/* Action */}
                  <span className="badge badge-accent badge-lg px-3 py-2">
                    {rule.action || "—"}
                  </span>
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

