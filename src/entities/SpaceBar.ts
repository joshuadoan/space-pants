import { Vector, Rectangle, GraphicsGroup, Color } from "excalibur";
import { Meeple } from "./Meeple";
import { Products, Resources, type GoodType } from "../types";

import { MeepleStateType } from "./types";
import type { Game } from "./Game";
const FIZZ_PRICE = 50; // Price per fizz
const INITIAL_FIZZ_STOCK = 100; // Starting stock of fizz

export class SpaceBar extends Meeple {
  public prices: Map<GoodType, number> = new Map();

  constructor(position: Vector, name: string) {
    super(position, 0, name, 30, 20);
    
    // Initialize with fizz stock
    this.goods = {
      [Products.Fizz]: INITIAL_FIZZ_STOCK,
      [Resources.Money]: 0,
    };

    // Set price for fizz
    this.prices.set(Products.Fizz, FIZZ_PRICE);

    // Create a bar-like design (horizontal rectangle with some details)
    const barDesign = this.createBarDesign();
    this.graphics.add(barDesign);
  }

  transaction(good: GoodType, quantity: number, transactionType: "add" | "remove") {
    switch (transactionType) {
      case "add":
        // SpaceBar buys goods (adds to inventory) - not typically used
        this.goods[good] = (this.goods[good] ?? 0) + quantity;
        break;
      case "remove":
        // SpaceBar sells goods (subtracts from inventory)
        const currentGood = this.goods[good] ?? 0;
        if (currentGood >= quantity) {
          this.goods[good] = currentGood - quantity;
        }
        break;
    }
  }

  onPreUpdate(engine: Game): void {
    super.onPreUpdate(engine);

    if (this.visitors.size > 1) {
      const randomVisitor = this.getRandomVisitor();
      if (randomVisitor) {
        this.state = {
          type: MeepleStateType.Transacting,
          target: randomVisitor,
        };
      } else {
        this.state = {
          type: MeepleStateType.Idle,
        };
      }
    }
  }

  private createBarDesign(): GraphicsGroup {
    const primaryColor = Color.fromHex("#FFD700"); // Gold color
    const secondaryColor = Color.fromHex("#FFA500"); // Orange color
    const accentColor = Color.fromHex("#FFFFFF"); // White for highlights

    const blocks: { rect: Rectangle; offset: Vector }[] = [];
    
    // Main bar body (horizontal rectangle)
    blocks.push({ 
      rect: new Rectangle({ width: 24, height: 8, color: primaryColor }), 
      offset: new Vector(0, 0) 
    });
    
    // Left end cap
    blocks.push({ 
      rect: new Rectangle({ width: 4, height: 8, color: secondaryColor }), 
      offset: new Vector(-14, 0) 
    });
    
    // Right end cap
    blocks.push({ 
      rect: new Rectangle({ width: 4, height: 8, color: secondaryColor }), 
      offset: new Vector(14, 0) 
    });
    
    // Top highlight
    blocks.push({ 
      rect: new Rectangle({ width: 20, height: 2, color: accentColor }), 
      offset: new Vector(0, -3) 
    });
    
    // Bottom highlight
    blocks.push({ 
      rect: new Rectangle({ width: 20, height: 2, color: accentColor }), 
      offset: new Vector(0, 3) 
    });

    return new GraphicsGroup({
      members: blocks.map(block => ({
        graphic: block.rect,
        offset: block.offset,
      })),
    });
  }
}

