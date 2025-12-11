import { Resources } from "../types";
import type { Vector } from "excalibur";
import { Meeple } from "./Meeple";
import { TRADER_RULES } from "./ruleTemplates";
const INITIAL_MONEY = 10;

export class Trader extends Meeple {
  constructor(position: Vector, speed: number, name: string) {
    super(position, speed, name);
    // Initialize with money
    this.goods[Resources.Money] = INITIAL_MONEY;
    this.speed = 100;
    this.rules = TRADER_RULES;
  }
}
