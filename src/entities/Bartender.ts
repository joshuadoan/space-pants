import type { Vector } from "excalibur";

import { DEFAULT_SHIP_SPEED } from "./game-config";
import { Meeple } from "./Meeple/Meeple";
import { BARTENDER_RULES, mergeRulesWithDefaults } from "./ruleTemplates";
import { MeepleType, Products, Resources } from "./types";

export class Bartender extends Meeple {
  constructor(position: Vector, speed: number, name: string, productType?: Products) {
    // Assign random product type if not provided
    const randomProductType = productType || Object.values(Products)[Math.floor(Math.random() * Object.values(Products).length)];
    super(position, speed, name, randomProductType);

    // Set type explicitly (required for production builds where constructor.name is minified)
    this.type = MeepleType.Bartender;

    this.speed = DEFAULT_SHIP_SPEED;
    this.goods[Resources.Ore] = 0;
    this.goods[Resources.Money] = 0;
    this.rules = mergeRulesWithDefaults(BARTENDER_RULES);
  }
}

