import { motion } from "motion/react";
import { IconComponent } from "../utils/iconMap";
import { formatRelativeTime } from "../utils/dateUtils";
import type { MeepleActionHistory } from "../types";

export const HistoryItem = ({
  historyItem,
}: {
  historyItem: MeepleActionHistory;
}) => {
  if (!historyItem) {
    return <div className="p-2 text-sm opacity-60">No history</div>;
  }

  const timeAgo = formatRelativeTime(historyItem.timestamp);

  const baseClasses = "p-3 mb-2 bg-base-200 rounded-lg border-l-4";
  const animationProps = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
    transition: { duration: 0.3 },
  };

  switch (historyItem.state.type) {
    case "idle":
      return (
        <motion.div
          {...animationProps}
          className={`${baseClasses} border-gray-400`}
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            <IconComponent icon="idle" size={16} title="Idle" />
            Idle
          </div>
          <div className="text-xs opacity-60 mt-1">{timeAgo}</div>
        </motion.div>
      );
    case "traveling":
      return (
        <motion.div
          {...animationProps}
          className={`${baseClasses} border-blue-400`}
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            <IconComponent icon="traveling" size={16} title="Traveling" />
            Traveling to {historyItem.state.target.name} (
            {historyItem.state.target.roleId})
          </div>
          <div className="text-xs opacity-60 mt-1">{timeAgo}</div>
        </motion.div>
      );
    case "visiting":
      return (
        <motion.div
          {...animationProps}
          className={`${baseClasses} border-green-400`}
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            <IconComponent icon="visiting" size={16} title="Visiting" />
            Visiting {historyItem.state.target.name} (
            {historyItem.state.target.roleId})
          </div>
          <div className="text-xs opacity-60 mt-1">{timeAgo}</div>
        </motion.div>
      );
    case "transacting":
      const { transaction } = historyItem.state;
      const isSelfTransaction =
        !transaction.from ||
        (transaction.from &&
          transaction.to &&
          transaction.from === transaction.to);

      return (
        <motion.div
          {...animationProps}
          className={`${baseClasses} border-yellow-400`}
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            <IconComponent icon="transacting" size={16} title="Transacting" />
            <span>
              Transacted {transaction.quantity} {transaction.property}
              <br />
              {isSelfTransaction ? (
                <>
                  Generating{transaction.to ? ` (${transaction.to.name})` : ""}
                </>
              ) : (
                <>
                  From {transaction.from?.name || "unknown"} to{" "}
                  {transaction.to?.name || "unknown"}
                </>
              )}
            </span>
          </div>
          <div className="text-xs opacity-60 mt-1">{timeAgo}</div>
        </motion.div>
      );
    case "mining":
      return (
        <motion.div
          {...animationProps}
          className={`${baseClasses} border-orange-400`}
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            <IconComponent icon="mining" size={16} title="Mining" />
            <span>
              Mining {historyItem.state.quantity} {historyItem.state.property}
              <br />
              From {historyItem.state.target.name} (
              {historyItem.state.target.roleId})
            </span>
          </div>
          <div className="text-xs opacity-60 mt-1">{timeAgo}</div>
        </motion.div>
      );
    case "buying":
      return (
        <motion.div
          {...animationProps}
          className={`${baseClasses} border-red-400`}
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            <IconComponent icon="buying" size={16} title="Buying" />
            <span>
              Buying {historyItem.state.quantity} {historyItem.state.property}
              <br />
              From {historyItem.state.target.name} (
              {historyItem.state.target.roleId})
            </span>
          </div>
          <div className="text-xs opacity-60 mt-1">{timeAgo}</div>
        </motion.div>
      );
    case "selling":
      return (
        <motion.div
          {...animationProps}
          className={`${baseClasses} border-blue-400`}
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            <IconComponent icon="selling" size={16} title="Selling" />
            <span>
              Selling {historyItem.state.quantity} {historyItem.state.property}
              <br />
              To {historyItem.state.target.name} (
              {historyItem.state.target.roleId})
            </span>
          </div>
          <div className="text-xs opacity-60 mt-1">{timeAgo}</div>
        </motion.div>
      );
    case "transmuting":
      return (
        <motion.div
          {...animationProps}
          className={`${baseClasses} border-purple-400`}
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            <IconComponent icon="transmuting" size={16} title="Transmuting" />
            <span>
              Transmuting {historyItem.state.fromQuantity}{" "}
              {historyItem.state.fromProperty} to {historyItem.state.toProperty}
            </span>
          </div>
          <div className="text-xs opacity-60 mt-1">{timeAgo}</div>
        </motion.div>
      );
    case "generating":
      return (
        <motion.div
          {...animationProps}
          className={`${baseClasses} border-green-400`}
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            <IconComponent icon="generating" size={16} title="Generating" />
            <span>
              Generating {historyItem.state.quantity}{" "}
              {historyItem.state.property}
            </span>
          </div>
          <div className="text-xs opacity-60 mt-1">{timeAgo}</div>
        </motion.div>
      );
    case "consuming":
      return (
        <motion.div
          {...animationProps}
          className={`${baseClasses} border-purple-400`}
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            <IconComponent icon="consuming" size={16} title="Consuming" />
            <span>
              Consuming {historyItem.state.quantity} {historyItem.state.property}
            </span>
          </div>
          <div className="text-xs opacity-60 mt-1">{timeAgo}</div>
        </motion.div>
      );  
  }
};
