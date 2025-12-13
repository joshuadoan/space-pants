import { Vector } from "excalibur";
import { Meeple } from "./Meeple/Meeple";
import { Products, MeepleType } from "./types";
import {
  SPACE_APARTMENTS_MAX_CAPACITY,
  SPACE_APARTMENTS_SIZE,
} from "./game-config";

export class SpaceApartments extends Meeple {
  public maxCapacity: number = SPACE_APARTMENTS_MAX_CAPACITY;

  constructor(position: Vector, name: string, productType?: Products) {
    // Assign random product type if not provided
    const randomProductType = productType || Object.values(Products)[Math.floor(Math.random() * Object.values(Products).length)];
    // Call super with position, speed (0 for stationary apartments), name, productType, and size
    super(position, 0, name, randomProductType, SPACE_APARTMENTS_SIZE.WIDTH, SPACE_APARTMENTS_SIZE.HEIGHT);

    // Set type explicitly (required for production builds where constructor.name is minified)
    this.type = MeepleType.SpaceApartments;
  }

  /**
   * Check if the apartments have room for more visitors
   */
  hasCapacity(): boolean {
    return this.visitors.size < this.maxCapacity;
  }
}

