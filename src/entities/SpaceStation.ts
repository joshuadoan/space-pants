import { Color, Vector } from "excalibur";

import type { Game } from "./Game";
import {
  ORE_PER_PRODUCT,
  SPACE_STATION_CONVERSION_DELAY_MS,
  SPACE_STATION_MIN_ORE_THRESHOLD,
  SPACE_STATION_ORE_REGENERATION_AMOUNT,
  SPACE_STATION_PRODUCTION_INTERVAL_SECONDS,
  SPACE_STATION_REGENERATION_RATE_MS,
  SPACE_STATION_SIZE,
  SPACE_STATION_STARTING_MONEY,
} from "./game-config";
import { Meeple } from "./Meeple/Meeple";
import { getRandomVisitor } from "./Meeple/meepleFinders";
import { MeepleStateType, MeepleType, Products, Resources } from "./types";
import {
  updateRegeneration,
  type RegenerationConfig,
  type RegenerationState,
} from "./utils/regenerationUtils";

// Color palette for space stations
export const STATION_COLORS = [
  Color.fromHex("#4A90E2"), // Blue
  Color.fromHex("#7B68EE"), // Slate blue
  Color.fromHex("#32CD32"), // Lime green
  Color.fromHex("#FFD700"), // Gold
  Color.fromHex("#FF6347"), // Tomato
  Color.fromHex("#9370DB"), // Medium purple
  Color.fromHex("#00CED1"), // Dark turquoise
  Color.fromHex("#FF8C00"), // Dark orange
  Color.fromHex("#20B2AA"), // Light sea green
  Color.fromHex("#DC143C"), // Crimson
  Color.fromHex("#4169E1"), // Royal blue
  Color.fromHex("#FF1493"), // Deep pink
];

export class SpaceStation extends Meeple {
  private lastProductionTime: number = 0;
  private conversionStartTime: number = 0;
  private regenerationState: RegenerationState = { lastRegenerationTime: 0 };
  private readonly regenerationConfig: RegenerationConfig = {
    goodType: Resources.Ore,
    minThreshold: SPACE_STATION_MIN_ORE_THRESHOLD,
    maxThreshold: SPACE_STATION_MIN_ORE_THRESHOLD,
    amountPerCycle: SPACE_STATION_ORE_REGENERATION_AMOUNT,
    rateMs: SPACE_STATION_REGENERATION_RATE_MS,
  };

  constructor(position: Vector, name: string, productType: Products) {
    // Call super with position, speed (0 for stationary stations), name, productType, and size
    super(position, 0, name, productType, SPACE_STATION_SIZE.WIDTH, SPACE_STATION_SIZE.HEIGHT);

    // Set type explicitly (required for production builds where constructor.name is minified)
    this.type = MeepleType.SpaceStation;

    // Set starting money
    this.goods[Resources.Money] = SPACE_STATION_STARTING_MONEY;
  }

  onPreUpdate(engine: Game): void {
    super.onPreUpdate(engine);

    // Update ore regeneration using the abstracted utility
    this.regenerationState = updateRegeneration(
      this.goods,
      this.regenerationConfig,
      this.regenerationState
    );

    // Initialize lastProductionTime on first update
    if (this.lastProductionTime === 0) {
      this.lastProductionTime = Date.now();
      return;
    }

    const currentTime = Date.now();

    // Check if we're currently converting
    if (this.state.type === MeepleStateType.Converting) {
      const elapsedConversionTime = currentTime - this.conversionStartTime;
      
      // If conversion delay has passed, complete the conversion
      if (elapsedConversionTime >= SPACE_STATION_CONVERSION_DELAY_MS) {
        const oreAmount = this.goods[Resources.Ore] || 0;
        const productionRate = Math.floor(oreAmount / ORE_PER_PRODUCT);

        if (productionRate > 0) {
          // Generate only the specific product type this station produces
          this.goods[this.productType] = (this.goods[this.productType] || 0) + productionRate;

          // Deduct ore used for production
          const oreToDeduct = productionRate * ORE_PER_PRODUCT;
          this.goods[Resources.Ore] = Math.max(
            0,
            (this.goods[Resources.Ore] || 0) - oreToDeduct
          );
        }

        // Reset state after conversion completes
        if (this.visitors.size > 1) {
          const randomVisitor = getRandomVisitor(this);
          if (randomVisitor) {
            this.state = {
              type: MeepleStateType.Transacting,
              target: randomVisitor,
            };
          } else {
            this.state = {
              type: MeepleStateType.Idle,
            };
          }
        } else {
          this.state = {
            type: MeepleStateType.Idle,
          };
        }

        this.lastProductionTime = currentTime;
      }
      return; // Don't start new conversion while already converting
    }

    const elapsedSeconds = (currentTime - this.lastProductionTime) / 1000;

    // Check if it's time to start a new conversion
    if (elapsedSeconds >= SPACE_STATION_PRODUCTION_INTERVAL_SECONDS) {
      const oreAmount = this.goods[Resources.Ore] || 0;
      const productionRate = Math.floor(oreAmount / ORE_PER_PRODUCT);

      if (productionRate > 0) {
        // Start converting state
        this.state = {
          type: MeepleStateType.Converting,
          productType: this.productType,
        };
        this.conversionStartTime = currentTime;
      } else {
        // No ore to convert, update lastProductionTime and set state
        this.lastProductionTime = currentTime;
        if (this.visitors.size > 1) {
          const randomVisitor = getRandomVisitor(this);
          if (randomVisitor) {
            this.state = {
              type: MeepleStateType.Transacting,
              target: randomVisitor,
            };
          } else {
            this.state = {
              type: MeepleStateType.Idle,
            };
          }
        } else {
          this.state = {
            type: MeepleStateType.Idle,
          };
        }
      }
    }
  }
}
