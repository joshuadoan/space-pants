import { Link } from "react-router-dom";
import {
  type Inventory,
  type MeepleState,
  type Stats,
  type MeepleAction,
} from "../entities/Meeple";
import { IconComponent } from "../utils/iconMap";
import type { RoleId } from "../entities/types";
import { MiningType, CurrencyType, VitalsType, ProductType } from "../entities/types";
import { IconPlayerPause, IconRoute } from "@tabler/icons-react";
import { IconArrowsExchange } from "@tabler/icons-react";
import { type Rules } from "../rules/rules";
import { useGame } from "../hooks/useGame";
import { Meeple } from "../entities/Meeple";
import cx from "classnames";
import { useMemo } from "react";

type JournalEntry = {
  timestamp: number;
  state: MeepleState;
  action: MeepleAction;
  source?: "rule" | "generator";
};

export const MeepleDetails = (props: {
  className?: string;
  name: string;
  roleId: RoleId;
  state: MeepleState;
  stats: Stats;
  inventory: Inventory;
  id: number;
  isSelected: boolean;
}) => {
  const { className, id, isSelected, ...meeple } = props;
  const { game } = useGame();
  const meepleInstance = useMemo(() => {
    return game?.currentScene.actors.find(
      (actor): actor is Meeple => actor instanceof Meeple && actor.id === id
    );
  }, [game, id]);

  const journal = meepleInstance?.journal || [];
  const rulesMap = meepleInstance
    ? {
        idle: [
          ...meepleInstance.rulesMapRules.idle,
          ...meepleInstance.rulesMapGenerator.idle,
        ],
        traveling: [
          ...meepleInstance.rulesMapRules.traveling,
          ...meepleInstance.rulesMapGenerator.traveling,
        ],
        visiting: [
          ...meepleInstance.rulesMapRules.visiting,
          ...meepleInstance.rulesMapGenerator.visiting,
        ],
        transacting: [
          ...meepleInstance.rulesMapRules.transacting,
          ...meepleInstance.rulesMapGenerator.transacting,
        ],
      }
    : null;

  return (
    <MeepleDetail className={className}>
      <Link
        className="cursor-pointer hover:text-primary underline"
        to={`/meeple/${id}`}
      >
        {meeple.name}
      </Link>
      <MeepleRoleBadge roleId={meeple.roleId} />
      <MeepleStateBadge state={meeple.state} />
      {rulesMap && (
        <StateRulesTimeLine
          state={meeple.state}
          rulesMap={rulesMap}
          journal={journal}
        />
      )}
    </MeepleDetail>
  );
};

export const MeepleDetail = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cx("flex flex-col gap-2 p-3 border border-gray-300 rounded-md mb-2", className)}>
    {children}
  </div>
);

export const MeepleRoleBadge = ({ roleId }: { roleId: RoleId }) => (
  <div className="flex items-center gap-1.5 text-sm text-base-content/70">
    <IconComponent icon={roleId} size={14} />
    <span>{roleId}</span>
  </div>
);

export const MeepleStateBadge = ({ state }: { state: MeepleState }) => (
  <div className="flex items-center gap-2 mb-2">
    {state.name === "idle" && (
      <div className="badge badge-lg gap-1.5 bg-info/20 text-info border-info/30">
        <IconPlayerPause size={14} />
        <span className="font-semibold capitalize">{state.name}</span>
      </div>
    )}
    {state.name === "traveling" && (
      <div className="badge badge-lg gap-1.5 bg-warning/20 text-warning border-warning/30">
        <IconRoute size={14} />
        <span className="font-semibold capitalize">{state.name}</span>
        <span className="text-warning/70 text-xs">→ {state.target.name}</span>
      </div>
    )}
    {state.name === "visiting" && (
      <div className="badge badge-lg gap-1.5 bg-success/20 text-success border-success/30">
        <IconArrowsExchange size={14} />
        <span className="font-semibold capitalize">{state.name}</span>
        <span className="text-success/70 text-xs">
          Visiting with {state.target.name}
        </span>
      </div>
    )}
    {state.name === "transacting" && (
      <div className="badge badge-lg gap-1.5 bg-base-200 text-base-content border-base-content/30">
        <IconArrowsExchange size={14} />
        <span className="font-semibold capitalize">{state.name}</span>
        <span className="text-base-content/70 text-xs">
          Transacting {state.transactionType} {state.quantity} {state.good}
        </span>
      </div>
    )}
  </div>
);

