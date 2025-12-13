import { useState } from "react";
import type { LogicRule } from "../entities/types";
import { getGoodIcon } from "../utils/goodsMetadata";
import { IconMoodSmile, IconChevronDown } from "@tabler/icons-react";

export function RulesReadOnly({ rules, activeRuleId }: { rules: LogicRule[]; activeRuleId?: string | null }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-2">
        <button
          className="btn btn-primary w-full sm:w-auto"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Collapse Rules" : "Expand Rules"}
        </button>
        {!isExpanded && (
          <div className="bg-base-200/50 rounded-lg px-3 py-2 flex items-center gap-2 text-xs text-base-content/80 flex-1">
            <IconMoodSmile size={16} className="text-primary shrink-0" />
            <span>
              Click to expand and view AI rules! <IconChevronDown size={14} className="inline text-primary" />
            </span>
          </div>
        )}
      </div>
      {isExpanded && (
        <div className="flex flex-col gap-1.5">
          {rules.length === 0 ? (
            <div className="text-sm text-base-content/70">No rules configured</div>
          ) : (
            rules.map((rule, index) => (
            <div
              key={index}
              className={`rounded-md px-2.5 py-1.5 transition-colors ${
                activeRuleId === rule.id
                  ? "bg-primary/20 border-2 border-primary shadow-md"
                  : "bg-base-200/70 hover:bg-base-200"
              }`}
            >
              <div className="flex flex-wrap items-center gap-1.5 text-base">
                {/* IF badge */}
                <span className="badge badge-primary badge-sm font-semibold px-2 py-0.5">
                  IF
                </span>
                
                {/* Condition */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="badge badge-outline badge-sm px-2 py-0.5 flex items-center gap-1">
                    {rule.good ? getGoodIcon(rule.good, 16) : null}
                    {rule.good || "—"}
                  </span>
                  <span className="text-base font-mono text-primary font-semibold">
                    {rule.operator || "—"}
                  </span>
                  <span className="badge badge-outline badge-sm px-2 py-0.5">
                    {rule.value ?? "—"}
                  </span>
                </div>
                
                {/* Arrow */}
                <span className="text-lg text-primary mx-0.5">→</span>
                
                {/* THEN badge */}
                <span className="badge badge-secondary badge-sm font-semibold px-2 py-0.5">
                  THEN
                </span>
                
                {/* Action */}
                <span className="badge badge-accent badge-sm px-2 py-0.5">
                  {rule.action || "—"}
                </span>
              </div>
            </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

