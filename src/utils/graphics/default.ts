import { Color, Rectangle, Vector, GraphicsGroup } from "excalibur";

// Color palette for meeples
const MEEPLE_COLORS = [
  Color.Cyan,
  Color.Blue,
  Color.Green,
  Color.Yellow,
  Color.Orange,
  Color.Magenta,
  Color.Red,
  Color.White,
  Color.fromHex("#00FF88"), // Bright green
  Color.fromHex("#FF00FF"), // Bright magenta
  Color.fromHex("#00FFFF"), // Aqua
  Color.fromHex("#FFAA00"), // Gold
];

export function createSpaceShipOutOfShapes(): GraphicsGroup {
  const blocks: { rect: Rectangle; offset: Vector }[] = [];
  
  // Generate a random seed for this meeple design
  const seed = Math.random();
  
  // Select random colors for this meeple
  const primaryColor = MEEPLE_COLORS[Math.floor(Math.random() * MEEPLE_COLORS.length)];
  const secondaryColor = MEEPLE_COLORS[Math.floor(Math.random() * MEEPLE_COLORS.length)];
  const accentColor = MEEPLE_COLORS[Math.floor(Math.random() * MEEPLE_COLORS.length)];
  
  // Meeple design patterns - each creates a different style
  const pattern = Math.floor(seed * 4); // 4 different patterns
  
  switch (pattern) {
    case 0: // Classic fighter - central body with wings
      blocks.push({ rect: new Rectangle({ width: 8, height: 12, color: primaryColor }), offset: new Vector(0, -2) }); // Body
      blocks.push({ rect: new Rectangle({ width: 6, height: 4, color: secondaryColor }), offset: new Vector(-6, 2) }); // Left wing
      blocks.push({ rect: new Rectangle({ width: 6, height: 4, color: secondaryColor }), offset: new Vector(6, 2) }); // Right wing
      blocks.push({ rect: new Rectangle({ width: 4, height: 4, color: accentColor }), offset: new Vector(0, 4) }); // Tail
      break;
      
    case 1: // Wide bomber - horizontal design
      blocks.push({ rect: new Rectangle({ width: 12, height: 6, color: primaryColor }), offset: new Vector(0, 0) }); // Main body
      blocks.push({ rect: new Rectangle({ width: 4, height: 4, color: secondaryColor }), offset: new Vector(-8, -2) }); // Left engine
      blocks.push({ rect: new Rectangle({ width: 4, height: 4, color: secondaryColor }), offset: new Vector(8, -2) }); // Right engine
      blocks.push({ rect: new Rectangle({ width: 6, height: 3, color: accentColor }), offset: new Vector(0, 4) }); // Cockpit
      break;
      
    case 2: // Sleek interceptor - diagonal design
      blocks.push({ rect: new Rectangle({ width: 10, height: 6, color: primaryColor }), offset: new Vector(0, 0) }); // Center
      blocks.push({ rect: new Rectangle({ width: 4, height: 4, color: secondaryColor }), offset: new Vector(-5, -4) }); // Top left
      blocks.push({ rect: new Rectangle({ width: 4, height: 4, color: secondaryColor }), offset: new Vector(5, -4) }); // Top right
      blocks.push({ rect: new Rectangle({ width: 3, height: 8, color: accentColor }), offset: new Vector(0, 5) }); // Bottom fin
      break;
      
    case 3: // Compact scout - small and agile
      blocks.push({ rect: new Rectangle({ width: 6, height: 8, color: primaryColor }), offset: new Vector(0, -1) }); // Body
      blocks.push({ rect: new Rectangle({ width: 3, height: 3, color: secondaryColor }), offset: new Vector(-4, 0) }); // Left side
      blocks.push({ rect: new Rectangle({ width: 3, height: 3, color: secondaryColor }), offset: new Vector(4, 0) }); // Right side
      blocks.push({ rect: new Rectangle({ width: 2, height: 2, color: accentColor }), offset: new Vector(0, -5) }); // Nose
      blocks.push({ rect: new Rectangle({ width: 4, height: 2, color: accentColor }), offset: new Vector(0, 4) }); // Tail
      break;
  }
  
  // Create graphics group with all blocks
  return new GraphicsGroup({
    members: blocks.map(block => ({
      graphic: block.rect,
      offset: block.offset,
    })),
  });
}

