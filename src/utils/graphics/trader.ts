import { Color, Rectangle, Vector, GraphicsGroup } from "excalibur";

// Trader-specific color palette - merchant/trading themed
const TRADER_COLORS = [
  Color.fromHex("#FFD700"), // Gold
  Color.fromHex("#FFA500"), // Orange
  Color.fromHex("#FF8C00"), // Dark orange
  Color.fromHex("#DAA520"), // Goldenrod
  Color.fromHex("#B8860B"), // Dark goldenrod
  Color.fromHex("#9370DB"), // Medium purple
  Color.fromHex("#8B008B"), // Dark magenta
  Color.fromHex("#4B0082"), // Indigo
  Color.fromHex("#FF1493"), // Deep pink
  Color.fromHex("#00CED1"), // Dark turquoise
  Color.fromHex("#20B2AA"), // Light sea green
  Color.fromHex("#FF6347"), // Tomato
];

export function createTraderShipOutOfShapes(): GraphicsGroup {
  const blocks: { rect: Rectangle; offset: Vector }[] = [];
  
  // Generate a random seed for this trader design
  const seed = Math.random();
  
  // Select random colors from trader palette
  const primaryColor = TRADER_COLORS[Math.floor(Math.random() * TRADER_COLORS.length)];
  const secondaryColor = TRADER_COLORS[Math.floor(Math.random() * TRADER_COLORS.length)];
  const accentColor = TRADER_COLORS[Math.floor(Math.random() * TRADER_COLORS.length)];
  
  // Trader design patterns - merchant/trading themed
  const pattern = Math.floor(seed * 4); // 4 different patterns
  
  switch (pattern) {
    case 0: // Luxury merchant - sleek with cargo holds
      blocks.push({ rect: new Rectangle({ width: 12, height: 8, color: primaryColor }), offset: new Vector(0, 0) }); // Main body
      blocks.push({ rect: new Rectangle({ width: 4, height: 6, color: accentColor }), offset: new Vector(-8, 1) }); // Left cargo
      blocks.push({ rect: new Rectangle({ width: 4, height: 6, color: accentColor }), offset: new Vector(8, 1) }); // Right cargo
      blocks.push({ rect: new Rectangle({ width: 6, height: 3, color: secondaryColor }), offset: new Vector(0, -6) }); // Bridge
      blocks.push({ rect: new Rectangle({ width: 8, height: 2, color: accentColor }), offset: new Vector(0, 5) }); // Engine
      break;
      
    case 1: // Fast trader - streamlined design
      blocks.push({ rect: new Rectangle({ width: 10, height: 6, color: primaryColor }), offset: new Vector(0, 0) }); // Main body
      blocks.push({ rect: new Rectangle({ width: 3, height: 4, color: secondaryColor }), offset: new Vector(-6, -3) }); // Left wing
      blocks.push({ rect: new Rectangle({ width: 3, height: 4, color: secondaryColor }), offset: new Vector(6, -3) }); // Right wing
      blocks.push({ rect: new Rectangle({ width: 5, height: 3, color: accentColor }), offset: new Vector(0, 4) }); // Cargo bay
      blocks.push({ rect: new Rectangle({ width: 4, height: 2, color: accentColor }), offset: new Vector(0, -5) }); // Nose
      break;
      
    case 2: // Heavy freighter - wide with multiple cargo sections
      blocks.push({ rect: new Rectangle({ width: 16, height: 6, color: primaryColor }), offset: new Vector(0, 0) }); // Main body
      blocks.push({ rect: new Rectangle({ width: 3, height: 5, color: accentColor }), offset: new Vector(-8, 1) }); // Left cargo
      blocks.push({ rect: new Rectangle({ width: 3, height: 5, color: accentColor }), offset: new Vector(-4, 1) }); // Left-center cargo
      blocks.push({ rect: new Rectangle({ width: 3, height: 5, color: accentColor }), offset: new Vector(4, 1) }); // Right-center cargo
      blocks.push({ rect: new Rectangle({ width: 3, height: 5, color: accentColor }), offset: new Vector(8, 1) }); // Right cargo
      blocks.push({ rect: new Rectangle({ width: 6, height: 2, color: secondaryColor }), offset: new Vector(0, -5) }); // Bridge
      break;
      
    case 3: // Compact trader - efficient design with side pods
      blocks.push({ rect: new Rectangle({ width: 8, height: 8, color: primaryColor }), offset: new Vector(0, -1) }); // Body
      blocks.push({ rect: new Rectangle({ width: 3, height: 4, color: accentColor }), offset: new Vector(-6, 0) }); // Left pod
      blocks.push({ rect: new Rectangle({ width: 3, height: 4, color: accentColor }), offset: new Vector(6, 0) }); // Right pod
      blocks.push({ rect: new Rectangle({ width: 4, height: 3, color: secondaryColor }), offset: new Vector(0, -6) }); // Top section
      blocks.push({ rect: new Rectangle({ width: 6, height: 2, color: accentColor }), offset: new Vector(0, 5) }); // Engine
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

// Trader variation 2 - different style
export function createTrader2ShipOutOfShapes(): GraphicsGroup {
  const blocks: { rect: Rectangle; offset: Vector }[] = [];
  
  const seed = Math.random();
  // More muted, professional colors
  const variationColors = [
    Color.fromHex("#4682B4"), // Steel blue
    Color.fromHex("#5F9EA0"), // Cadet blue
    Color.fromHex("#708090"), // Slate gray
    Color.fromHex("#778899"), // Light slate gray
    Color.fromHex("#2F4F4F"), // Dark slate gray
    Color.fromHex("#696969"), // Dim gray
    Color.fromHex("#808080"), // Gray
    Color.fromHex("#A9A9A9"), // Dark gray
  ];
  
  const primaryColor = variationColors[Math.floor(Math.random() * variationColors.length)];
  const secondaryColor = variationColors[Math.floor(Math.random() * variationColors.length)];
  const accentColor = variationColors[Math.floor(Math.random() * variationColors.length)];
  
  const pattern = Math.floor(seed * 4);
  
  switch (pattern) {
    case 0: // Corporate trader - sleek and professional
      blocks.push({ rect: new Rectangle({ width: 14, height: 6, color: primaryColor }), offset: new Vector(0, 0) }); // Main body
      blocks.push({ rect: new Rectangle({ width: 5, height: 5, color: accentColor }), offset: new Vector(-8, 0) }); // Left cargo pod
      blocks.push({ rect: new Rectangle({ width: 5, height: 5, color: accentColor }), offset: new Vector(8, 0) }); // Right cargo pod
      blocks.push({ rect: new Rectangle({ width: 6, height: 2, color: secondaryColor }), offset: new Vector(0, -5) }); // Bridge
      break;
      
    case 1: // Bulk hauler - massive cargo capacity
      blocks.push({ rect: new Rectangle({ width: 20, height: 6, color: primaryColor }), offset: new Vector(0, 0) }); // Main body
      blocks.push({ rect: new Rectangle({ width: 4, height: 5, color: accentColor }), offset: new Vector(-10, 1) }); // Left cargo
      blocks.push({ rect: new Rectangle({ width: 4, height: 5, color: accentColor }), offset: new Vector(-5, 1) }); // Left-center cargo
      blocks.push({ rect: new Rectangle({ width: 4, height: 5, color: accentColor }), offset: new Vector(5, 1) }); // Right-center cargo
      blocks.push({ rect: new Rectangle({ width: 4, height: 5, color: accentColor }), offset: new Vector(10, 1) }); // Right cargo
      blocks.push({ rect: new Rectangle({ width: 8, height: 2, color: secondaryColor }), offset: new Vector(0, -5) }); // Bridge
      break;
      
    case 2: // Express trader - streamlined for speed
      blocks.push({ rect: new Rectangle({ width: 12, height: 5, color: primaryColor }), offset: new Vector(0, 0) }); // Main body
      blocks.push({ rect: new Rectangle({ width: 2, height: 6, color: secondaryColor }), offset: new Vector(-6, -1) }); // Left fin
      blocks.push({ rect: new Rectangle({ width: 2, height: 6, color: secondaryColor }), offset: new Vector(6, -1) }); // Right fin
      blocks.push({ rect: new Rectangle({ width: 4, height: 3, color: accentColor }), offset: new Vector(0, 4) }); // Cargo bay
      blocks.push({ rect: new Rectangle({ width: 3, height: 2, color: accentColor }), offset: new Vector(0, -4) }); // Nose
      break;
      
    case 3: // Compact merchant - efficient design
      blocks.push({ rect: new Rectangle({ width: 10, height: 8, color: primaryColor }), offset: new Vector(0, -1) }); // Body
      blocks.push({ rect: new Rectangle({ width: 3, height: 5, color: accentColor }), offset: new Vector(-6, 0) }); // Left pod
      blocks.push({ rect: new Rectangle({ width: 3, height: 5, color: accentColor }), offset: new Vector(6, 0) }); // Right pod
      blocks.push({ rect: new Rectangle({ width: 5, height: 3, color: secondaryColor }), offset: new Vector(0, -6) }); // Top section
      blocks.push({ rect: new Rectangle({ width: 6, height: 2, color: accentColor }), offset: new Vector(0, 5) }); // Engine
      break;
  }
  
  return new GraphicsGroup({
    members: blocks.map(block => ({
      graphic: block.rect,
      offset: block.offset,
    })),
  });
}

