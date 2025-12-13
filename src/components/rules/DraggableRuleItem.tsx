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
                <option value="">Any (random)</option>
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
  );
}