const StateRulesTimeLine = ({
  state,
  rulesMap,
  journal,
}: {
  state: MeepleState;
  rulesMap: Rules;
  journal: JournalEntry[];
}) => {
  // Extract all actions from all states - one dot per action
  const actions = useMemo(() => {
    const actionList: Array<{
      ruleName: string;
      actionIndex: number;
      ruleIndex: number;
      property?: string;
      stateName: string;
      globalIndex: number;
    }> = [];
    let globalIndex = 0;
    
    // Iterate through all states
    (["idle", "traveling", "visiting", "transacting"] as const).forEach((stateName) => {
      const stateRules = rulesMap[stateName] || [];
      stateRules.forEach((rule, ruleIndex) => {
        for (let i = 0; i < rule.actions.length; i++) {
          actionList.push({
            ruleName: rule.name,
            actionIndex: i,
            ruleIndex,
            property: rule.property,
            stateName,
            globalIndex: globalIndex++,
          });
        }
      });
    });
    
    return actionList;
  }, [rulesMap]);

  // Get journal entries for the current state, sorted by timestamp
  const currentStateJournalEntries = useMemo(() => {
    return journal
      .filter((entry) => entry.state.name === state.name)
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [journal, state.name]);

  // Track completed actions for the current state only
  const completedActions = useMemo(() => {
    const completed = new Set<number>();
    
    // Get actions for current state
    const currentStateActions = actions.filter(
      (action) => action.stateName === state.name
    );
    
    // Count non-finish actions in journal for this state
    const actionCount = currentStateJournalEntries.filter(
      (entry) => entry.action.name !== "finish"
    ).length;
    
    // Mark actions as completed based on journal entries
    // Each journal entry (except finish) represents one action being executed
    for (let i = 0; i < Math.min(actionCount, currentStateActions.length); i++) {
      // Use the global index of the current state action
      completed.add(currentStateActions[i].globalIndex);
    }
    
    return completed;
  }, [currentStateJournalEntries, actions, state.name]);

  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-gray-200">
      <span className="text-xs text-gray-500 mr-1 shrink-0">Actions:</span>
      <div className="flex items-center gap-1 flex-wrap">
        {actions.map((action) => {
          const isActiveState = action.stateName === state.name;
          const isCompleted = completedActions.has(action.globalIndex);
          // Check if property is a valid icon key
          const isValidIconKey = action.property && 
            (Object.values(MiningType).includes(action.property as MiningType) ||
             Object.values(CurrencyType).includes(action.property as CurrencyType) ||
             Object.values(VitalsType).includes(action.property as VitalsType) ||
             Object.values(ProductType).includes(action.property as ProductType));
          
          return (
            <div
              key={`${action.stateName}-${action.ruleIndex}-${action.actionIndex}`}
              className="flex items-center gap-1"
              title={`${action.ruleName} (${action.stateName})`}
            >
              <div className="flex items-center gap-0.5">
                {isValidIconKey && (
                  <IconComponent
                    icon={action.property as any}
                    size={10}
                    className={cx(
                      "transition-opacity",
                      isActiveState && isCompleted
                        ? "opacity-100"
                        : isActiveState
                        ? "opacity-60"
                        : "opacity-20"
                    )}
                  />
                )}
                <div
                  className={cx(
                    "rounded-full transition-all duration-200",
                    isActiveState && isCompleted
                      ? "bg-primary"
                      : isActiveState
                      ? "bg-gray-400 border border-gray-500"
                      : "bg-gray-200 border border-gray-300 opacity-40",
                    isValidIconKey ? "w-1.5 h-1.5" : "w-2 h-2"
                  )}
                />
              </div>
              {action.globalIndex < actions.length - 1 && (
                <div
                  className={cx(
                    "w-1 h-px transition-colors",
                    isActiveState ? "bg-gray-400" : "bg-gray-200 opacity-30"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
