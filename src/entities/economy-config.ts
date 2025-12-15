import { Resources, Products } from "./types";

/**
 * Economy Configuration
 * 
 * This file contains all economic parameters for tuning the game economy.
 * All values that affect resource flows, pricing, production, and regeneration
 * should be defined here for centralized economic balance tuning.
 * 
 * See economy.md for detailed documentation of the economic system.
 */

// ============================================================================
// Trading & Exchange Rates
// ============================================================================

/**
 * Amount of money received per ore when miners sell to stations
 * Exchange rate: 1 ore = TRADE_MONEY_AMOUNT money
 * 
 * Higher values = miners earn more, more money in circulation
 * Lower values = miners earn less, tighter money supply
 */
export const TRADE_MONEY_AMOUNT = 2;

/**
 * Amount of ore traded per transaction
 * Controls batch size for ore trading
 */
export const TRADE_ORE_AMOUNT = 1;

/**
 * Price per product when buying from a station that produces it
 * Exchange rate: 1 money = PRODUCT_BUY_PRICE product (at producing station)
 * 
 * Higher values = products more expensive, traders need more capital
 * Lower values = products cheaper, easier for traders to start
 */
export const PRODUCT_BUY_PRICE = 1;

/**
 * Price per product when selling to a station that doesn't produce it
 * Exchange rate: 1 product = PRODUCT_SELL_PRICE money (at non-producing station)
 * 
 * Higher values = traders earn more profit, more money circulation
 * Lower values = traders earn less, tighter margins
 */
export const PRODUCT_SELL_PRICE = 2;

/**
 * Price per fizz at space bars
 * Exchange rate: 1 money = FIZZ_PRICE fizz
 * 
 * Higher values = socializing more expensive, money drains faster
 * Lower values = socializing cheaper, more frequent socializing
 */
export const FIZZ_PRICE = 1;

// ============================================================================
// Production & Mining
// ============================================================================

/**
 * Amount of ore required to produce 1 product at space stations
 * Production efficiency: 1 ore = 1 product (when ORE_PER_PRODUCT = 1)
 * 
 * Higher values = less efficient production, slower product creation
 * Lower values = more efficient production, faster product creation
 */
export const ORE_PER_PRODUCT = 1;

/**
 * Amount of ore extracted per mining action
 * Controls mining yield per action
 * 
 * Higher values = faster ore accumulation, more resources available
 * Lower values = slower ore accumulation, resource scarcity
 */
export const MINING_ORE_AMOUNT = 1;

/**
 * Space station production check interval in seconds
 * Stations check for production opportunities every N seconds
 * 
 * Lower values = faster production cycles, more products created
 * Higher values = slower production cycles, less frequent production
 */
export const SPACE_STATION_PRODUCTION_INTERVAL_SECONDS = 0.5;

// ============================================================================
// Regeneration Systems
// ============================================================================

/**
 * Minimum ore threshold for asteroid regeneration
 * Asteroids regenerate when ore falls below this value
 * 
 * Higher values = regeneration starts earlier, more consistent ore supply
 * Lower values = regeneration starts later, more scarcity periods
 */
export const ASTEROID_MIN_ORE_THRESHOLD = 100;

/**
 * Asteroid ore regeneration rate in milliseconds
 * How often asteroids regenerate ore
 * 
 * Lower values = faster regeneration, more ore available
 * Higher values = slower regeneration, ore scarcity periods
 */
export const ASTEROID_REGENERATION_RATE_MS = 1000;

/**
 * Amount of ore regenerated per cycle at asteroids
 * Controls regeneration yield
 * 
 * Higher values = more ore per regeneration cycle
 * Lower values = less ore per regeneration cycle
 */
export const ASTEROID_REGENERATION_AMOUNT = 1;

/**
 * Minimum ore threshold for space station regeneration
 * Stations regenerate ore when below this value
 * 
 * Higher values = regeneration starts earlier, more consistent production
 * Lower values = regeneration starts later, production interruptions
 */
export const SPACE_STATION_MIN_ORE_THRESHOLD = 50;

