import { useOutletContext, Link } from "react-router-dom";
import { useGame } from "../Game/useGame";
import { MeepleRoles, MeepleInventoryItem, MeepleStateNames } from "../types";
import type { Meeple } from "../Game/Meeple";
import { useMemo } from "react";
import { ProductsChart } from "./ProductsChart";
import { TRANSMUTATION_RATIOS, SELL_PRICES, BUY_PRICES } from "../consts";
import { IconComponent } from "../utils/iconMap";

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

    // Richest by role
    const richestByRole = Object.values(MeepleRoles)
      .map((role) => {
        const roleMeeples = [...meeples]
          .filter((m) => m.roleId === role)
          .sort(
            (a, b) =>
              b.inventory[MeepleInventoryItem.Money] -
              a.inventory[MeepleInventoryItem.Money]
          );
        return {
          role,
          richest: roleMeeples.length > 0 ? roleMeeples[0] : null,
        };
      })
      .filter(({ richest }) => richest !== null);

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

    // Inventory by role
    const inventoryByRole = Object.values(MeepleRoles).map((role) => {
      const roleMeeples = meeples.filter((m) => m.roleId === role);
      const aggregatedInventory = Object.values(MeepleInventoryItem).reduce(
        (acc, item) => {
          acc[item] = roleMeeples.reduce(
            (sum, m) => sum + m.inventory[item],
            0
          );
          return acc;
        },
        {} as Record<MeepleInventoryItem, number>
      );
      return {
        role,
        inventory: aggregatedInventory,
        count: roleMeeples.length,
      };
    }).filter(({ count }) => count > 0);

    // Deficits by role (negative inventory)
    const deficitsByRole = Object.values(MeepleRoles)
      .map((role) => {
        const roleMeeples = meeples.filter((m) => m.roleId === role);
        const aggregatedInventory = Object.values(MeepleInventoryItem).reduce(
          (acc, item) => {
            acc[item] = roleMeeples.reduce(
              (sum, m) => sum + m.inventory[item],
              0
            );
            return acc;
          },
          {} as Record<MeepleInventoryItem, number>
        );
        const negativeItems = Object.entries(aggregatedInventory).filter(
          ([_, count]) => count < 0
        );
        if (negativeItems.length === 0) return null;
        return {
          role,
          inventory: Object.fromEntries(negativeItems) as Record<
            MeepleInventoryItem,
            number
          >,
          count: roleMeeples.length,
        };
      })
      .filter(
        (item): item is NonNullable<typeof item> => item !== null
      );

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
      richestByRole,
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
      inventoryByRole,
      deficitsByRole,
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
    <div className="h-full overflow-y-auto space-y-6 w-xs">
      {/* Products Over Time Chart */}
      <ProductsChart meeples={meeples} />

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
                <div className="font-semibold">
                  <Link
                    to={`/${stats.richestMeeple.id}`}
                    className="link link-hover"
                  >
                    {stats.richestMeeple.name}
                  </Link>
                </div>
                <div className="text-sm">
                  💰 {stats.richestMeeple.inventory[MeepleInventoryItem.Money].toLocaleString()}{" "}
                  ({stats.richestMeeple.roleId})
                </div>
              </div>
            )}
            {stats.fastestMeeple && (
              <div>
                <div className="text-sm text-gray-400">Fastest Meeple</div>
                <div className="font-semibold">
                  <Link
                    to={`/${stats.fastestMeeple.id}`}
                    className="link link-hover"
                  >
                    {stats.fastestMeeple.name}
                  </Link>
                </div>
                <div className="text-sm">
                  🚀 {stats.fastestMeeple.speed.toFixed(1)} speed
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inventory by Role */}
      <div className="card bg-base-200 shadow-md">
        <div className="card-body">
          <h3 className="card-title text-lg">📦 Inventory by Role</h3>
          <div className="space-y-3 mt-2">
            {stats.inventoryByRole.map(({ role, inventory, count }) => (
              <div key={role} className="space-y-1">
                <div className="flex items-center gap-2">
                  <IconComponent icon={role} size={18} title={role} />
                  <span className="font-semibold capitalize">
                    {role.replace("-", " ")}:
                  </span>
                  <span className="text-sm text-gray-400">({count})</span>
                </div>
                <div className="flex items-center gap-3 pl-7">
                  {Object.entries(inventory)
                    .filter(([_, count]) => count > 0)
                    .map(([item, count]) => (
                      <div
                        key={item}
                        className="flex items-center gap-1"
                      >
                        <IconComponent
                          icon={item as MeepleInventoryItem}
                          size={16}
                          title={item}
                        />
                        <span className="text-sm">{count.toLocaleString()}</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Deficits by Role */}
      {stats.deficitsByRole.length > 0 && (
        <div className="card bg-base-200 shadow-md border-2 border-red-500/50">
          <div className="card-body">
            <h3 className="card-title text-lg text-red-400">⚠️ Deficits by Role</h3>
            <div className="space-y-3 mt-2">
              {stats.deficitsByRole.map(({ role, inventory, count }) => (
                <div key={role} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <IconComponent icon={role} size={18} title={role} />
                    <span className="font-semibold capitalize">
                      {role.replace("-", " ")}:
                    </span>
                    <span className="text-sm text-gray-400">({count})</span>
                  </div>
                  <div className="flex items-center gap-3 pl-7">
                    {Object.entries(inventory).map(([item, count]) => (
                      <div
                        key={item}
                        className="flex items-center gap-1 text-red-400"
                      >
                        <IconComponent
                          icon={item as MeepleInventoryItem}
                          size={16}
                          title={item}
                        />
                        <span className="text-sm font-semibold">
                          {count.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Game Constants */}
      <div className="card bg-base-200 shadow-md">
        <div className="card-body">
          <h3 className="card-title text-lg">⚙️ Game Constants</h3>
          
          {/* Transmutation Ratios */}
          {Object.keys(TRANSMUTATION_RATIOS).length > 0 && (
            <div className="mt-2">
              <div className="text-sm font-semibold mb-2">Transmutation Ratios</div>
              <div className="space-y-1 text-sm">
                {Object.entries(TRANSMUTATION_RATIOS).map(([fromItem, ratios]) => (
                  <div key={fromItem} className="pl-2">
                    <span className="capitalize font-medium">{fromItem}:</span>
                    <div className="pl-4 space-y-0.5">
                      {Object.entries(ratios).map(([toItem, ratio]) => (
                        <div key={toItem} className="text-xs">
                          → {ratio}x <span className="capitalize">{toItem}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sell Prices */}
          {Object.keys(SELL_PRICES).length > 0 && (
            <div className="mt-4 pt-2 border-t border-base-300">
              <div className="text-sm font-semibold mb-2">Sell Prices</div>
              <div className="space-y-1 text-sm">
                {Object.entries(SELL_PRICES).map(([item, price]) => (
                  <div key={item} className="flex justify-between pl-2">
                    <span className="capitalize">{item}:</span>
                    <span className="font-semibold text-green-400">{price} money</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buy Prices */}
          {Object.keys(BUY_PRICES).length > 0 && (
            <div className="mt-4 pt-2 border-t border-base-300">
              <div className="text-sm font-semibold mb-2">Buy Prices</div>
              <div className="space-y-1 text-sm">
                {Object.entries(BUY_PRICES).map(([item, price]) => (
                  <div key={item} className="flex justify-between pl-2">
                    <span className="capitalize">{item}:</span>
                    <span className="font-semibold text-blue-400">{price} money</span>
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
