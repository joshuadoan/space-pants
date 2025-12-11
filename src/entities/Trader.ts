import { Resources } from "../types";
import type { Vector } from "excalibur";
import { Meeple } from "./Meeple";
import { TRADER_RULES } from "./ruleTemplates";
import { DEFAULT_SHIP_SPEED } from "../consts";
const INITIAL_MONEY = 10;

export class Trader extends Meeple {
  constructor(position: Vector, speed: number, name: string) {
    super(position, speed, name);
    // Initialize with money
    this.goods[Resources.Money] = INITIAL_MONEY;
    this.speed = DEFAULT_SHIP_SPEED;
    this.rules = TRADER_RULES;
  }
}
