import { Color, Polygon, Vector } from "excalibur";
import { Meeple } from "./Meeple";
import { Resources } from "../types";
import type { Game } from "./Game";
import { MeepleStateType } from "./types";

// Color palette for asteroids (various shades of gray and brown)
const ASTEROID_COLORS = [
  Color.fromHex("#8B7355"), // Brown gray
  Color.fromHex("#696969"), // Dim gray
  Color.fromHex("#708090"), // Slate gray
  Color.fromHex("#556B2F"), // Dark olive
  Color.fromHex("#5F4F3F"), // Dark brown
  Color.fromHex("#6B6B6B"), // Medium gray
  Color.fromHex("#7A7A7A"), // Light gray
  Color.fromHex("#4A4A4A"), // Dark gray
];

/**
 * Creates random points for an irregular asteroid shape
 */
function createAsteroidPoints(size: number, points: number = 8): Vector[] {
  const asteroidPoints: Vector[] = [];
  const angleStep = (Math.PI * 2) / points;

  for (let i = 0; i < points; i++) {
    // Add some randomness to the radius to make it irregular
    const radiusVariation = 0.7 + Math.random() * 0.3; // 70% to 100% of base size
    const radius = size * radiusVariation;
    const angle = i * angleStep;

    asteroidPoints.push(
      new Vector(Math.cos(angle) * radius, Math.sin(angle) * radius)
    );
  }

  return asteroidPoints;
}

export class Asteroid extends Meeple {
  private lastRegenerationTime: number = 0;
  private readonly REGENERATION_RATE = 1000; // 1 second in milliseconds
  private readonly MIN_ORE_THRESHOLD = 100;

  constructor(position: Vector, size: number = 20, name?: string) {
    // Randomize size slightly
    const actualSize = size * (0.8 + Math.random() * 0.4); // 80% to 120% of base size

    // Generate a simple name if not provided
    const asteroidName =
      name || `Asteroid ${Math.floor(position.x)}-${Math.floor(position.y)}`;

    // Call super with position, speed (0 for stationary asteroids), name, and size
    super(position, 0, asteroidName, actualSize * 2, actualSize * 2);

    // Initialize asteroid with 1000 ore
    this.goods[Resources.Ore] = 1000;

    // Create irregular asteroid shape
    const asteroidPoints = createAsteroidPoints(
      actualSize,
      6 + Math.floor(Math.random() * 4)
    ); // 6-9 points
    const asteroidColor =
      ASTEROID_COLORS[Math.floor(Math.random() * ASTEROID_COLORS.length)];

    const asteroidGraphic = new Polygon({
      points: asteroidPoints,
      color: asteroidColor,
    });

    this.graphics.add(asteroidGraphic);
  }

  onPreUpdate(engine: Game): void {
    // Call parent's onPreUpdate first
    super.onPreUpdate(engine);

    const currentOre = this.goods[Resources.Ore] || 0;

    // If ore is below threshold, regenerate 1 ore per second
    if (currentOre < this.MIN_ORE_THRESHOLD) {
      const currentTime = Date.now();

      // Initialize lastRegenerationTime if not set
      if (this.lastRegenerationTime === 0) {
        this.lastRegenerationTime = currentTime;
      }

      // Check if 1 second has passed since last regeneration
      const timeSinceLastRegeneration = currentTime - this.lastRegenerationTime;
      if (timeSinceLastRegeneration >= this.REGENERATION_RATE) {
        // Add 1 ore, but cap at MIN_ORE_THRESHOLD
        const newOre = Math.min(currentOre + 1, this.MIN_ORE_THRESHOLD);
        this.goods[Resources.Ore] = newOre;
        this.lastRegenerationTime = currentTime;
      }
    } else {
      // Reset regeneration timer when ore is at or above threshold
      this.lastRegenerationTime = 0;
    }

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
