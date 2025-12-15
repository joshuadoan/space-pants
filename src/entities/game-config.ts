import { Products } from "./types";

/**
 * Centralized game configuration constants.
 * All game-related settings, entity counts, starting values, and gameplay parameters
 * should be defined here for easy adjustment and maintenance.
 * 
 * Note: Economic parameters are defined in economy-config.ts and re-exported here
 * for backward compatibility. For economy tuning, see economy-config.ts.
 */

// Re-export all economy configuration for backward compatibility
export {
  // Trading & Exchange Rates
  TRADE_MONEY_AMOUNT,
  TRADE_ORE_AMOUNT,
  PRODUCT_BUY_PRICE,
  PRODUCT_SELL_PRICE,
  FIZZ_PRICE,
  // Production & Mining
  ORE_PER_PRODUCT,
  MINING_ORE_AMOUNT,
  SPACE_STATION_PRODUCTION_INTERVAL_SECONDS,
  // Regeneration Systems
  ASTEROID_MIN_ORE_THRESHOLD,
  ASTEROID_REGENERATION_RATE_MS,
  ASTEROID_REGENERATION_AMOUNT,
  SPACE_STATION_MIN_ORE_THRESHOLD,
  SPACE_STATION_REGENERATION_RATE_MS,
  SPACE_STATION_ORE_REGENERATION_AMOUNT,
  SPACE_BAR_MIN_FIZZ_THRESHOLD,
  SPACE_BAR_FIZZ_REGENERATION_RATE_MS,
  SPACE_BAR_FIZZ_REGENERATION_AMOUNT,
  // Starting Resources
  TRADER_STARTING_MONEY,
  SPACE_STATION_STARTING_MONEY,
  ASTEROID_STARTING_ORE,
  SPACE_BAR_STARTING_FIZZ,
  MINER_STARTING_GOODS,
  TRADER_STARTING_GOODS,
  SPACE_BAR_STARTING_GOODS,
  PLAYER_STARTING_GOODS,
  // Work & Earnings
  WORK_EARNINGS,
  // Action Timings
  MINING_DELAY_MS,
  TRADING_DELAY_MS,
  SOCIALIZING_DELAY_MS,
  WORKING_DELAY_MS,
  SHOPPING_DELAY_MS,
  SELLING_DELAY_MS,
  CHILLING_DELAY_MS,
  PIRATE_DEN_REST_DELAY_MS,
  // Behavioral Economic Thresholds
  SOCIALIZE_MONEY_THRESHOLD,
  MINER_SELL_ORE_THRESHOLD,
  BUY_PRODUCT_MONEY_THRESHOLD,
  MECHANIC_SOCIALIZE_MONEY_THRESHOLD,
  MECHANIC_FIX_MONEY_THRESHOLD,
  // Pirate Economic Parameters
  PIRATE_PATROL_ENERGY_COST,
  PATROLLING_DELAY_MS,
  PIRATE_CHASE_DETECTION_DISTANCE,
  PIRATE_CHASE_DURATION_MS,
  PIRATE_STEAL_DISTANCE,
  PIRATE_STEAL_AMOUNT,
  PIRATE_STEAL_ENERGY_COST_PERCENT,
  PIRATE_LASER_FIRE_INTERVAL_MS,
  PIRATE_CHASE_ABANDON_DISTANCE,
  // Economic Balance Presets
  ECONOMY_PRESETS,
} from "./economy-config";

// ============================================================================
// World Configuration
// ============================================================================

/** Width of the game world in pixels */
export const WORLD_WIDTH = 5000;

/** Height of the game world in pixels */
export const WORLD_HEIGHT = 5000;

/** Initial camera zoom level */
export const CAMERA_ZOOM = 2;

// ============================================================================
// Entity Counts
// ============================================================================

/** Number of each entity type to spawn in the game world */
export const ENTITY_COUNTS = {
  TRADERS: 14,
  SPACE_STATIONS: Object.values(Products).length,
  ASTEROIDS: 3,
  MINERS: 14,
  SPACE_BARS: 10,
  SPACE_CAFES: 5,
  SPACE_DANCES: 5,
  SPACE_FUNS: 5,
  SPACE_APARTMENTS: 10,
  BARTENDERS_PER_BAR: 2,
  PIRATES: 30,
  PIRATE_DENS: 1,
  MECHANICS: 5,
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

/** Delay for space station converting ore to product in milliseconds */
export const SPACE_STATION_CONVERSION_DELAY_MS = 3000;

// Note: Pirate economic parameters are exported from economy-config.ts

/** Default transaction time in milliseconds */
export const DEFAULT_TRANSACTION_TIME_MS = 3000;

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

// Note: Starting goods are exported from economy-config.ts

