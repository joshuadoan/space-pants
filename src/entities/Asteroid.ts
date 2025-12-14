import { Color, Polygon, Vector } from "excalibur";

import type { Game } from "./Game";
import {
  ASTEROID_MIN_ORE_THRESHOLD,
  ASTEROID_REGENERATION_RATE_MS,
  ASTEROID_STARTING_ORE,
} from "./game-config";
import { Meeple } from "./Meeple/Meeple";
import { getRandomVisitor } from "./Meeple/meepleFinders";
import { MeepleStateType, MeepleType, Products, Resources } from "./types";
import {
  updateRegeneration,
  type RegenerationConfig,
  type RegenerationState,
} from "./utils/regenerationUtils";

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
  private regenerationState: RegenerationState = { lastRegenerationTime: 0 };
  private readonly regenerationConfig: RegenerationConfig = {
    goodType: Resources.Ore,
    minThreshold: ASTEROID_MIN_ORE_THRESHOLD,
    maxThreshold: ASTEROID_MIN_ORE_THRESHOLD,
    amountPerCycle: 1,
    rateMs: ASTEROID_REGENERATION_RATE_MS,
  };

  constructor(position: Vector, size: number = 20, name?: string, productType?: Products) {
    // Randomize size slightly
    const actualSize = size * (0.8 + Math.random() * 0.4); // 80% to 120% of base size

    // Generate a simple name if not provided
    const asteroidName =
      name || `Asteroid ${Math.floor(position.x)}-${Math.floor(position.y)}`;

    // Assign random product type if not provided
    const randomProductType = productType || Object.values(Products)[Math.floor(Math.random() * Object.values(Products).length)];

    // Call super with position, speed (0 for stationary asteroids), name, productType, and size
    super(position, 0, asteroidName, randomProductType, actualSize * 2, actualSize * 2);

    // Set type explicitly (required for production builds where constructor.name is minified)
    this.type = MeepleType.Asteroid;

    // Initialize asteroid with starting ore
    this.goods[Resources.Ore] = ASTEROID_STARTING_ORE;

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

    // Update regeneration using the abstracted utility
    this.regenerationState = updateRegeneration(
      this.goods,
      this.regenerationConfig,
      this.regenerationState
    );

    if (this.visitors.size > 1) {
      const randomVisitor = getRandomVisitor(this);
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
