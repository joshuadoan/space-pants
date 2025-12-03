import { useRef, useState } from "react";
import {
  ComparisonOperator,
  LogicRuleActionType,
  type LogicRule,
} from "../entities/types";
import { Resources } from "../types";

export function Rules({
  rules,
  onUpdateRules,
}: {
  rules: LogicRule[];
  onUpdateRules: (rules: LogicRule[]) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [localRules, setLocalRules] = useState<LogicRule[]>(rules);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onUpdateRules(localRules);
  };

  const handleOperatorChange = (ruleId: string, operator: ComparisonOperator) => {
    setLocalRules((prevRules) =>
      prevRules.map((rule) =>
        rule.id === ruleId ? { ...rule, operator } : rule
      )
    );
  };

  const handleGoodChange = (ruleId: string, good: string) => {
    setLocalRules((prevRules) =>
      prevRules.map((rule) =>
        rule.id === ruleId ? { ...rule, good: good as typeof rule.good } : rule
      )
    );
  };

  const handleValueChange = (ruleId: string, value: number) => {
    setLocalRules((prevRules) =>
      prevRules.map((rule) =>
        rule.id === ruleId ? { ...rule, value } : rule
      )
    );
  };

  const handleActionChange = (ruleId: string, action: LogicRuleActionType) => {
    setLocalRules((prevRules) =>
      prevRules.map((rule) =>
        rule.id === ruleId ? { ...rule, action } : rule
      )
    );
  };

  return (
    <div className="w-full">
      <button
        className="btn btn-primary mb-2 w-full sm:w-auto sm:self-end"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? "Collapse Rules" : "Expand Rules"}
      </button>
      {isExpanded && (
        <form
          onSubmit={handleSubmit}
          ref={formRef}
          className="flex flex-col gap-4"
        >
          {localRules.map((rule) => (
            <div
              key={rule.id}
              className="card bg-base-200 shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="card-body p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <label className="label py-1">
                      <span className="label-text text-xs text-base-content/70">
                        Good
                      </span>
                    </label>
                    <select
                      value={rule.good || ""}
                      onChange={(e) =>
                        handleGoodChange(rule.id, e.target.value)
                      }
                      className="select select-primary select-bordered w-full"
                    >
                      <option disabled={true} value="">
                        Pick a good
                      </option>
                      {Object.values(Resources).map((good) => (
                        <option key={good} value={good}>
                          {good}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="label py-1">
                      <span className="label-text text-xs text-base-content/70">
                        Operator
                      </span>
                    </label>
                    <select
                      value={rule.operator || ""}
                      onChange={(e) =>
                        handleOperatorChange(
                          rule.id,
                          e.target.value as ComparisonOperator
                        )
                      }
                      className="select select-primary select-bordered w-full"
                    >
                      <option disabled={true} value="">
                        Pick an operator
                      </option>
                      {Object.values(ComparisonOperator).map((operator) => (
                        <option key={operator} value={operator}>
                          {operator}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="label py-1">
                      <span className="label-text text-xs text-base-content/70">
                        Value
                      </span>
                    </label>
                    <select
                      value={rule.value ?? ""}
                      onChange={(e) =>
                        handleValueChange(rule.id, Number(e.target.value))
                      }
                      className="select select-primary select-bordered w-full"
                    >
                      <option disabled={true} value="">
                        Pick a value
                      </option>
                      {[0, 10, 20, 30, 40, 50].map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <label className="label py-1">
                      <span className="label-text text-xs text-base-content/70">
                        Action
                      </span>
                    </label>
                    <select
                      value={rule.action || ""}
                      onChange={(e) =>
                        handleActionChange(
                          rule.id,
                          e.target.value as LogicRuleActionType
                        )
                      }
                      className="select select-primary select-bordered w-full"
                    >
                      <option disabled={true} value="">
                        Pick an action
                      </option>
                      {Object.values(LogicRuleActionType).map((action) => (
                        <option key={action} value={action}>
                          {action}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            type="submit"
            className="btn btn-primary mt-2 w-full sm:w-auto sm:self-end"
          >
            Save Rules
          </button>
        </form>
      )}
    </div>
  );
}
