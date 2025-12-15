import {
  IconCurrencyDollar,
  IconExchange,
  IconPick,
  IconRefresh,
  IconClock,
  IconTrendingUp,
  IconCoins,
  IconRocket,
  IconSword,
} from "@tabler/icons-react";
import * as economyConfig from "../entities/economy-config";

type ConfigSection = {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  items: Array<{
    name: string;
    value: number | string;
    unit?: string;
    description?: string;
  }>;
};

export function EconomyDisplay() {
  const sections: ConfigSection[] = [
    {
      title: "Trading & Exchange Rates",
      icon: IconExchange,
      color: "text-primary",
      items: [
        {
          name: "Trade Money Amount",
          value: economyConfig.TRADE_MONEY_AMOUNT,
          unit: "money per ore",
          description: "Amount of money received per ore when miners sell to stations",
        },
        {
          name: "Trade Ore Amount",
          value: economyConfig.TRADE_ORE_AMOUNT,
          unit: "ore per transaction",
          description: "Batch size for ore trading",
        },
        {
          name: "Product Buy Price",
          value: economyConfig.PRODUCT_BUY_PRICE,
          unit: "money per product",
          description: "Price per product when buying from a station that produces it",
        },
        {
          name: "Product Sell Price",
          value: economyConfig.PRODUCT_SELL_PRICE,
          unit: "money per product",
          description: "Price per product when selling to a station that doesn't produce it",
        },
        {
          name: "Fizz Price",
          value: economyConfig.FIZZ_PRICE,
          unit: "money per fizz",
          description: "Price per fizz at space bars",
        },
      ],
    },
    {
      title: "Production & Mining",
      icon: IconPick,
      color: "text-secondary",
      items: [
        {
          name: "Ore Per Product",
          value: economyConfig.ORE_PER_PRODUCT,
          unit: "ore per product",
          description: "Amount of ore required to produce 1 product at space stations",
        },
        {
          name: "Mining Ore Amount",
          value: economyConfig.MINING_ORE_AMOUNT,
          unit: "ore per action",
          description: "Amount of ore extracted per mining action",
        },
        {
          name: "Station Production Interval",
          value: economyConfig.SPACE_STATION_PRODUCTION_INTERVAL_SECONDS,
          unit: "seconds",
          description: "Space station production check interval",
        },
      ],
    },
    {
      title: "Regeneration Systems",
      icon: IconRefresh,
      color: "text-accent",
      items: [
        {
          name: "Asteroid Min Ore Threshold",
          value: economyConfig.ASTEROID_MIN_ORE_THRESHOLD,
          unit: "ore",
          description: "Minimum ore threshold for asteroid regeneration",
        },
        {
          name: "Asteroid Regeneration Rate",
          value: economyConfig.ASTEROID_REGENERATION_RATE_MS,
          unit: "ms",
          description: "Asteroid ore regeneration rate",
        },
        {
          name: "Asteroid Regeneration Amount",
          value: economyConfig.ASTEROID_REGENERATION_AMOUNT,
          unit: "ore per cycle",
          description: "Amount of ore regenerated per cycle at asteroids",
        },
        {
          name: "Station Min Ore Threshold",
          value: economyConfig.SPACE_STATION_MIN_ORE_THRESHOLD,
          unit: "ore",
          description: "Minimum ore threshold for space station regeneration",
        },
        {
          name: "Station Regeneration Rate",
          value: economyConfig.SPACE_STATION_REGENERATION_RATE_MS,
          unit: "ms",
          description: "Space station ore regeneration rate",
        },
        {
          name: "Station Regeneration Amount",
          value: economyConfig.SPACE_STATION_ORE_REGENERATION_AMOUNT,
          unit: "ore per cycle",
          description: "Amount of ore regenerated per cycle at space stations",
        },
        {
          name: "Space Bar Min Fizz Threshold",
          value: economyConfig.SPACE_BAR_MIN_FIZZ_THRESHOLD,
          unit: "fizz",
          description: "Minimum fizz threshold for space bar regeneration",
        },
        {
          name: "Space Bar Regeneration Rate",
          value: economyConfig.SPACE_BAR_FIZZ_REGENERATION_RATE_MS,
          unit: "ms",
          description: "Space bar fizz regeneration rate",
        },
        {
          name: "Space Bar Regeneration Amount",
          value: economyConfig.SPACE_BAR_FIZZ_REGENERATION_AMOUNT,
          unit: "fizz per cycle",
          description: "Amount of fizz regenerated per cycle at space bars",
        },
      ],
    },
    {
      title: "Starting Resources",
      icon: IconRocket,
      color: "text-success",
      items: [
        {
          name: "Trader Starting Money",
          value: economyConfig.TRADER_STARTING_MONEY,
          unit: "money",
          description: "Starting money for traders",
        },
        {
          name: "Station Starting Money",
          value: economyConfig.SPACE_STATION_STARTING_MONEY,
          unit: "money",
          description: "Starting money for space stations",
        },
        {
          name: "Asteroid Starting Ore",
          value: economyConfig.ASTEROID_STARTING_ORE,
          unit: "ore",
          description: "Starting ore for asteroids",
        },
        {
          name: "Space Bar Starting Fizz",
          value: economyConfig.SPACE_BAR_STARTING_FIZZ,
          unit: "fizz",
          description: "Starting fizz stock for space bars",
        },
      ],
    },
    {
      title: "Work & Earnings",
      icon: IconCoins,
      color: "text-warning",
      items: [
        {
          name: "Work Earnings",
          value: economyConfig.WORK_EARNINGS,
          unit: "money per session",
          description: "Amount of money earned per work session (bartenders)",
        },
      ],
    },
    {
      title: "Action Timings",
      icon: IconClock,
      color: "text-info",
      items: [
        {
          name: "Mining Delay",
          value: economyConfig.MINING_DELAY_MS,
          unit: "ms",
          description: "Delay for mining action",
        },
        {
          name: "Trading Delay",
          value: economyConfig.TRADING_DELAY_MS,
          unit: "ms",
          description: "Delay for trading ore action",
        },
        {
          name: "Socializing Delay",
          value: economyConfig.SOCIALIZING_DELAY_MS,
          unit: "ms",
          description: "Delay for socializing action",
        },
        {
          name: "Working Delay",
          value: economyConfig.WORKING_DELAY_MS,
          unit: "ms",
          description: "Delay for working action",
        },
        {
          name: "Shopping Delay",
          value: economyConfig.SHOPPING_DELAY_MS,
          unit: "ms",
          description: "Delay for shopping action",
        },
        {
          name: "Selling Delay",
          value: economyConfig.SELLING_DELAY_MS,
          unit: "ms",
          description: "Delay for selling action",
        },
        {
          name: "Chilling Delay",
          value: economyConfig.CHILLING_DELAY_MS,
          unit: "ms",
          description: "Delay for resting at apartments",
        },
        {
          name: "Pirate Den Rest Delay",
          value: economyConfig.PIRATE_DEN_REST_DELAY_MS,
          unit: "ms",
          description: "Delay for resting at pirate den",
        },
      ],
    },
    {
      title: "Behavioral Thresholds",
      icon: IconTrendingUp,
      color: "text-primary",
      items: [
        {
          name: "Socialize Money Threshold",
          value: economyConfig.SOCIALIZE_MONEY_THRESHOLD,
          unit: "money",
          description: "Money threshold for socializing at bars",
        },
        {
          name: "Miner Sell Ore Threshold",
          value: economyConfig.MINER_SELL_ORE_THRESHOLD,
          unit: "ore",
          description: "Ore threshold for miners to sell ore",
        },
        {
          name: "Buy Product Money Threshold",
          value: economyConfig.BUY_PRODUCT_MONEY_THRESHOLD,
          unit: "money",
          description: "Money threshold for traders/bartenders to buy products",
        },
        {
          name: "Mechanic Socialize Threshold",
          value: economyConfig.MECHANIC_SOCIALIZE_MONEY_THRESHOLD,
          unit: "money",
          description: "Money threshold for mechanics to socialize",
        },
        {
          name: "Mechanic Fix Threshold",
          value: economyConfig.MECHANIC_FIX_MONEY_THRESHOLD,
          unit: "money",
          description: "Money threshold for mechanics to fix broken meeples",
        },
      ],
    },
    {
      title: "Pirate Parameters",
      icon: IconSword,
      color: "text-error",
      items: [
        {
          name: "Patrol Energy Cost",
          value: economyConfig.PIRATE_PATROL_ENERGY_COST,
          unit: "energy",
          description: "Energy cost per patrol movement for pirates",
        },
        {
          name: "Patrolling Delay",
          value: economyConfig.PATROLLING_DELAY_MS,
          unit: "ms",
          description: "Delay for patrolling action",
        },
        {
          name: "Chase Detection Distance",
          value: economyConfig.PIRATE_CHASE_DETECTION_DISTANCE,
          unit: "pixels",
          description: "Distance at which a pirate detects and starts chasing a trader",
        },
        {
          name: "Chase Duration",
          value: economyConfig.PIRATE_CHASE_DURATION_MS,
          unit: "ms",
          description: "Duration for which a pirate chases a trader",
        },
        {
          name: "Steal Distance",
          value: economyConfig.PIRATE_STEAL_DISTANCE,
          unit: "pixels",
          description: "Distance at which a pirate can steal money from a trader",
        },
        {
          name: "Steal Amount",
          value: economyConfig.PIRATE_STEAL_AMOUNT,
          unit: "money",
          description: "Amount of money stolen per successful steal",
        },
        {
          name: "Steal Energy Cost",
          value: `${(economyConfig.PIRATE_STEAL_ENERGY_COST_PERCENT * 100).toFixed(0)}%`,
          unit: "of current energy",
          description: "Energy cost percentage when stealing",
        },
        {
          name: "Laser Fire Interval",
          value: economyConfig.PIRATE_LASER_FIRE_INTERVAL_MS,
          unit: "ms",
          description: "Interval between laser shots during chase",
        },
        {
          name: "Chase Abandon Distance",
          value: economyConfig.PIRATE_CHASE_ABANDON_DISTANCE,
          unit: "pixels",
          description: "Distance at which a pirate abandons chase when near a destination",
        },
      ],
    },
  ];

  return (
    <div className="w-full p-4 space-y-6 overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        <IconCurrencyDollar size={32} className="text-primary" />
        <div>
          <h2 className="text-3xl font-bold text-base-content">Economy Configuration</h2>
          <p className="text-sm text-base-content/70 mt-1">
            All economic parameters that control resource flows, pricing, and production
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {sections.map((section, sectionIndex) => {
          const Icon = section.icon;
          return (
            <div
              key={sectionIndex}
              className="card bg-base-200 shadow-lg border border-base-300"
            >
              <div className="card-body">
                <div className="flex items-center gap-2 mb-4">
                  <Icon size={24} className={section.color} />
                  <h3 className="text-xl font-bold text-base-content">
                    {section.title}
                  </h3>
                </div>
                <div className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="bg-base-100 rounded-lg p-3 border border-base-300 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div className="flex-1">
                          <div className="font-semibold text-base-content text-sm">
                            {item.name}
                          </div>
                          {item.description && (
                            <div className="text-xs text-base-content/60 mt-1">
                              {item.description}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="badge badge-primary badge-lg font-bold">
                            {typeof item.value === "number"
                              ? item.value.toLocaleString()
                              : item.value}
                          </div>
                        </div>
                      </div>
                      {item.unit && (
                        <div className="text-xs text-base-content/50 mt-1">
                          {item.unit}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Economic Balance Presets */}
      <div className="card bg-base-200 shadow-lg border border-base-300 mt-6">
        <div className="card-body">
          <div className="flex items-center gap-2 mb-4">
            <IconTrendingUp size={24} className="text-info" />
            <h3 className="text-xl font-bold text-base-content">
              Economic Balance Presets
            </h3>
          </div>
          <div className="text-sm text-base-content/70 mb-4">
            Quick tuning presets for different economic scenarios (currently for reference only)
          </div>
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(economyConfig.ECONOMY_PRESETS).map(([presetName, preset]) => (
              <div
                key={presetName}
                className="bg-base-100 rounded-lg p-4 border border-base-300"
              >
                <div className="font-semibold text-base-content mb-2 capitalize">
                  {presetName.replace(/_/g, " ")}
                </div>
                <div className="space-y-1 text-xs text-base-content/70">
                  {Object.entries(preset).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize">{key.replace(/_/g, " ")}:</span>
                      <span className="font-semibold text-base-content">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

