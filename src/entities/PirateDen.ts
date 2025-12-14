import { Vector } from "excalibur";

import { PIRATE_DEN_SIZE } from "./game-config";
import { Meeple } from "./Meeple/Meeple";
import { MeepleType, Products } from "./types";

export class PirateDen extends Meeple {
  constructor(position: Vector, name: string, productType?: Products) {
    // Assign random product type if not provided
    const randomProductType = productType || Object.values(Products)[Math.floor(Math.random() * Object.values(Products).length)];
    // Call super with position, speed (0 for stationary den), name, productType, and size
    super(position, 0, name, randomProductType, PIRATE_DEN_SIZE.WIDTH, PIRATE_DEN_SIZE.HEIGHT);

    // Set type explicitly (required for production builds where constructor.name is minified)
    this.type = MeepleType.PirateDen;
  }
}

