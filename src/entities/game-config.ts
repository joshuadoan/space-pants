import { Resources, Products } from "./types";

/**
 * Centralized game configuration constants.
 * All game-related settings, entity counts, starting values, and gameplay parameters
 * should be defined here for easy adjustment and maintenance.
 */

// ============================================================================
// World Configuration
// ============================================================================

/** Width of the game world in pixels */
export const WORLD_WIDTH = 2500;

/** Height of the game world in pixels */
export const WORLD_HEIGHT = 2500;

/** Initial camera zoom level */
export const CAMERA_ZOOM = 2;

// ============================================================================
// Entity Counts
// ============================================================================

/** Number of each entity type to spawn in the game world */
export const ENTITY_COUNTS = {
  TRADERS: 50,
  SPACE_STATIONS: Object.values(Products).length,
  ASTEROIDS: 5,
  MINERS: 5,
  SPACE_BARS: 2,
  SPACE_APARTMENTS: 2,
  BARTENDERS_PER_BAR: 1,
  PIRATES: 3,
  PIRATE_DENS: 1,
} as const;

// ============================================================================
// Entity Sizes
// ============================================================================

/** Default meeple size */
export const MEEPLE_SIZE = {
  WIDTH: 20,
  HEIGHT: 20,
} as const;

/** Space station size */
export const SPACE_STATION_SIZE = {
  WIDTH: 60,
  HEIGHT: 60,
} as const;

/** Space bar size */
export const SPACE_BAR_SIZE = {
  WIDTH: 30,
  HEIGHT: 20,
} as const;

/** Space apartments size */
export const SPACE_APARTMENTS_SIZE = {
  WIDTH: 50,
  HEIGHT: 40,
} as const;

/** Pirate den size */
export const PIRATE_DEN_SIZE = {
  WIDTH: 40,
  HEIGHT: 40,
} as const;

/** Asteroid size range */
export const ASTEROID_SIZE_RANGE = {
  MIN: 15,
  MAX: 30,
} as const;

// ============================================================================
// Movement & Speed
// ============================================================================

/** Default ship speed for all moving entities */
export const DEFAULT_SHIP_SPEED = 100;

// ============================================================================
// Starting Stats & Resources
// ============================================================================

/** Default starting health for all meeples */
export const DEFAULT_HEALTH = 100;

/** Default starting energy for all meeples */
export const DEFAULT_ENERGY = 100;

/** Starting money for traders */
export const TRADER_STARTING_MONEY = 1; // Traders can start with minimal capital and grow from there

/** Starting money for space stations */
export const SPACE_STATION_STARTING_MONEY = 42;

/** Starting ore for asteroids */
export const ASTEROID_STARTING_ORE = 1;

/** Starting fizz stock for space bars */
export const SPACE_BAR_STARTING_FIZZ = 1;

/** Minimum fizz threshold for space bar regeneration */
export const SPACE_BAR_MIN_FIZZ_THRESHOLD = 5;

/** Space bar fizz regeneration rate in milliseconds */
export const SPACE_BAR_FIZZ_REGENERATION_RATE_MS = 2000;

/** Amount of fizz regenerated per cycle at space bars */
export const SPACE_BAR_FIZZ_REGENERATION_AMOUNT = 1;

// ============================================================================
// Trading & Economy
// ============================================================================

/** Amount of ore mined per mining action */
export const MINING_ORE_AMOUNT = 1;

/** Amount of ore traded per trade action */
export const TRADE_ORE_AMOUNT = 1;

/** Amount of money received per ore trade */
export const TRADE_MONEY_AMOUNT = 2; // Ore is worth 2x its value

/** Amount of money earned per work session (bartenders) */
export const WORK_EARNINGS = 3; // Bartenders earn more per work session

/** Price per fizz at space bars */
export const FIZZ_PRICE = 1;

/** Price per product when buying from producing station */
export const PRODUCT_BUY_PRICE = 1; // Products cost 1 where they are created

/** Price per product when selling to non-producing space station */
export const PRODUCT_SELL_PRICE = 2; // Products sell for 2 where they are not created

// ============================================================================
// Production & Regeneration
// ============================================================================

/** Ore required per product produced at space stations */
export const ORE_PER_PRODUCT = 1;

/** Minimum ore threshold for asteroid regeneration */
export const ASTEROID_MIN_ORE_THRESHOLD = 100;

/** Asteroid regeneration rate in milliseconds */
export const ASTEROID_REGENERATION_RATE_MS = 1000;