/**
 * Space station ore regeneration rate in milliseconds
 * How often stations regenerate ore
 * 
 * Lower values = faster regeneration, more consistent production
 * Higher values = slower regeneration, production gaps
 */
export const SPACE_STATION_REGENERATION_RATE_MS = 1000;

/**
 * Amount of ore regenerated per cycle at space stations
 * Controls station regeneration yield
 * 
 * Higher values = more ore per cycle, faster production recovery
 * Lower values = less ore per cycle, slower production recovery
 */
export const SPACE_STATION_ORE_REGENERATION_AMOUNT = 2;

/**
 * Minimum fizz threshold for space bar regeneration
 * Bars regenerate fizz when stock falls below this value
 * 
 * Higher values = regeneration starts earlier, more consistent service
 * Lower values = regeneration starts later, service interruptions
 */
export const SPACE_BAR_MIN_FIZZ_THRESHOLD = 5;

/**
 * Space bar fizz regeneration rate in milliseconds
 * How often bars regenerate fizz
 * 
 * Lower values = faster regeneration, more fizz available
 * Higher values = slower regeneration, fizz shortages
 */
export const SPACE_BAR_FIZZ_REGENERATION_RATE_MS = 2000;

/**
 * Amount of fizz regenerated per cycle at space bars
 * Controls bar regeneration yield
 * 
 * Higher values = more fizz per cycle, better service capacity
 * Lower values = less fizz per cycle, limited service capacity
 */
export const SPACE_BAR_FIZZ_REGENERATION_AMOUNT = 1;

// ============================================================================
// Starting Resources
// ============================================================================

/**
 * Starting money for traders
 * Initial capital for traders to begin trading
 * 
 * Higher values = traders start with more capital, faster trading cycles
 * Lower values = traders start with less capital, slower initial growth
 */
export const TRADER_STARTING_MONEY = 1;

/**
 * Starting money for space stations
 * Initial capital for stations to buy ore from miners
 * 
 * Higher values = stations can buy more ore initially, faster production start
 * Lower values = stations have less capital, slower initial production
 */
export const SPACE_STATION_STARTING_MONEY = 42;

/**
 * Starting ore for asteroids
 * Initial ore available for mining
 * 
 * Higher values = more initial ore, miners can start immediately
 * Lower values = less initial ore, miners wait for regeneration
 */
export const ASTEROID_STARTING_ORE = 1;

/**
 * Starting fizz stock for space bars
 * Initial fizz available for socializing
 * 
 * Higher values = bars ready for service immediately
 * Lower values = bars need regeneration before service
 */
export const SPACE_BAR_STARTING_FIZZ = 1;

/**
 * Starting goods for miners
 * Initial resources for miners
 */
export const MINER_STARTING_GOODS = {
  [Resources.Ore]: 0,
  [Resources.Money]: 0,
} satisfies Partial<Record<string, number>>;

/**
 * Starting goods for traders
 * Initial resources for traders
 */
export const TRADER_STARTING_GOODS = {
  [Resources.Money]: TRADER_STARTING_MONEY,
} satisfies Partial<Record<string, number>>;

/**
 * Starting goods for space bars
 * Initial resources for space bars
 */
export const SPACE_BAR_STARTING_GOODS = {
  [Products.Fizz]: SPACE_BAR_STARTING_FIZZ,
  [Resources.Money]: 0,
} satisfies Partial<Record<string, number>>;

/**
 * Starting goods for players
 * Initial resources for players
 */
export const PLAYER_STARTING_GOODS = {
  [Resources.Money]: 0,
} satisfies Partial<Record<string, number>>;

// ============================================================================
// Work & Earnings
// ============================================================================

/**
 * Amount of money earned per work session (bartenders)
 * Controls service economy income
 * 
 * Higher values = bartenders earn more, more money in service economy
 * Lower values = bartenders earn less, tighter service economy
 */
export const WORK_EARNINGS = 3;

// ============================================================================
// Action Timings (Economic Impact)
// ============================================================================

/**
 * Delay for mining action in milliseconds
 * Time required to extract ore from asteroids
 * 
 * Lower values = faster mining, more ore extracted per time period
 * Higher values = slower mining, less ore extracted per time period
 */
