import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { useGame } from "../Game/useGame";
import { IconComponent } from "../utils/iconMap";
import { MeepleInventoryItem } from "../types";
import { BackButton } from "./BackButton";
import { MeepleInventoryItemDisplay } from "./MeepleInventoryItemDisplay";
import { ConditionsDisplay } from "./ConditionsDisplay";
import { HistoryItem } from "./HistoryItem";

export const Detail = () => {
  const { meeples, lockCameraToMeeple } = useGame();
  const { meepleId } = useParams();
  const navigate = useNavigate();
  const meeple = meeples.find((meeple) => meeple.id.toString() === meepleId);

  useEffect(() => {
    if (!meeple) {
      navigate("/");
      return;
    }
    lockCameraToMeeple(meeple);
  }, [meeple, navigate, lockCameraToMeeple]);

  if (!meeple) {
    return (
      <div className="p-4">
        <BackButton />
        <div className="p-4">Meeple not found. Redirecting to main page...</div>
        <Link to="/" className="btn btn-primary">
          Back to main page
        </Link>
      </div>
    );
  }

  const inventory = { ...meeple?.inventory };
  const orderedActionsHistory = [...meeple.actionsHistory].reverse();
  const conditions = [...meeple.conditions];

  return (
    <div className="flex flex-col h-full">
      <div className="py-2">
        <BackButton />
      </div>
      <ul className="list bg-base-100 rounded-box shadow-md w-xs">
        <li className="list-row" key={meeple.id}>
          <div>
            <IconComponent icon={meeple.roleId} />
          </div>
          <div>
            <Link to={`/${meeple.id}`} className="link link-hover">
              {meeple.name}
            </Link>
            <div className="text-xs uppercase font-semibold opacity-60">
              {meeple.roleId} {meeple.state.type}
            </div>
            <div className="text-xs uppercase font-semibold opacity-60 flex items-center gap-1">
              <IconComponent icon="position" size={12} />
              {meeple.pos.x.toFixed(2)}, {meeple.pos.y.toFixed(2)}
            </div>
          </div>
        </li>
      </ul>
      <div className="p-4 flex flex-col gap-1 h-full">
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
        {conditions.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold uppercase opacity-60 mb-2">
              Conditions
            </h3>
            <div className="space-y-2">
              {conditions.map((condition, index) => {
                const isMet = !!meeple.evaluateCondition(condition);
                return (
                  <ConditionsDisplay
                    key={index}
                    condition={condition}
                    meeple={meeple}
                    isMet={isMet}
                  />
                );
              })}
            </div>
          </div>
        )}
        <h3 className="text-sm font-semibold uppercase opacity-60 mb-2">
          Journal
        </h3>
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {orderedActionsHistory.map((historyItem, index) => (
              <HistoryItem key={index} historyItem={historyItem} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