/** Space station production check interval in seconds */
export const SPACE_STATION_PRODUCTION_INTERVAL_SECONDS = 0.5; // Produce 2x faster

/** Minimum ore threshold for space station regeneration */
export const SPACE_STATION_MIN_ORE_THRESHOLD = 50;

/** Space station ore regeneration rate in milliseconds */
export const SPACE_STATION_REGENERATION_RATE_MS = 1000;

/** Amount of ore regenerated per cycle at space stations */
export const SPACE_STATION_ORE_REGENERATION_AMOUNT = 2; // Regenerate 2x faster

// ============================================================================
// Action Delays & Timings
// ============================================================================

/** Delay for mining action in milliseconds */
export const MINING_DELAY_MS = 3000;

/** Delay for trading action in milliseconds */
export const TRADING_DELAY_MS = 5000;

/** Delay for socializing action in milliseconds */
export const SOCIALIZING_DELAY_MS = 5000;

/** Delay for working action in milliseconds */
export const WORKING_DELAY_MS = 30000; // 30 seconds for bartenders on shift

/** Delay for chilling at home action in milliseconds */
export const CHILLING_DELAY_MS = 3000;

/** Delay for shopping action in milliseconds */
export const SHOPPING_DELAY_MS = 3000;

/** Delay for selling action in milliseconds */
export const SELLING_DELAY_MS = 3000;

/** Delay for space station converting ore to product in milliseconds */
export const SPACE_STATION_CONVERSION_DELAY_MS = 3000;

/** Energy cost per patrol movement for pirates */
export const PIRATE_PATROL_ENERGY_COST = 10;

/** Delay for patrolling action in milliseconds */
export const PATROLLING_DELAY_MS = 2000;

/** Delay for resting at pirate den in milliseconds */
export const PIRATE_DEN_REST_DELAY_MS = 5000;

/** Distance at which a pirate detects and starts chasing a trader */
export const PIRATE_CHASE_DETECTION_DISTANCE = 150;

/** Duration for which a pirate chases a trader in milliseconds */
export const PIRATE_CHASE_DURATION_MS = 5000;

/** Distance at which a pirate can steal money from a trader */
export const PIRATE_STEAL_DISTANCE = 50;

/** Default transaction time in milliseconds */
export const DEFAULT_TRANSACTION_TIME_MS = 1000;

/** Meeple rule evaluation interval in milliseconds */
export const MEEPLE_UPDATE_INTERVAL_MS = 1000;

// ============================================================================
// Visual & UI
// ============================================================================

/** Base distance for follower entities */
export const FOLLOWER_BASE_DISTANCE = 30;

/** Additional distance per follower index */
export const FOLLOWER_DISTANCE_INCREMENT = 5;

/** Follower size (width and height) */
export const FOLLOWER_SIZE = 4;

// ============================================================================
// Capacity & Limits
// ============================================================================

/** Maximum number of visitors at space apartments */
export const SPACE_APARTMENTS_MAX_CAPACITY = 5;

// ============================================================================
// React State Update Intervals
// ============================================================================

/** Interval in milliseconds for updating the meeple list in React state */
export const MEEPLE_LIST_UPDATE_INTERVAL_MS = 1000;

// ============================================================================
// Canvas Wait Configuration
// ============================================================================

/** Configuration for waiting for the canvas element to appear in the DOM */
export const CANVAS_WAIT_CONFIG = {
  /** Maximum number of retry attempts */
  MAX_RETRIES: 100,
  /** Delay between retries in milliseconds */
  RETRY_DELAY_MS: 10,
} as const;

// ============================================================================
// Starting Goods (for entities that need initial resources)
// ============================================================================

/** Starting goods for miners */
export const MINER_STARTING_GOODS = {
  [Resources.Ore]: 0,
  [Resources.Money]: 0,
} satisfies Partial<Record<string, number>>;

/** Starting goods for traders */
export const TRADER_STARTING_GOODS = {
  [Resources.Money]: TRADER_STARTING_MONEY,
} satisfies Partial<Record<string, number>>;

/** Starting goods for space bars */
export const SPACE_BAR_STARTING_GOODS = {
  [Products.Fizz]: SPACE_BAR_STARTING_FIZZ,
  [Resources.Money]: 0,
} satisfies Partial<Record<string, number>>;

/** Starting goods for players */
export const PLAYER_STARTING_GOODS = {
  [Resources.Money]: 0,
} satisfies Partial<Record<string, number>>;

