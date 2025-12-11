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