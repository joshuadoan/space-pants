import { Color, Rectangle, Vector, GraphicsGroup } from "excalibur";

// Miner-specific color palette - industrial/mining themed
const MINER_COLORS = [
  Color.fromHex("#8B4513"), // Brown
  Color.fromHex("#654321"), // Dark brown
  Color.fromHex("#A0522D"), // Sienna
  Color.fromHex("#CD853F"), // Peru
  Color.fromHex("#D2691E"), // Chocolate
  Color.fromHex("#B8860B"), // Dark goldenrod
  Color.fromHex("#808080"), // Gray
  Color.fromHex("#696969"), // Dim gray
  Color.fromHex("#778899"), // Light slate gray
  Color.fromHex("#2F4F4F"), // Dark slate gray
];

export function createMinerShipOutOfShapes(): GraphicsGroup {
  const blocks: { rect: Rectangle; offset: Vector }[] = [];
  
  // Generate a random seed for this miner design
  const seed = Math.random();
  
  // Select random colors from miner palette
  const primaryColor = MINER_COLORS[Math.floor(Math.random() * MINER_COLORS.length)];
  const secondaryColor = MINER_COLORS[Math.floor(Math.random() * MINER_COLORS.length)];
  const accentColor = MINER_COLORS[Math.floor(Math.random() * MINER_COLORS.length)];
  
  // Miner design patterns - industrial/mining themed
  const pattern = Math.floor(seed * 4); // 4 different patterns
  
  switch (pattern) {
    case 0: // Heavy mining rig - wide body with drill
      blocks.push({ rect: new Rectangle({ width: 14, height: 8, color: primaryColor }), offset: new Vector(0, 0) }); // Main body
      blocks.push({ rect: new Rectangle({ width: 4, height: 4, color: accentColor }), offset: new Vector(0, -6) }); // Drill head
      blocks.push({ rect: new Rectangle({ width: 3, height: 3, color: secondaryColor }), offset: new Vector(-7, 2) }); // Left cargo
      blocks.push({ rect: new Rectangle({ width: 3, height: 3, color: secondaryColor }), offset: new Vector(7, 2) }); // Right cargo
      blocks.push({ rect: new Rectangle({ width: 6, height: 2, color: accentColor }), offset: new Vector(0, 5) }); // Engine
      break;
      
    case 1: // Compact miner - vertical design with storage
      blocks.push({ rect: new Rectangle({ width: 10, height: 10, color: primaryColor }), offset: new Vector(0, -1) }); // Main body
      blocks.push({ rect: new Rectangle({ width: 3, height: 3, color: accentColor }), offset: new Vector(0, -7) }); // Drill
      blocks.push({ rect: new Rectangle({ width: 4, height: 5, color: secondaryColor }), offset: new Vector(-6, 0) }); // Left storage
      blocks.push({ rect: new Rectangle({ width: 4, height: 5, color: secondaryColor }), offset: new Vector(6, 0) }); // Right storage
      blocks.push({ rect: new Rectangle({ width: 8, height: 2, color: accentColor }), offset: new Vector(0, 6) }); // Engine
      break;
      
    case 2: // Industrial hauler - long horizontal with multiple drills
      blocks.push({ rect: new Rectangle({ width: 16, height: 6, color: primaryColor }), offset: new Vector(0, 0) }); // Main body
      blocks.push({ rect: new Rectangle({ width: 3, height: 3, color: accentColor }), offset: new Vector(-6, -5) }); // Left drill
      blocks.push({ rect: new Rectangle({ width: 3, height: 3, color: accentColor }), offset: new Vector(0, -5) }); // Center drill
      blocks.push({ rect: new Rectangle({ width: 3, height: 3, color: accentColor }), offset: new Vector(6, -5) }); // Right drill
      blocks.push({ rect: new Rectangle({ width: 5, height: 4, color: secondaryColor }), offset: new Vector(-8, 2) }); // Left cargo bay
      blocks.push({ rect: new Rectangle({ width: 5, height: 4, color: secondaryColor }), offset: new Vector(8, 2) }); // Right cargo bay
      break;
      
    case 3: // Utility miner - compact with side-mounted equipment
      blocks.push({ rect: new Rectangle({ width: 8, height: 10, color: primaryColor }), offset: new Vector(0, -1) }); // Body
      blocks.push({ rect: new Rectangle({ width: 2, height: 4, color: accentColor }), offset: new Vector(0, -7) }); // Top drill
      blocks.push({ rect: new Rectangle({ width: 3, height: 6, color: secondaryColor }), offset: new Vector(-6, -2) }); // Left equipment
      blocks.push({ rect: new Rectangle({ width: 3, height: 6, color: secondaryColor }), offset: new Vector(6, -2) }); // Right equipment
      blocks.push({ rect: new Rectangle({ width: 6, height: 3, color: accentColor }), offset: new Vector(0, 6) }); // Engine
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

// Miner variation 2 - different color scheme and patterns
export function createMiner2ShipOutOfShapes(): GraphicsGroup {
  const blocks: { rect: Rectangle; offset: Vector }[] = [];
  
  const seed = Math.random();
  // Use brighter, more varied colors for variation
  const variationColors = [
    Color.fromHex("#FF8C00"), // Dark orange
    Color.fromHex("#FF4500"), // Orange red
    Color.fromHex("#B22222"), // Fire brick
    Color.fromHex("#8B4513"), // Saddle brown
    Color.fromHex("#A0522D"), // Sienna
    Color.fromHex("#CD853F"), // Peru
    Color.fromHex("#D2691E"), // Chocolate
    Color.fromHex("#FF6347"), // Tomato
  ];
  
  const primaryColor = variationColors[Math.floor(Math.random() * variationColors.length)];
  const secondaryColor = variationColors[Math.floor(Math.random() * variationColors.length)];
  const accentColor = variationColors[Math.floor(Math.random() * variationColors.length)];
  
  const pattern = Math.floor(seed * 4);
  
  switch (pattern) {
    case 0: // Deep core miner - vertical design
      blocks.push({ rect: new Rectangle({ width: 10, height: 12, color: primaryColor }), offset: new Vector(0, -2) }); // Main body
      blocks.push({ rect: new Rectangle({ width: 6, height: 4, color: accentColor }), offset: new Vector(0, -8) }); // Large drill
      blocks.push({ rect: new Rectangle({ width: 4, height: 6, color: secondaryColor }), offset: new Vector(-6, 0) }); // Left storage
      blocks.push({ rect: new Rectangle({ width: 4, height: 6, color: secondaryColor }), offset: new Vector(6, 0) }); // Right storage
      blocks.push({ rect: new Rectangle({ width: 8, height: 3, color: accentColor }), offset: new Vector(0, 7) }); // Engine
      break;
      
    case 1: // Strip miner - horizontal with conveyor
      blocks.push({ rect: new Rectangle({ width: 16, height: 6, color: primaryColor }), offset: new Vector(0, 0) }); // Main body
      blocks.push({ rect: new Rectangle({ width: 4, height: 3, color: accentColor }), offset: new Vector(-8, -5) }); // Left cutter
      blocks.push({ rect: new Rectangle({ width: 4, height: 3, color: accentColor }), offset: new Vector(8, -5) }); // Right cutter
      blocks.push({ rect: new Rectangle({ width: 12, height: 2, color: secondaryColor }), offset: new Vector(0, 4) }); // Conveyor belt
      break;
      
    case 2: // Plasma miner - sleek with energy core
      blocks.push({ rect: new Rectangle({ width: 12, height: 8, color: primaryColor }), offset: new Vector(0, 0) }); // Main body
      blocks.push({ rect: new Rectangle({ width: 6, height: 6, color: accentColor }), offset: new Vector(0, -5) }); // Energy core
      blocks.push({ rect: new Rectangle({ width: 3, height: 5, color: secondaryColor }), offset: new Vector(-7, 1) }); // Left collector
      blocks.push({ rect: new Rectangle({ width: 3, height: 5, color: secondaryColor }), offset: new Vector(7, 1) }); // Right collector
      break;
      
    case 3: // Modular miner - compact with attachments
      blocks.push({ rect: new Rectangle({ width: 8, height: 10, color: primaryColor }), offset: new Vector(0, -1) }); // Body
      blocks.push({ rect: new Rectangle({ width: 3, height: 4, color: accentColor }), offset: new Vector(0, -8) }); // Top drill
      blocks.push({ rect: new Rectangle({ width: 3, height: 6, color: secondaryColor }), offset: new Vector(-5, -1) }); // Left module
      blocks.push({ rect: new Rectangle({ width: 3, height: 6, color: secondaryColor }), offset: new Vector(5, -1) }); // Right module
      blocks.push({ rect: new Rectangle({ width: 6, height: 3, color: accentColor }), offset: new Vector(0, 6) }); // Engine
      break;
  }
  
  return new GraphicsGroup({
    members: blocks.map(block => ({
      graphic: block.rect,
      offset: block.offset,
    })),
  });
}

