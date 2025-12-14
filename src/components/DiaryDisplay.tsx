import { useMemo } from "react";
import {
  IconBook,
  IconClock,
  IconMoodSmile,
  IconPick,
  IconShip,
  IconCurrencyDollar,
  IconUsers,
  IconBeer,
  IconRefresh,
  IconBolt,
  IconHome,
  IconArrowUp,
  IconArrowDown,
} from "@tabler/icons-react";
import type { DiaryEntry } from "../entities/types";
import { MeepleStateType, LogicRuleActionType, Resources, MeepleStats } from "../entities/types";
import { formatGoodDisplay } from "../utils/goodsMetadata";

type DiaryDisplayProps = {
  diary: DiaryEntry[];
};

/**
 * Format timestamp as relative time (e.g., "2s ago", "1m ago")
 */
function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return "long ago";
}

/**
 * Get icon for a state type
 */
function getStateIcon(state: MeepleStateType) {
  switch (state) {
    case MeepleStateType.Idle:
    case MeepleStateType.Chilling:
      return <IconMoodSmile size={14} className="text-base-content/70" />;
    case MeepleStateType.Mining:
      return <IconPick size={14} className="text-secondary" />;
    case MeepleStateType.Traveling:
    case MeepleStateType.Patrolling:
    case MeepleStateType.Chasing:
      return <IconShip size={14} className="text-primary" />;
    case MeepleStateType.Trading:
    case MeepleStateType.Transacting:
      return <IconCurrencyDollar size={14} className="text-warning" />;
    case MeepleStateType.Socializing:
      return <IconUsers size={14} className="text-info" />;
    case MeepleStateType.Working:
      return <IconBeer size={14} className="text-success" />;
    case MeepleStateType.Converting:
      return <IconRefresh size={14} className="text-accent" />;
    case MeepleStateType.Broken:
      return <IconBolt size={14} className="text-error" />;
    default:
      return <IconMoodSmile size={14} className="text-base-content/70" />;
  }
}

/**
 * Format state name for display
 */
function formatStateName(state: MeepleStateType): string {
  return state.charAt(0).toUpperCase() + state.slice(1);
}

/**
 * Format goods snapshot for display
 */
function formatGoodsSnapshot(goods: Partial<Record<string, number>>): string {
  const entries = Object.entries(goods)
    .filter(([_, value]) => value !== undefined && value > 0)
    .map(([key, value]) => {
      return formatGoodDisplay(key as any, value ?? 0);
    });

  if (entries.length === 0) return "empty inventory";
  return entries.slice(0, 3).join(", ") + (entries.length > 3 ? "..." : "");
}

/**
 * Calculate goods changes between two diary entries
 */
function calculateGoodsChanges(
  current: Partial<Record<string, number>>,
  previous: Partial<Record<string, number>> | null
): Array<{ good: string; change: number; isPositive: boolean }> {
  if (!previous) return [];
  
  const changes: Array<{ good: string; change: number; isPositive: boolean }> = [];
  const allGoods = new Set([...Object.keys(current), ...Object.keys(previous)]);
  
  for (const good of allGoods) {
    const currentVal = current[good] ?? 0;
    const prevVal = previous[good] ?? 0;
    const diff = currentVal - prevVal;
    
    if (Math.abs(diff) > 0.01) { // Account for floating point
      changes.push({
        good,
        change: Math.abs(diff),
        isPositive: diff > 0,
      });
    }
  }
  
  return changes;
}

/**
 * Generate a narrative description for a diary entry
 */
