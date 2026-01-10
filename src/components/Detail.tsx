
import { AnimatePresence } from "motion/react";
import { MeepleInventoryItem, type ActionHistory, type Condition, type MeepleAction, type MeepleInventory } from "../types";
import { MeepleInventoryItemDisplay } from "./MeepleInventoryItemDisplay";
import { ConditionsDisplay } from "./ConditionsDisplay";
import { HistoryItem } from "./HistoryItem";

type DetailProps = {
  inventory: MeepleInventory;
  actionsHistory: ActionHistory[];
  conditions: Condition[];
  evaluateCondition: (condition: Condition) => boolean;
};
export const Detail = ({ inventory, actionsHistory, conditions, evaluateCondition }: DetailProps) => {
  const orderedActionsHistory = [...actionsHistory].reverse();
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex flex-col gap-1">
        <h3 className="text-sm font-semibold uppercase opacity-60 mb-2">
          Inventory
        </h3>
        <div className="mb-4">
          {Object.entries(inventory).map(([item, quantity]) => (
            <div
              key={item}
              className="flex justify-between items-center p-2 bg-base-200 rounded mb-1"
            >
              <MeepleInventoryItemDisplay item={item as MeepleInventoryItem} />
              <span className="text-sm font-medium">{quantity}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {conditions.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold uppercase opacity-60 mb-2">
              Conditions
            </h3>
            <div className="space-y-2">
              {conditions.map((condition, index) => {
                const isMet = !!evaluateCondition(condition);
                const isFirstMet =
                  isMet &&
                  index ===
                    conditions.findIndex((c) => !!evaluateCondition(c));
                return (
                  <ConditionsDisplay
                    key={index}
                    condition={condition}
                    isMet={isFirstMet}
                  />
                );
              })}
            </div>
          </div>
        )}
        <h3 className="text-sm font-semibold uppercase opacity-60 mb-2">
          Journal
        </h3>
        <div className="">
          <AnimatePresence mode="popLayout">
            {orderedActionsHistory.map((historyItem) => (
              <HistoryItem
                key={historyItem.timestamp}
                historyItem={historyItem}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
