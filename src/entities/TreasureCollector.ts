import type { Vector } from "excalibur";
import { Meeple } from "./Meeple";
import { Resources } from "./types";
import { DEFAULT_SHIP_SPEED } from "../consts";
import { createTreasureCollectorShipOutOfShapes } from "./utils/createSpaceShipOutOfShapes";

export class TreasureCollector extends Meeple {
  constructor(position: Vector, speed: number, name: string) {
    super(position, speed, name);

    // Override graphics with treasure collector-specific style
    const treasureCollectorDesign = createTreasureCollectorShipOutOfShapes();
    this.graphics.use(treasureCollectorDesign);

    this.speed = DEFAULT_SHIP_SPEED;
    this.goods[Resources.Ore] = 0;
    this.goods[Resources.Money] = 0;
    this.goods[Resources.Treasure] = 0;
    this.rules = []; // No rules by default, can be added later
  }
}

