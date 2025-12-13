import type { Vector } from "excalibur";
import { Meeple } from "./Meeple/Meeple";
import { Resources, Products } from "./types";

export class Player extends Meeple {

  constructor(position: Vector, speed: number, name: string, productType?: Products) {
    // Assign random product type if not provided
    const randomProductType = productType || Object.values(Products)[Math.floor(Math.random() * Object.values(Products).length)];
    super(position, speed, name, randomProductType);
    // Player starts with 0 money
    this.goods[Resources.Money] = 0;
  }
}