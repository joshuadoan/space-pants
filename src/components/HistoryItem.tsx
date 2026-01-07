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
            <IconComponent icon="idle" size={16} />
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
            <IconComponent icon="traveling" size={16} />
            Traveling to {historyItem.state.target.name} ({historyItem.state.target.roleId})
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
            <IconComponent icon="visiting" size={16} />
            Visiting {historyItem.state.target.name} ({historyItem.state.target.roleId})
          </div>
          <div className="text-xs opacity-60 mt-1">{timeAgo}</div>
        </motion.div>
      );
    case "transacting":
      return (
        <motion.div
          {...animationProps}
          className={`${baseClasses} border-yellow-400`}
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            <IconComponent icon="transacting" size={16} />
            <span>
              Transacted {historyItem.state.transaction.quantity}{" "}
              {historyItem.state.transaction.property}
              <br />
              From {historyItem.state.transaction.from.name} to{" "}
              {historyItem.state.transaction.to.name}
            </span>
          </div>
          <div className="text-xs opacity-60 mt-1">{timeAgo}</div>
        </motion.div>
      );
  }
};

