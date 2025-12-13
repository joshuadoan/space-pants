import type { GoodType } from "../types";

/**
 * Configuration for goods regeneration
 */
export interface RegenerationConfig {
  /** The type of good to regenerate */
  goodType: GoodType;
  /** Minimum threshold - regeneration only occurs when current amount is below this */
  minThreshold: number;
  /** Maximum threshold - regeneration caps at this value */
  maxThreshold: number;
  /** Amount to regenerate per cycle */
  amountPerCycle: number;
  /** Regeneration rate in milliseconds */
  rateMs: number;
}

/**
 * State tracker for regeneration timing
 */
export interface RegenerationState {
  lastRegenerationTime: number;
}

/**
 * Updates goods regeneration based on configuration.
 * Regenerates goods when below minThreshold, up to maxThreshold.
 *
 * @param goods - The goods object to update
 * @param config - Regeneration configuration
 * @param state - Regeneration state tracker (should be persisted in the entity)
 * @returns Updated regeneration state
 */
export function updateRegeneration(
  goods: Partial<Record<GoodType, number>>,
  config: RegenerationConfig,
  state: RegenerationState
): RegenerationState {
  const currentAmount = goods[config.goodType] || 0;

  // Only regenerate if below min threshold
  if (currentAmount < config.minThreshold) {
    const currentTime = Date.now();

    // Initialize lastRegenerationTime if not set
    if (state.lastRegenerationTime === 0) {
      state.lastRegenerationTime = currentTime;
      return state;
    }

    // Check if enough time has passed since last regeneration
    const timeSinceLastRegeneration = currentTime - state.lastRegenerationTime;
    if (timeSinceLastRegeneration >= config.rateMs) {
      // Add regenerated amount, but cap at max threshold
      const newAmount = Math.min(
        currentAmount + config.amountPerCycle,
        config.maxThreshold
      );
      goods[config.goodType] = newAmount;
      state.lastRegenerationTime = currentTime;
    }
  } else {
    // Reset regeneration timer when at or above min threshold
    state.lastRegenerationTime = 0;
  }

  return state;
}

