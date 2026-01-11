import { AnimatePresence } from "motion/react";
import { MeepleInventoryItem } from "../types";
import { MeepleInventoryItemDisplay } from "./MeepleInventoryItemDisplay";
import { ConditionsDisplay } from "./ConditionsDisplay";
import { HistoryItem } from "./HistoryItem";
import { Link, useParams } from "react-router-dom";
import { useGame } from "../Game/useGame";
import { MeepleInfo } from "./MeepleInfo";

export const Detail = () => {
  const { meeples } = useGame();
  const { meepleId } = useParams();
  const selectedMeeple = meeples.find(
    (meeple) => meeple.id.toString() === meepleId
  );

  if (!selectedMeeple) {
    return <div className="flex flex-col h-full w-xs p-4">Meeple not found. <Link to="/" className="link link-hover">Go back to main page</Link></div>;
  }

  const orderedActionsHistory = [...selectedMeeple.actionsHistory].reverse();
  return (
    <div className="flex flex-col h-full w-xs">
      <MeepleInfo
        roleId={selectedMeeple.roleId}
        name={selectedMeeple.name}
        stateType={selectedMeeple.state.type}
        pos={selectedMeeple.pos}
        id={selectedMeeple.id.toString()}
      />
      <div className="p-4 flex flex-col gap-1">
        <h3 className="text-sm font-semibold uppercase opacity-60 mb-2">
          Inventory
        </h3>
        <div className="mb-4">
          {Object.entries({ ...selectedMeeple.inventory }).map(
            ([item, quantity]) => (
              <div
                key={item}
                className="flex justify-between items-center p-2 bg-base-200 rounded mb-1"
              >
                <MeepleInventoryItemDisplay
                  item={item as MeepleInventoryItem}
                />
                <span className="text-sm font-medium">{quantity}</span>
              </div>
            )
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {selectedMeeple.conditions.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold uppercase opacity-60 mb-2">
              Conditions
            </h3>
            <div className="space-y-2">
              {selectedMeeple.conditions.map((condition, index) => {
                return (
                  <ConditionsDisplay
                    key={index}
                    condition={condition}
                    isMet={selectedMeeple.evaluateCondition(condition)}
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