export const MINING_DELAY_MS = 3000;

/**
 * Delay for trading ore action in milliseconds
 * Time required to complete ore-to-money transactions
 * 
 * Lower values = faster trading, quicker money circulation
 * Higher values = slower trading, delayed money circulation
 */
export const TRADING_DELAY_MS = 5000;

/**
 * Delay for socializing action in milliseconds
 * Time required to socialize at bars (spends all money ≥ threshold)
 * 
 * Lower values = faster socializing, quicker money drain
 * Higher values = slower socializing, money stays in circulation longer
 */
export const SOCIALIZING_DELAY_MS = 5000;

/**
 * Delay for working action in milliseconds
 * Time required for bartenders to complete a work shift
 * 
 * Lower values = faster work cycles, more frequent earnings
 * Higher values = slower work cycles, less frequent earnings
 */
export const WORKING_DELAY_MS = 30000; // 30 seconds

/**
 * Delay for shopping action in milliseconds
 * Time required to buy products from stations
 * 
 * Lower values = faster shopping, quicker product distribution
 * Higher values = slower shopping, delayed product distribution
 */
export const SHOPPING_DELAY_MS = 3000;

/**
 * Delay for selling action in milliseconds
 * Time required to sell products to stations
 * 
 * Lower values = faster selling, quicker money circulation
 * Higher values = slower selling, delayed money circulation
 */
export const SELLING_DELAY_MS = 3000;

/**
 * Delay for resting at apartments in milliseconds
 * Time required to restore energy at apartments
 * 
 * Lower values = faster rest, entities return to work quicker
 * Higher values = slower rest, longer downtime periods
 */
export const CHILLING_DELAY_MS = 3000;

/**
 * Delay for resting at pirate den in milliseconds
 * Time required for pirates to restore energy
 * 
 * Lower values = pirates recover faster, more active
 * Higher values = pirates recover slower, less active
 */
export const PIRATE_DEN_REST_DELAY_MS = 5000;

// ============================================================================
// Behavioral Economic Thresholds
// ============================================================================

/**
 * Money threshold for socializing at bars
 * Entities socialize when money >= this value (spends all money)
 * 
 * Higher values = entities save more before socializing, more money in circulation
 * Lower values = entities socialize more frequently, money drains faster
 */
export const SOCIALIZE_MONEY_THRESHOLD = 50;

/**
 * Ore threshold for miners to sell ore
 * Miners sell ore when ore >= this value
 * 
 * Higher values = miners accumulate more ore before selling, larger transactions
 * Lower values = miners sell more frequently, smaller transactions
 */
export const MINER_SELL_ORE_THRESHOLD = 10;

/**
 * Money threshold for traders/bartenders to buy products
 * Entities buy products when money >= this value
 * 
 * Higher values = entities save more before buying, larger purchases
 * Lower values = entities buy more frequently, smaller purchases
 */
export const BUY_PRODUCT_MONEY_THRESHOLD = 1;

/**
 * Money threshold for mechanics to socialize
 * Mechanics socialize when money >= this value
 * 
 * Higher values = mechanics work more before socializing
 * Lower values = mechanics socialize more frequently
 */
export const MECHANIC_SOCIALIZE_MONEY_THRESHOLD = 20;

/**
 * Money threshold for mechanics to fix broken meeples
 * Mechanics fix broken meeples when money < this value
 * 
 * Higher values = mechanics fix more often (work more)
 * Lower values = mechanics socialize more (fix less)
 */
export const MECHANIC_FIX_MONEY_THRESHOLD = 20;

// ============================================================================
// Pirate Economic Parameters
// ============================================================================

/**
 * Energy cost per patrol movement for pirates
 * Controls how quickly pirates deplete energy while patrolling
 * 
 * Higher values = pirates use more energy, rest more often
 * Lower values = pirates use less energy, patrol longer
 */
export const PIRATE_PATROL_ENERGY_COST = 10;

/**
 * Delay for patrolling action in milliseconds
 * Time between patrol movements
 * 
 * Lower values = faster patrol movements, more active pirates
 * Higher values = slower patrol movements, less active pirates
 */
export const PATROLLING_DELAY_MS = 2000;

