import { useRef, useState } from "react";
import {
  ComparisonOperator,
  LogicRuleActionType,
  type LogicRule,
} from "../entities/types";
import { Resources } from "../types";
import { TRADER_RULES, MINER_RULES } from "../entities/ruleTemplates";
import { useToast } from "./Toast";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const RULE_TEMPLATES = {
  "": "Select a template...",
  trader: "Trader",
  miner: "Miner",
} as const;

const TEMPLATE_MAP: Record<string, LogicRule[]> = {
  trader: TRADER_RULES,
  miner: MINER_RULES,
};

const DRAG_TYPE = "RULE";

interface DraggableRuleItemProps {
  rule: LogicRule;
  index: number;
  onMoveRule: (dragIndex: number, hoverIndex: number) => void;
  onOperatorChange: (ruleId: string, operator: ComparisonOperator) => void;
  onGoodChange: (ruleId: string, good: string) => void;
  onValueChange: (ruleId: string, value: number) => void;
  onActionChange: (ruleId: string, action: LogicRuleActionType) => void;
  onDeleteRule: (ruleId: string) => void;
}

function DraggableRuleItem({
  rule,
  index,
  onMoveRule,
  onOperatorChange,
  onGoodChange,
  onValueChange,
  onActionChange,
  onDeleteRule,
}: DraggableRuleItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: DRAG_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: DRAG_TYPE,
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        onMoveRule(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`card bg-base-200 shadow-md hover:shadow-lg transition-shadow duration-200 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="card-body p-4">
        <div className="flex justify-between items-start mb-2 gap-2">
          <div className="flex items-center gap-2 text-xs text-base-content/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 cursor-move"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            </svg>
            Rule {index + 1}
          </div>
          <button
            type="button"
            onClick={() => onDeleteRule(rule.id)}
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
              onChange={(e) => onGoodChange(rule.id, e.target.value)}
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
                onOperatorChange(rule.id, e.target.value as ComparisonOperator)
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
              onChange={(e) => onValueChange(rule.id, Number(e.target.value))}
              className="select select-primary select-bordered w-full"
            >
              <option disabled={true} value="">
                Pick a value
              </option>
              {[0, 1, 5,10, 20, 30, 40, 50].map((value) => (
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
                onActionChange(
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
  );
}

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
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle"
  );
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaveStatus("saving");
    onUpdateRules(localRules);

    // Show success feedback after a brief delay
    setTimeout(() => {
      setSaveStatus("saved");
      showToast("Rules saved successfully!", "success");
      // Reset button state after showing success
      setTimeout(() => {
        setSaveStatus("idle");
      }, 2000);
    }, 100);
  };

  const handleOperatorChange = (
    ruleId: string,
    operator: ComparisonOperator
  ) => {
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
      prevRules.map((rule) => (rule.id === ruleId ? { ...rule, value } : rule))
    );
  };

  const handleActionChange = (ruleId: string, action: LogicRuleActionType) => {
    setLocalRules((prevRules) =>
      prevRules.map((rule) => (rule.id === ruleId ? { ...rule, action } : rule))
    );
  };

  const handleTemplateChange = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    if (templateKey && TEMPLATE_MAP[templateKey]) {
      setLocalRules(TEMPLATE_MAP[templateKey]);
    }
  };

  const handleDeleteRule = (ruleId: string) => {
    setLocalRules((prevRules) =>
      prevRules.filter((rule) => rule.id !== ruleId)
    );
  };

  const handleMoveRule = (dragIndex: number, hoverIndex: number) => {
    setLocalRules((prevRules) => {
      const newRules = [...prevRules];
      const [draggedRule] = newRules.splice(dragIndex, 1);
      newRules.splice(hoverIndex, 0, draggedRule);
      return newRules;
    });
  };

  const handleAddRule = () => {
    // Generate a random ID using crypto.randomUUID if available, otherwise fallback to random string
    const randomId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}`;

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
      </button>{" "}
      {isExpanded && (
        <DndProvider backend={HTML5Backend}>
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
              <DraggableRuleItem
                key={rule.id}
                rule={rule}
                index={index}
                onMoveRule={handleMoveRule}
                onOperatorChange={handleOperatorChange}
                onGoodChange={handleGoodChange}
                onValueChange={handleValueChange}
                onActionChange={handleActionChange}
                onDeleteRule={handleDeleteRule}
              />
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
                className={`btn btn-primary w-full sm:w-auto transition-all duration-300 ${
                  saveStatus === "saving"
                    ? "loading"
                    : saveStatus === "saved"
                    ? "btn-success"
                    : ""
                }`}
                disabled={saveStatus === "saving"}
              >
                {saveStatus === "saving" ? (
                  "Saving..."
                ) : saveStatus === "saved" ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Saved!
                  </>
                ) : (
                  "Save Rules"
                )}
              </button>
            </div>
          </form>
        </DndProvider>
      )}
    </div>
  );
}
