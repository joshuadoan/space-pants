import { useOutletContext } from "react-router-dom";
import { useGame } from "../Game/useGame";
import { MeepleRoles, MeepleInventoryItem, MeepleStateNames } from "../types";
import type { Meeple } from "../Game/Meeple";
import { useMemo } from "react";

type StatsProps = {
  meeples: Meeple[];
};

export const Stats = () => {
  const { meeples } = useOutletContext<StatsProps>();
  const { hasStarted } = useGame();

  const stats = useMemo(() => {
    if (!hasStarted || meeples.length === 0) {
      return null;
    }

    // Population stats
    const populationByRole = Object.values(MeepleRoles).map((role) => ({
      role,
      count: meeples.filter((m) => m.roleId === role).length,
    }));

    // Economic stats
    const totalMoney = meeples.reduce(
      (sum, m) => sum + m.inventory[MeepleInventoryItem.Money],
      0
    );
    const totalMinerals = meeples.reduce(
      (sum, m) => sum + m.inventory[MeepleInventoryItem.Minirals],
      0
    );
    const totalFizzy = meeples.reduce(
      (sum, m) => sum + m.inventory[MeepleInventoryItem.Fizzy],
      0
    );

    // Activity stats
    const stateCounts = Object.values(MeepleStateNames).map((stateName) => ({
      state: stateName,
      count: meeples.filter((m) => m.state.type === stateName).length,
    }));

    // Top performers
    const richestMeeple = [...meeples].sort(
      (a, b) =>
        b.inventory[MeepleInventoryItem.Money] -
        a.inventory[MeepleInventoryItem.Money]
    )[0];

    const mostActiveMeeple = [...meeples].sort(
      (a, b) => b.actionsHistory.length - a.actionsHistory.length
    )[0];

    const fastestMeeple = [...meeples]
      .filter((m) => m.speed > 0)
      .sort((a, b) => b.speed - a.speed)[0];

    const richestMiner = [...meeples]
      .filter((m) => m.roleId === MeepleRoles.Miner)
      .sort(
        (a, b) =>
          b.inventory[MeepleInventoryItem.Money] -
          a.inventory[MeepleInventoryItem.Money]
      )[0];

    // Action stats
    const totalActions = meeples.reduce(
      (sum, m) => sum + m.actionsHistory.length,
      0
    );
    const averageActionsPerMeeple = totalActions / meeples.length;

    // Action type breakdown
    const actionTypeCounts = meeples.reduce(
      (acc, meeple) => {
        meeple.actionsHistory.forEach((entry) => {
          const actionType = entry.action.type;
          acc[actionType] = (acc[actionType] || 0) + 1;
        });
        return acc;
      },
      {} as Record<string, number>
    );

    // Speed stats
    const movingMeeples = meeples.filter((m) => m.speed > 0);
    const averageSpeed =
      movingMeeples.length > 0
        ? movingMeeples.reduce((sum, m) => sum + m.speed, 0) /
          movingMeeples.length
        : 0;

    // Inventory distribution
    const meeplesWithMoney = meeples.filter(
      (m) => m.inventory[MeepleInventoryItem.Money] > 0
    ).length;
    const meeplesWithMinerals = meeples.filter(
      (m) => m.inventory[MeepleInventoryItem.Minirals] > 0
    ).length;
    const meeplesWithFizzy = meeples.filter(
      (m) => m.inventory[MeepleInventoryItem.Fizzy] > 0
    ).length;

    // Economic activity
    const buyingMeeples = meeples.filter(
      (m) => m.state.type === MeepleStateNames.Buying
    ).length;
    const sellingMeeples = meeples.filter(
      (m) => m.state.type === MeepleStateNames.Selling
    ).length;
    const miningMeeples = meeples.filter(
      (m) => m.state.type === MeepleStateNames.Mining
    ).length;
    const travelingMeeples = meeples.filter(
      (m) => m.state.type === MeepleStateNames.Traveling
    ).length;

    // Fun facts
    const totalMeeples = meeples.length;
    const activeMeeples = meeples.filter(
      (m) => m.state.type !== MeepleStateNames.Idle
    ).length;
    const idleMeeples = meeples.filter(
      (m) => m.state.type === MeepleStateNames.Idle
    ).length;

    return {
      populationByRole,
      totalMoney,
      totalMinerals,
      totalFizzy,
      stateCounts,
      richestMeeple,
      mostActiveMeeple,
      fastestMeeple,
      richestMiner,
      totalActions,
      averageActionsPerMeeple,
      actionTypeCounts,
      averageSpeed,
      meeplesWithMoney,
      meeplesWithMinerals,
      meeplesWithFizzy,
      buyingMeeples,
      sellingMeeples,
      miningMeeples,
      travelingMeeples,
      totalMeeples,
      activeMeeples,
      idleMeeples,
    };
  }, [meeples, hasStarted]);

  if (!hasStarted) {
    return (
      <div className="p-4 w-xs">
        <p className="text-gray-500">Game not started yet...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-4 w-xs">
        <p className="text-gray-500">Loading stats...</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6 w-xs">
      <div>
        <h2 className="text-2xl font-bold mb-4">📊 Live Game Stats</h2>
      </div>

      {/* Population Overview */}
      <div className="card bg-base-200 shadow-md">
        <div className="card-body">
          <h3 className="card-title text-lg">👥 Population</h3>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {stats.populationByRole.map(({ role, count }) => (
              <div key={role} className="flex justify-between">
                <span className="capitalize">{role.replace("-", " ")}:</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t border-base-300">
            <div className="flex justify-between font-bold">
              <span>Total Meeples:</span>
              <span>{stats.totalMeeples}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Economic Overview */}
      <div className="card bg-base-200 shadow-md">
        <div className="card-body">
          <h3 className="card-title text-lg">💰 Economy</h3>
          <div className="space-y-2 mt-2">
            <div className="flex justify-between">
              <span>Total Money in Circulation:</span>
              <span className="font-semibold text-green-400">
                {stats.totalMoney.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total Minerals:</span>
              <span className="font-semibold text-yellow-400">
                {stats.totalMinerals.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total Fizzy Drinks:</span>
              <span className="font-semibold text-blue-400">
                {stats.totalFizzy.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-base-300 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Meeples with Money:</span>
              <span>{stats.meeplesWithMoney}</span>
            </div>
            <div className="flex justify-between">
              <span>Meeples with Minerals:</span>
              <span>{stats.meeplesWithMinerals}</span>
            </div>
            <div className="flex justify-between">
              <span>Meeples with Fizzy:</span>
              <span>{stats.meeplesWithFizzy}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Overview */}
      <div className="card bg-base-200 shadow-md">
        <div className="card-body">
          <h3 className="card-title text-lg">⚡ Current Activity</h3>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {stats.stateCounts
              .filter(({ count }) => count > 0)
              .map(({ state, count }) => (
                <div key={state} className="flex justify-between">
                  <span className="capitalize">{state}:</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
          </div>
          <div className="mt-4 pt-2 border-t border-base-300 space-y-1">
            <div className="flex justify-between">
              <span>Active Meeples:</span>
              <span className="font-semibold text-green-400">
                {stats.activeMeeples}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Idle Meeples:</span>
              <span className="font-semibold text-gray-400">
                {stats.idleMeeples}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="card bg-base-200 shadow-md">
        <div className="card-body">
          <h3 className="card-title text-lg">🏆 Top Performers</h3>
          <div className="space-y-3 mt-2">
            {stats.richestMeeple && (
              <div>
                <div className="text-sm text-gray-400">Richest Meeple</div>
                <div className="font-semibold">{stats.richestMeeple.name}</div>
                <div className="text-sm">
                  💰 {stats.richestMeeple.inventory[MeepleInventoryItem.Money].toLocaleString()}{" "}
                  ({stats.richestMeeple.roleId})
                </div>
              </div>
            )}
            {stats.mostActiveMeeple && (
              <div>
                <div className="text-sm text-gray-400">Most Active</div>
                <div className="font-semibold">
                  {stats.mostActiveMeeple.name}
                </div>
                <div className="text-sm">
                  📝 {stats.mostActiveMeeple.actionsHistory.length} actions
                </div>
              </div>
            )}
            {stats.fastestMeeple && (
              <div>
                <div className="text-sm text-gray-400">Fastest Meeple</div>
                <div className="font-semibold">{stats.fastestMeeple.name}</div>
                <div className="text-sm">
                  🚀 {stats.fastestMeeple.speed.toFixed(1)} speed
                </div>
              </div>
            )}
            {stats.richestMiner && (
              <div>
                <div className="text-sm text-gray-400">Richest Miner</div>
                <div className="font-semibold">{stats.richestMiner.name}</div>
                <div className="text-sm">
                  💰{" "}
                  {stats.richestMiner.inventory[
                    MeepleInventoryItem.Money
                  ].toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Statistics */}
      <div className="card bg-base-200 shadow-md">
        <div className="card-body">
          <h3 className="card-title text-lg">📈 Action Statistics</h3>
          <div className="space-y-2 mt-2">
            <div className="flex justify-between">
              <span>Total Actions:</span>
              <span className="font-semibold">
                {stats.totalActions.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Average per Meeple:</span>
              <span className="font-semibold">
                {stats.averageActionsPerMeeple.toFixed(1)}
              </span>
            </div>
          </div>
          {Object.keys(stats.actionTypeCounts).length > 0 && (
            <div className="mt-4 pt-2 border-t border-base-300">
              <div className="text-sm font-semibold mb-2">Action Breakdown:</div>
              <div className="space-y-1">
                {Object.entries(stats.actionTypeCounts)
                  .sort(([, a], [, b]) => b - a)
                  .map(([actionType, count]) => (
                    <div key={actionType} className="flex justify-between text-sm">
                      <span className="capitalize">{actionType}:</span>
                      <span>{count.toLocaleString()}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