/**
 * Distance at which a pirate detects and starts chasing a trader
 * Controls pirate detection range
 * 
 * Higher values = pirates detect traders from farther away, more chases
 * Lower values = pirates detect traders from closer, fewer chases
 */
export const PIRATE_CHASE_DETECTION_DISTANCE = 400;

/**
 * Duration for which a pirate chases a trader in milliseconds
 * How long pirates pursue targets
 * 
 * Higher values = longer chases, more disruption to trading
 * Lower values = shorter chases, less disruption
 */
export const PIRATE_CHASE_DURATION_MS = 15000;

/**
 * Distance at which a pirate can steal money from a trader
 * Controls steal range
 * 
 * Higher values = easier to steal, more money theft
 * Lower values = harder to steal, less money theft
 */
export const PIRATE_STEAL_DISTANCE = 50;

/**
 * Amount of money stolen per successful steal
 * Controls economic impact of piracy
 * 
 * Higher values = more money stolen, greater economic disruption
 * Lower values = less money stolen, less economic impact
 */
export const PIRATE_STEAL_AMOUNT = 1;

/**
 * Energy cost percentage when stealing (as decimal)
 * Pirates lose this percentage of current energy when stealing
 * 
 * Higher values = more energy cost, pirates rest more after stealing
 * Lower values = less energy cost, pirates can steal more frequently
 */
export const PIRATE_STEAL_ENERGY_COST_PERCENT = 0.25; // 25%

/**
 * Interval between laser shots during chase in milliseconds
 * Controls pirate attack frequency
 * 
 * Lower values = more frequent attacks, more damage to traders
 * Higher values = less frequent attacks, less damage
 */
export const PIRATE_LASER_FIRE_INTERVAL_MS = 500;

/**
 * Distance at which a pirate abandons chase when near a destination
 * Prevents pirates from getting stuck near stations/asteroids
 * 
 * Higher values = pirates abandon chase earlier, less disruption
 * Lower values = pirates chase closer to destinations, more disruption
 */
export const PIRATE_CHASE_ABANDON_DISTANCE = 100;

// ============================================================================
// Economic Balance Presets
// ============================================================================

/**
 * Economic balance presets for quick tuning
 * These can be used to quickly switch between different economic scenarios
 */
export const ECONOMY_PRESETS = {
  /**
   * Default balanced economy
   */
  BALANCED: {
    TRADE_MONEY_AMOUNT: 2,
    PRODUCT_BUY_PRICE: 1,
    PRODUCT_SELL_PRICE: 2,
    WORK_EARNINGS: 3,
    SOCIALIZE_MONEY_THRESHOLD: 50,
  },
  
  /**
   * High inflation economy - more money in circulation
   */
  HIGH_INFLATION: {
    TRADE_MONEY_AMOUNT: 3,
    PRODUCT_BUY_PRICE: 1,
    PRODUCT_SELL_PRICE: 3,
    WORK_EARNINGS: 5,
    SOCIALIZE_MONEY_THRESHOLD: 50,
  },
  
  /**
   * Deflationary economy - tighter money supply
   */
  DEFLATIONARY: {
    TRADE_MONEY_AMOUNT: 1,
    PRODUCT_BUY_PRICE: 1,
    PRODUCT_SELL_PRICE: 1,
    WORK_EARNINGS: 2,
    SOCIALIZE_MONEY_THRESHOLD: 30,
  },
  
  /**
   * Fast-paced economy - quicker transactions
   */
  FAST_PACED: {
    MINING_DELAY_MS: 1500,
    TRADING_DELAY_MS: 2500,
    SOCIALIZING_DELAY_MS: 2500,
    SHOPPING_DELAY_MS: 1500,
    SELLING_DELAY_MS: 1500,
  },
  
  /**
   * Slow-paced economy - longer transaction times
   */
  SLOW_PACED: {
    MINING_DELAY_MS: 6000,
    TRADING_DELAY_MS: 10000,
    SOCIALIZING_DELAY_MS: 10000,
    SHOPPING_DELAY_MS: 6000,
    SELLING_DELAY_MS: 6000,
  },
} as const;

