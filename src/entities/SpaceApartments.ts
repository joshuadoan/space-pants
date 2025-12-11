import { Vector, Rectangle, GraphicsGroup, Color } from "excalibur";
import { Meeple } from "./Meeple";
import { Resources } from "../types";

const MAX_CAPACITY = 5; // Maximum number of visitors at once

export class SpaceApartments extends Meeple {
  public maxCapacity: number = MAX_CAPACITY;

  constructor(position: Vector, name: string) {
    // Call super with position, speed (0 for stationary apartments), name, and size
    super(position, 0, name, 50, 40);

    // Start with zero goods
    this.goods = {
      [Resources.Ore]: 0,
      [Resources.Money]: 0,
    };

    // Create an apartment building design
    const apartmentDesign = this.createApartmentDesign();
    this.graphics.add(apartmentDesign);
  }

  /**
   * Check if the apartments have room for more visitors
   */
  hasCapacity(): boolean {
    return this.visitors.size < this.maxCapacity;
  }

  /**
   * Create a visual design for the apartment building
   */
  private createApartmentDesign(): GraphicsGroup {
    const buildingColor = Color.fromHex("#4A5568"); // Dark gray-blue
    const windowColor = Color.fromHex("#FFD700"); // Gold/yellow for lit windows
    const windowDarkColor = Color.fromHex("#2D3748"); // Dark for unlit windows
    const roofColor = Color.fromHex("#2C3E50"); // Darker blue-gray for roof

    const blocks: { rect: Rectangle; offset: Vector }[] = [];
    
    // Main building body (tall rectangle)
    blocks.push({ 
      rect: new Rectangle({ width: 40, height: 30, color: buildingColor }), 
      offset: new Vector(0, 5) 
    });
    
    // Roof (triangular/trapezoid shape approximated with rectangle)
    blocks.push({ 
      rect: new Rectangle({ width: 44, height: 6, color: roofColor }), 
      offset: new Vector(0, -10) 
    });
    
    // Windows - create a grid pattern
    const windowSize = 6;
    const windowSpacing = 10;
    const startX = -15;
    const startY = -5;
    
    // First floor windows (3 windows)
    for (let i = 0; i < 3; i++) {
      const isLit = Math.random() > 0.3; // 70% chance of being lit
      blocks.push({ 
        rect: new Rectangle({ 
          width: windowSize, 
          height: windowSize, 
          color: isLit ? windowColor : windowDarkColor 
        }), 
        offset: new Vector(startX + i * windowSpacing, startY) 
      });
    }
    
    // Second floor windows (3 windows)
    for (let i = 0; i < 3; i++) {
      const isLit = Math.random() > 0.3; // 70% chance of being lit
      blocks.push({ 
        rect: new Rectangle({ 
          width: windowSize, 
          height: windowSize, 
          color: isLit ? windowColor : windowDarkColor 
        }), 
        offset: new Vector(startX + i * windowSpacing, startY - 12) 
      });
    }
    
    // Door at the bottom center
    blocks.push({ 
      rect: new Rectangle({ width: 8, height: 10, color: Color.fromHex("#1A202C") }), 
      offset: new Vector(0, 15) 
    });

    return new GraphicsGroup({
      members: blocks.map(block => ({
        graphic: block.rect,
        offset: block.offset,
      })),
    });
  }
}

