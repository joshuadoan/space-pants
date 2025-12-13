import type { Vector } from "excalibur";
import { Meeple } from "./Meeple";
import { Resources } from "./types";
import { DEFAULT_SHIP_SPEED } from "./game-config";
import { createBartenderShipOutOfShapes } from "./utils/createSpaceShipOutOfShapes";
import { BARTENDER_RULES } from "./ruleTemplates";

export class Bartender extends Meeple {
  constructor(position: Vector, speed: number, name: string) {
    super(position, speed, name);

    // Override graphics with bartender-specific style
    const bartenderDesign = createBartenderShipOutOfShapes();
    this.graphics.use(bartenderDesign);

    this.speed = DEFAULT_SHIP_SPEED;
    this.goods[Resources.Ore] = 0;
    this.goods[Resources.Money] = 0;
    this.rules = BARTENDER_RULES;
  }
}

