import type { LogicRule } from "../entities/types";
import { getGoodIcon } from "../utils/goodsMetadata";

export function RulesReadOnly({ rules, activeRuleId }: { rules: LogicRule[]; activeRuleId?: string | null }) {
  return (
    <div className="w-full">
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
    </div>
  );
}

