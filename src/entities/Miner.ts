import type { Vector } from "excalibur";
import { Meeple } from "./Meeple";
import { Resources } from "../types";
import { MINER_RULES } from "./ruleTemplates";

export class Miner extends Meeple {
  constructor(position: Vector, speed: number, name: string) {
    super(position, speed, name);

    this.speed = 100;
    this.goods[Resources.Ore] = 0;
    this.goods[Resources.Money] = 0;
    this.rules = MINER_RULES;
  }
}
