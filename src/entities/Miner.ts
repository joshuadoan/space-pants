import type { Vector } from "excalibur";
import { Meeple } from "./Meeple";
import { Resources } from "./types";
import { MINER_RULES } from "./ruleTemplates";
import { DEFAULT_SHIP_SPEED } from "./game-config";
import { createMinerShipOutOfShapes } from "./utils/createSpaceShipOutOfShapes";

export class Miner extends Meeple {
  constructor(position: Vector, speed: number, name: string) {
    super(position, speed, name);

    // Override graphics with miner-specific style
    const minerDesign = createMinerShipOutOfShapes();
    this.graphics.use(minerDesign);

    this.speed = DEFAULT_SHIP_SPEED;
    this.goods[Resources.Ore] = 0;
    this.goods[Resources.Money] = 0;
    this.rules = MINER_RULES;
  }
}