function generateNarrative(entry: DiaryEntry, previousEntry: DiaryEntry | null): string {
  const { state, action, targetName } = entry;
  
  // Calculate goods changes
  const goodsChanges = previousEntry 
    ? calculateGoodsChanges(entry.goods, previousEntry.goods)
    : [];
  
  const gainedGoods = goodsChanges.filter(c => c.isPositive);
  const lostGoods = goodsChanges.filter(c => !c.isPositive);
  
  // Generate narrative based on state and action
  if (action) {
    switch (action) {
      case LogicRuleActionType.MineOreFromAsteroid:
        if (gainedGoods.some(g => g.good === Resources.Ore)) {
          const oreGained = gainedGoods.find(g => g.good === Resources.Ore)?.change ?? 0;
          return `Mined ${oreGained} ore from ${targetName || "an asteroid"}`;
        }
        return `Started mining at ${targetName || "an asteroid"}`;
        
      case LogicRuleActionType.SellOreToStation:
        if (gainedGoods.some(g => g.good === Resources.Money)) {
          const moneyGained = gainedGoods.find(g => g.good === Resources.Money)?.change ?? 0;
          return `Sold ore to ${targetName || "a station"} for $${moneyGained}`;
        }
        return `Trading ore with ${targetName || "a station"}`;
        
      case LogicRuleActionType.BuyProductFromStation:
        if (lostGoods.some(g => g.good === Resources.Money)) {
          const moneySpent = lostGoods.find(g => g.good === Resources.Money)?.change ?? 0;
          return `Bought products from ${targetName || "a station"} for $${moneySpent}`;
        }
        return `Shopping at ${targetName || "a station"}`;
        
      case LogicRuleActionType.SellProductToStation:
        if (gainedGoods.some(g => g.good === Resources.Money)) {
          const moneyGained = gainedGoods.find(g => g.good === Resources.Money)?.change ?? 0;
          return `Sold products to ${targetName || "a station"} for $${moneyGained}`;
        }
        return `Selling products to ${targetName || "a station"}`;
        
      case LogicRuleActionType.SocializeAtBar:
        return `Having fun at ${targetName || "the space bar"}`;
        
      case LogicRuleActionType.WorkAtBar:
        if (gainedGoods.some(g => g.good === Resources.Money)) {
          const moneyGained = gainedGoods.find(g => g.good === Resources.Money)?.change ?? 0;
          return `Earned $${moneyGained} working at ${targetName || "the space bar"}`;
        }
        return `Working at ${targetName || "the space bar"}`;
        
      case LogicRuleActionType.RestAtApartments:
        if (gainedGoods.some(g => g.good === MeepleStats.Energy)) {
          return `Resting and recharging at ${targetName || "home"}`;
        }
        return `Relaxing at ${targetName || "home"}`;
        
      case LogicRuleActionType.Patrol:
        return "Patrolling the area";
        
      case LogicRuleActionType.ChaseTarget:
        return `Chasing ${targetName || "a target"} through space`;
        
      case LogicRuleActionType.GoToPirateDen:
        return `Returning to ${targetName || "the pirate den"}`;
        
      case LogicRuleActionType.SetBroken:
        return "System failure! Needs repairs";
        
      case LogicRuleActionType.FixBrokenMeeple:
        return `Fixing ${targetName || "a broken meeple"}`;
    }
  }
  
  // Fallback to state-based narratives
  switch (state) {
    case MeepleStateType.Mining:
      return `Mining ore from ${targetName || "an asteroid"}`;
    case MeepleStateType.Trading:
      return `Trading with ${targetName || "a station"}`;
    case MeepleStateType.Traveling:
      return `Traveling to ${targetName || "a destination"}`;
    case MeepleStateType.Socializing:
      return `Socializing at ${targetName || "the space bar"}`;
    case MeepleStateType.Working:
      return `Working at ${targetName || "the space bar"}`;
    case MeepleStateType.Chilling:
      return `Resting at ${targetName || "home"}`;
    case MeepleStateType.Chasing:
      return `Chasing ${targetName || "a target"}`;
    case MeepleStateType.Patrolling:
      return "Patrolling the area";
    case MeepleStateType.Converting:
      return "Converting resources";
    case MeepleStateType.Broken:
      return "System broken - needs repair";
    case MeepleStateType.Idle:
      return "Taking a break";
    default:
      return formatStateName(state);
  }
}

export function DiaryDisplay({ diary }: DiaryDisplayProps) {
  // Reverse diary to show newest first
  const reversedDiary = useMemo(() => [...diary].reverse(), [diary]);

  if (diary.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-base-content/50">
        <IconBook size={32} className="mb-2 opacity-50" />
        <p className="text-sm italic">No diary entries yet</p>
        <p className="text-xs mt-1">Start doing things to see your story!</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <IconBook size={18} className="text-primary" />
        <h4 className="text-sm font-semibold text-base-content">Diary</h4>
        <span className="badge badge-sm badge-ghost">{diary.length} entries</span>
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
        {reversedDiary.map((entry, index) => {
          const previousEntry = index > 0 ? reversedDiary[index - 1] : null;
          const narrative = generateNarrative(entry, previousEntry);
          const goodsChanges = previousEntry 
            ? calculateGoodsChanges(entry.goods, previousEntry.goods)
            : [];
          const gainedGoods = goodsChanges.filter(c => c.isPositive);
          const lostGoods = goodsChanges.filter(c => !c.isPositive);
          
          return (
            <div
              key={index}
              className="bg-base-200/70 rounded-lg p-3 border-l-4 border-primary/50 hover:bg-base-200 transition-colors shadow-sm"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {getStateIcon(entry.state)}
                  <span className="text-sm font-semibold text-base-content">
                    {narrative}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-base-content/50 shrink-0">
                  <IconClock size={12} />
                  <span>{formatRelativeTime(entry.timestamp)}</span>
                </div>
              </div>
              
              {/* Show goods changes if any */}
              {goodsChanges.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-1.5 pl-5 text-xs">
                  {gainedGoods.map((change) => (
                    <span
                      key={`gain-${change.good}`}
                      className="flex items-center gap-1 text-success font-medium"
                    >
                      <IconArrowUp size={10} />
                      <span>+{formatGoodDisplay(change.good as any, change.change)}</span>
                    </span>
                  ))}
                  {lostGoods.map((change) => (
                    <span
                      key={`loss-${change.good}`}
                      className="flex items-center gap-1 text-error font-medium"
                    >
                      <IconArrowDown size={10} />
                      <span>-{formatGoodDisplay(change.good as any, change.change)}</span>
                    </span>
                  ))}
                </div>
              )}
              
              {/* Show current inventory */}
              <div className="text-xs text-base-content/60 pl-5 flex items-center gap-1">
                <IconHome size={12} className="opacity-50" />
                <span className="italic">Inventory: {formatGoodsSnapshot(entry.goods)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

