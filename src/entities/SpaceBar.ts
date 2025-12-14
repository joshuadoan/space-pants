import { Vector } from "excalibur";

import type { Game } from "./Game";
import {
  FIZZ_PRICE,
  SPACE_BAR_FIZZ_REGENERATION_AMOUNT,
  SPACE_BAR_FIZZ_REGENERATION_RATE_MS,
  SPACE_BAR_MIN_FIZZ_THRESHOLD,
  SPACE_BAR_SIZE,
  SPACE_BAR_STARTING_FIZZ,
} from "./game-config";
import { Meeple } from "./Meeple/Meeple";
import { getRandomVisitor } from "./Meeple/meepleFinders";
import { MeepleStateType, MeepleType, Products, Resources, type GoodType } from "./types";
import {
  updateRegeneration,
  type RegenerationConfig,
  type RegenerationState,
} from "./utils/regenerationUtils";

export class SpaceBar extends Meeple {
  public prices: Map<GoodType, number> = new Map();
  private regenerationState: RegenerationState = { lastRegenerationTime: 0 };
  private readonly regenerationConfig: RegenerationConfig = {
    goodType: Products.Fizz,
    minThreshold: SPACE_BAR_MIN_FIZZ_THRESHOLD,
    maxThreshold: SPACE_BAR_MIN_FIZZ_THRESHOLD,
    amountPerCycle: SPACE_BAR_FIZZ_REGENERATION_AMOUNT,
    rateMs: SPACE_BAR_FIZZ_REGENERATION_RATE_MS,
  };

  constructor(position: Vector, name: string, productType?: Products) {
    // Assign random product type if not provided
    const randomProductType = productType || Object.values(Products)[Math.floor(Math.random() * Object.values(Products).length)];
    super(position, 0, name, randomProductType, SPACE_BAR_SIZE.WIDTH, SPACE_BAR_SIZE.HEIGHT);
    
    // Set type explicitly (required for production builds where constructor.name is minified)
    this.type = MeepleType.SpaceBar;
    
    // Initialize with fizz stock
    this.goods = {
      [Products.Fizz]: SPACE_BAR_STARTING_FIZZ,
      [Resources.Money]: 0,
    };

    // Set price for fizz
    this.prices.set(Products.Fizz, FIZZ_PRICE);
  }

  transaction(good: GoodType, quantity: number, transactionType: "add" | "remove") {
    switch (transactionType) {
      case "add":
        // SpaceBar buys goods (adds to inventory) - not typically used
        this.goods[good] = (this.goods[good] ?? 0) + quantity;
        break;
      case "remove":
        // SpaceBar sells goods (subtracts from inventory)
        const currentGood = this.goods[good] ?? 0;
        if (currentGood >= quantity) {
          this.goods[good] = currentGood - quantity;
        }
        break;
    }
  }

  onPreUpdate(engine: Game): void {
    super.onPreUpdate(engine);

    // Update fizz regeneration - restock when low
    this.regenerationState = updateRegeneration(
      this.goods,
      this.regenerationConfig,
      this.regenerationState
    );

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
    }
  }
}

