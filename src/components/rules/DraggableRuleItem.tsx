import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import type { LogicRule } from "../../entities/types";
import {
  Resources,
  Products,
  MeepleStats,
  ComparisonOperator,
  LogicRuleActionType,
} from "../../entities/types";

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

export function DraggableRuleItem({
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
              <optgroup label="Resources">
                {Object.values(Resources).map((good) => (
                  <option key={good} value={good}>
                    {good}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Products">
                {Object.values(Products).map((good) => (
                  <option key={good} value={good}>
                    {good}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Stats">
                {Object.values(MeepleStats).map((good) => (
                  <option key={good} value={good}>
                    {good}
                  </option>
                ))}
              </optgroup>
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
              {[0, 1, 5, 10, 20, 30, 40, 50].map((value) => (
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

