import { Color, Polygon, Vector, GraphicsGroup } from "excalibur";

// Asteroid color palette - various shades of gray and brown
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

export function createAsteroidGraphic(): GraphicsGroup {
  // Randomize size for variety
  const baseSize = 8 + Math.random() * 8; // 8-16 pixels
  const actualSize = baseSize * (0.8 + Math.random() * 0.4); // 80% to 120% of base size
  
  // Random number of points for angular shape (6-9 points)
  const points = 6 + Math.floor(Math.random() * 4);
  
  // Select random color from asteroid palette
  const asteroidColor = ASTEROID_COLORS[Math.floor(Math.random() * ASTEROID_COLORS.length)];
  
  // Create irregular asteroid shape
  const asteroidPoints = createAsteroidPoints(actualSize, points);
  
  const asteroidPolygon = new Polygon({
    points: asteroidPoints,
    color: asteroidColor,
  });
  
  // Return as GraphicsGroup for consistency with other entity graphics
  return new GraphicsGroup({
    members: [{
      graphic: asteroidPolygon,
      offset: Vector.Zero,
    }],
  });
}

