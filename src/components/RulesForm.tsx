import { useRef, useState } from "react";
import {
  ComparisonOperator,
  LogicRuleActionType,
  type LogicRule,
} from "../entities/types";
import { Resources } from "../types";
import { TRADER_RULES, MINER_RULES } from "../entities/ruleTemplates";

const RULE_TEMPLATES = {
  "": "Select a template...",
  trader: "Trader",
  miner: "Miner",
} as const;

const TEMPLATE_MAP: Record<string, LogicRule[]> = {
  trader: TRADER_RULES,
  miner: MINER_RULES,
};

export function RulesForm({
  rules,
  onUpdateRules,
}: {
  rules: LogicRule[];
  onUpdateRules: (rules: LogicRule[]) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [localRules, setLocalRules] = useState<LogicRule[]>(rules);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

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

  const handleTemplateChange = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    if (templateKey && TEMPLATE_MAP[templateKey]) {
      setLocalRules(TEMPLATE_MAP[templateKey]);
    }
  };

  const handleDeleteRule = (ruleId: string) => {
    setLocalRules((prevRules) => prevRules.filter((rule) => rule.id !== ruleId));
  };

  const handleAddRule = () => {
    // Generate a random ID using crypto.randomUUID if available, otherwise fallback to random string
    const randomId = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}`;
    
    const newRule: LogicRule = {
      id: randomId,
      good: Resources.Money,
      operator: ComparisonOperator.Equal,
      value: 0,
      action: LogicRuleActionType.Socialize,
    };
    setLocalRules((prevRules) => [...prevRules, newRule]);
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
          <div className="w-full">
            <label className="label py-1">
              <span className="label-text text-xs text-base-content/70">
                Rule Template
              </span>
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="select select-primary select-bordered w-full"
            >
              {Object.entries(RULE_TEMPLATES).map(([key, label]) => (
                <option key={key} value={key} disabled={key === ""}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          {localRules.map((rule, index) => (
            <div
              key={index}
              className="card bg-base-200 shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="card-body p-4">
                <div className="flex justify-end items-start mb-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDeleteRule(rule.id)}
                    className="btn btn-sm btn-error btn-outline"
                    aria-label={`Delete rule`}
                  >
                    Delete
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-3">
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
          <div className="flex flex-col sm:flex-row gap-2 justify-end mt-2">
            <button
              type="button"
              onClick={handleAddRule}
              className="btn btn-secondary w-full sm:w-auto"
            >
              Add New Rule
            </button>
            <button
              type="submit"
              className="btn btn-primary w-full sm:w-auto"
            >
              Save Rules
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
