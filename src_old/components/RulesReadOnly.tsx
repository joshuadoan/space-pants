import type { LogicRule } from "../entities/types";
import { getGoodIcon } from "../utils/goodsMetadata";

export function RulesReadOnly({ rules, activeRuleId }: { rules: LogicRule[]; activeRuleId?: string | null }) {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-2">
        {rules.length === 0 ? (
          <div className="text-sm text-base-content/50 italic py-4 text-center">No rules configured</div>
        ) : (
          rules.map((rule, index) => (
            <div
              key={index}
              className={`rounded-lg p-3 border-l-4 transition-colors shadow-sm ${
                activeRuleId === rule.id
                  ? "bg-primary/20 border-primary shadow-md hover:bg-primary/25"
                  : "bg-base-200/70 border-secondary/50 hover:bg-base-200"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2 text-sm">
                {/* IF badge */}
                <span className="badge badge-primary badge-sm font-semibold px-2.5 py-1">
                  IF
                </span>
                
                {/* Condition */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="badge badge-outline badge-sm px-2 py-1 flex items-center gap-1.5">
                    {rule.good ? getGoodIcon(rule.good, 14) : null}
                    <span className="font-medium">{rule.good || "—"}</span>
                  </span>
                  <span className="text-sm font-mono text-primary font-semibold px-1">
                    {rule.operator || "—"}
                  </span>
                  <span className="badge badge-outline badge-sm px-2 py-1 font-medium">
                    {rule.value ?? "—"}
                  </span>
                </div>
                
                {/* Arrow */}
                <span className="text-base text-primary mx-1 font-semibold">→</span>
                
                {/* THEN badge */}
                <span className="badge badge-secondary badge-sm font-semibold px-2.5 py-1">
                  THEN
                </span>
                
                {/* Action */}
                <span className="badge badge-accent badge-sm px-2.5 py-1 font-medium">
                  {rule.action || "—"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

