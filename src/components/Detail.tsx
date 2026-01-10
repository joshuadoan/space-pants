import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import { useGame } from "../Game/useGame";
import { IconComponent } from "../utils/iconMap";
import { MeepleInventoryItem } from "../types";
import { BackButton } from "./BackButton";
import { MeepleInventoryItemDisplay } from "./MeepleInventoryItemDisplay";
import { ConditionsDisplay } from "./ConditionsDisplay";
import { HistoryItem } from "./HistoryItem";
import { StateType } from "./StateType";
import { Vector } from "excalibur";

export const Detail = () => {
  const { meeples, lockCameraToMeeple } = useGame();
  const { meepleId } = useParams();
  const navigate = useNavigate();
  const [pos, setPos] = useState<Vector>(new Vector(0, 0));
  const meeple = meeples.find((meeple) => meeple.id.toString() === meepleId);

  useEffect(() => {
    if (!meeple) {
      navigate("/");
      return;
    }
    lockCameraToMeeple(meeple);
  }, [meeple, navigate, lockCameraToMeeple]);

  useEffect(() => {
    if (!meeple) {
      return;
    }
    const interval = setInterval(() => {
      setPos(new Vector(meeple?.pos.x, meeple?.pos.y));
    }, 500);
    return () => clearInterval(interval);
  }, [meeple]);

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
      <ul className="list bg-base-100 rounded-box shadow-md w-xs">
        <li className="list-row" key={meeple.id}>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Link to="/" aria-label="Back" title="Back to main page">
                <IconComponent icon="arrow-left" size={16} title="Back" />
              </Link>
              <Link to={`/${meeple.id}`} className="link link-hover">
                {meeple.name}
              </Link>
            </div>
            <div className="flex items-center gap-2 text-xs uppercase font-semibold opacity-60">
              <span className="flex items-center gap-1">
                <IconComponent icon={meeple.roleId} size={12} title={meeple.roleId} />
                {meeple.roleId}
              </span>
            </div>
            <StateType state={meeple.state} />
            <div className="text-xs uppercase font-semibold opacity-60 flex items-center gap-1">
              <IconComponent icon="position" size={12} title="Position" />
              {pos.x.toFixed(2)}, {pos.y.toFixed(2)}
            </div>
          </div>
        </li>
      </ul>
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
                const isMet = !!meeple.evaluateCondition(condition);
                const isFirstMet =
                  isMet &&
                  index ===
                    conditions.findIndex((c) => !!meeple.evaluateCondition(c));
                return (
                  <ConditionsDisplay
                    key={index}
                    condition={condition}
                    meeple={meeple}
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
