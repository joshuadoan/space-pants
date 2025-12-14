import { useRef, useMemo } from "react";
import { useDrag, useDrop } from "react-dnd";
import type { LogicRule } from "../../entities/types";
import {
  Resources,
  Products,
  MeepleStats,
  ComparisonOperator,
  LogicRuleActionType,
  MeepleType,
} from "../../entities/types";
import type { Meeple } from "../../entities/Meeple/Meeple";

const DRAG_TYPE = "RULE";

interface DraggableRuleItemProps {
  rule: LogicRule;
  index: number;
  meeples: Meeple[];
  isInvalid?: boolean;
  onMoveRule: (dragIndex: number, hoverIndex: number) => void;
  onOperatorChange: (ruleId: string, operator: ComparisonOperator) => void;
  onGoodChange: (ruleId: string, good: string) => void;
  onValueChange: (ruleId: string, value: number) => void;
  onActionChange: (ruleId: string, action: LogicRuleActionType) => void;
  onDestinationTypeChange: (ruleId: string, destinationType?: string) => void;
  onDestinationNameChange: (ruleId: string, destinationName?: string) => void;
  onDeleteRule: (ruleId: string) => void;
}

export function DraggableRuleItem({
  rule,
  index,
  meeples,
  isInvalid = false,
  onMoveRule,
  onOperatorChange,
  onGoodChange,
  onValueChange,
  onActionChange,
  onDestinationTypeChange,
  onDestinationNameChange,
  onDeleteRule,
}: DraggableRuleItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Filter available destinations based on action and destination type
  const availableDestinations = useMemo(() => {
    if (!rule.action) return [];

    // Determine which meeple types are valid for this action
    let validTypes: MeepleType[] = [];
    switch (rule.action) {
      case LogicRuleActionType.MineOreFromAsteroid:
        validTypes = [MeepleType.Asteroid];
        break;
      case LogicRuleActionType.SellOreToStation:
      case LogicRuleActionType.BuyProductFromStation:
      case LogicRuleActionType.SellProductToStation:
        validTypes = [MeepleType.SpaceStation];
        break;
      case LogicRuleActionType.SocializeAtBar:
      case LogicRuleActionType.WorkAtBar:
        validTypes = [MeepleType.SpaceBar];
        break;
      case LogicRuleActionType.RestAtApartments:
        validTypes = [MeepleType.SpaceApartments];
        break;
      default:
        return [];
    }

    // Filter meeples by valid types and optional destination type
    return meeples.filter((meeple) => {
      const matchesType = validTypes.includes(meeple.type);
      const matchesDestinationType = !rule.destinationType || meeple.type === rule.destinationType;
      return matchesType && matchesDestinationType;
    });
  }, [meeples, rule.action, rule.destinationType]);

  const [{ isDragging }, drag] = useDrag({
    type: DRAG_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver, draggedItem }, drop] = useDrop({
    accept: DRAG_TYPE,
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        onMoveRule(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      draggedItem: monitor.getItem<{ index: number }>() || null,
    }),
  });

  drag(drop(ref));

  // Show placeholder when hovering over a drop target (but not the item being dragged itself)
  const showPlaceholder = isOver && draggedItem && draggedItem.index !== index;

  // Check which fields are missing
  const missingGood = !rule.good;
  const missingOperator = !rule.operator;
  const missingValue = rule.value === undefined || rule.value === null || isNaN(rule.value);
  const missingAction = !rule.action;

  return (
    <>
      {showPlaceholder && (
        <div className="card bg-base-300 border-2 border-dashed border-primary/50 shadow-sm">
          <div className="card-body p-4 min-h-[200px]">
            <div className="flex items-center justify-center h-full">
              <span className="text-base-content/40 text-sm italic">Drop here</span>
            </div>
          </div>
        </div>
      )}
      <div
        ref={ref}
        className={`card bg-base-200 shadow-md hover:shadow-lg transition-shadow duration-200 ${
          isDragging ? "opacity-50" : ""
        } ${isInvalid ? "border-2 border-error" : ""} ${showPlaceholder ? "opacity-30" : ""}`}
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
              className={`select select-primary select-bordered w-full ${
                missingGood ? "border-error" : ""
              }`}
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
              className={`select select-primary select-bordered w-full ${
                missingOperator ? "border-error" : ""
              }`}
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
            <input
              type="number"
              value={rule.value ?? ""}
              onChange={(e) => {
                const numValue = e.target.value === "" ? 0 : Number(e.target.value);
                if (!isNaN(numValue)) {
                  onValueChange(rule.id, numValue);
                }
              }}
              min="0"
              step="1"
              placeholder="Enter a value"
              className={`input input-primary input-bordered w-full ${
                missingValue ? "border-error" : ""
              }`}
            />
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
              onChange={(e) => {
                const newAction = e.target.value as LogicRuleActionType;
                onActionChange(rule.id, newAction);
                // Clear destination fields when action changes to incompatible action
                const actionsWithDestinations = [
                  LogicRuleActionType.MineOreFromAsteroid,
                  LogicRuleActionType.SellOreToStation,
                  LogicRuleActionType.SocializeAtBar,
                  LogicRuleActionType.WorkAtBar,
                  LogicRuleActionType.BuyProductFromStation,
                  LogicRuleActionType.SellProductToStation,
                  LogicRuleActionType.RestAtApartments,
                ];
                if (!actionsWithDestinations.includes(newAction)) {
                  onDestinationTypeChange(rule.id, undefined);
                  onDestinationNameChange(rule.id, undefined);
                }
              }}
              className={`select select-primary select-bordered w-full ${
                missingAction ? "border-error" : ""
              }`}
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
        {/* Destination selectors - only show for actions that involve destinations */}
        {rule.action && [
          LogicRuleActionType.MineOreFromAsteroid,
          LogicRuleActionType.SellOreToStation,
          LogicRuleActionType.SocializeAtBar,
          LogicRuleActionType.WorkAtBar,
          LogicRuleActionType.BuyProductFromStation,
          LogicRuleActionType.SellProductToStation,
          LogicRuleActionType.RestAtApartments,
        ].includes(rule.action) && (
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <div className="flex-1">
              <label className="label py-1">
                <span className="label-text text-xs text-base-content/70">
                  Destination Type (optional)
                </span>
              </label>
              <select
                value={rule.destinationType || ""}
                onChange={(e) =>
                  onDestinationTypeChange(
                    rule.id,
                    e.target.value || undefined
                  )
                }
                className="select select-primary select-bordered w-full"
              >
                <option value="">Any (random)</option>
                {Object.values(MeepleType)
                  .filter((type) => 
                    // Filter based on action type
                    (rule.action === LogicRuleActionType.MineOreFromAsteroid && type === MeepleType.Asteroid) ||
                    (rule.action === LogicRuleActionType.SellOreToStation && type === MeepleType.SpaceStation) ||
                    (rule.action === LogicRuleActionType.SocializeAtBar && type === MeepleType.SpaceBar) ||
                    (rule.action === LogicRuleActionType.WorkAtBar && type === MeepleType.SpaceBar) ||
                    (rule.action === LogicRuleActionType.BuyProductFromStation && type === MeepleType.SpaceStation) ||
                    (rule.action === LogicRuleActionType.SellProductToStation && type === MeepleType.SpaceStation) ||
                    (rule.action === LogicRuleActionType.RestAtApartments && type === MeepleType.SpaceApartments)
                  )
                  .map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="label py-1">
                <span className="label-text text-xs text-base-content/70">
                  Destination Name (optional)
                </span>
              </label>
              <select
                value={rule.destinationName || ""}
                onChange={(e) =>
                  onDestinationNameChange(
                    rule.id,
                    e.target.value || undefined
                  )
                }
                className="select select-primary select-bordered w-full"
                disabled={availableDestinations.length === 0 || !rule.destinationType}
              >
                <option value="">
                  {availableDestinations.length === 0
                    ? "No destinations available"
                    : !rule.destinationType
                    ? "Select destination type first"
                    : "Any (random)"}
                </option>
                {availableDestinations.map((meeple) => (
                  <option key={meeple.name} value={meeple.name}>
                    {meeple.name} ({meeple.type})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

