import { Color, Vector } from "excalibur";
import { createRandomSpaceStation } from "./createRandomSpaceStation";
import { Products, Resources } from "./types";
import { Meeple } from "./Meeple";
import type { Game } from "./Game";
import { MeepleStateType } from "./types";

// Color palette for space stations
export const STATION_COLORS = [
  Color.fromHex("#4A90E2"), // Blue
  Color.fromHex("#7B68EE"), // Slate blue
  Color.fromHex("#32CD32"), // Lime green
  Color.fromHex("#FFD700"), // Gold
  Color.fromHex("#FF6347"), // Tomato
  Color.fromHex("#9370DB"), // Medium purple
  Color.fromHex("#00CED1"), // Dark turquoise
  Color.fromHex("#FF8C00"), // Dark orange
  Color.fromHex("#20B2AA"), // Light sea green
  Color.fromHex("#DC143C"), // Crimson
  Color.fromHex("#4169E1"), // Royal blue
  Color.fromHex("#FF1493"), // Deep pink
];

export class SpaceStation extends Meeple {
  private lastProductionTime: number = 0;

  constructor(position: Vector, name: string) {
    // Call super with position, speed (0 for stationary stations), name, and size
    super(position, 0, name, 60, 60);

    // Initialize all products to 0
    Object.values(Products).forEach((product) => {
      this.goods[product] = 0;
    });

    // Create unique space station design
    const stationDesign = createRandomSpaceStation();
    this.graphics.add(stationDesign);
  }

  onPreUpdate(engine: Game): void {
    super.onPreUpdate(engine);

    // Initialize lastProductionTime on first update
    if (this.lastProductionTime === 0) {
      this.lastProductionTime = Date.now();
      return;
    }

    const currentTime = Date.now();
    const elapsedSeconds = (currentTime - this.lastProductionTime) / 1000;

    // Generate products every second based on ore
    if (elapsedSeconds >= 1) {
      const oreAmount = this.goods[Resources.Ore] || 0;
      const productionRate = Math.floor(oreAmount / 10); // One product per 10 ore

      if (productionRate > 0) {
        // Generate random products (not ore or money)
        const productTypes = Object.values(Products);
        for (let i = 0; i < productionRate; i++) {
          const randomProduct =
            productTypes[Math.floor(Math.random() * productTypes.length)];
          this.goods[randomProduct] = (this.goods[randomProduct] || 0) + 1;
        }

        // Deduct ore used for production (10 ore per product)
        const oreToDeduct = productionRate * 10;
        this.goods[Resources.Ore] = Math.max(
          0,
          (this.goods[Resources.Ore] || 0) - oreToDeduct
        );
      }

      this.lastProductionTime = currentTime;

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
  }
}
