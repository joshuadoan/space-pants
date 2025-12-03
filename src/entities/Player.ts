import type { Vector } from "excalibur";
import { Meeple } from "./Meeple";
import { Resources } from "../types";

export class Player extends Meeple {

  constructor(position: Vector, speed: number, name: string) {
    super(position, speed, name);
    // Player starts with 0 money
    this.goods[Resources.Money] = 0;
  }
}