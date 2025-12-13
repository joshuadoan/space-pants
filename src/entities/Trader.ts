import { Resources } from "./types";
import type { Vector } from "excalibur";
import { Meeple } from "./Meeple";
import { TRADER_RULES } from "./ruleTemplates";
import { DEFAULT_SHIP_SPEED, TRADER_STARTING_MONEY } from "./game-config";
import { createTraderShipOutOfShapes } from "./utils/createSpaceShipOutOfShapes";

export class Trader extends Meeple {
  constructor(position: Vector, speed: number, name: string) {
    super(position, speed, name);
    // Initialize with money
    this.goods[Resources.Money] = TRADER_STARTING_MONEY;
    this.speed = DEFAULT_SHIP_SPEED;
    this.rules = TRADER_RULES;

    // Override graphics with trader-specific style
    const traderDesign = createTraderShipOutOfShapes();
    this.graphics.use(traderDesign);
  }
}
