import { Color, Rectangle, Vector, GraphicsGroup } from "excalibur";

/**
 * Distinct graphic style names for entity designs.
 * These are independent of MeepleType and can be reused across different entity types.
 */
export enum EntityGraphicStyle {
  Default = "default",
  Miner = "miner",
  Trader = "trader",
  Bartender = "bartender",
  SpaceStation = "space-station",
  SpaceBar = "space-bar",
  SpaceApartments = "space-apartments",
  Pirate = "pirate",
  Police = "police",
  CruiseShip = "cruise-ship",
  GalacticZoo = "galactic-zoo",
  Miner2 = "miner-2",
  Trader2 = "trader-2",
  Bartender2 = "bartender-2",
}

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

// Bartender-specific color palette - bar/service themed
const BARTENDER_COLORS = [
  Color.fromHex("#8B4513"), // Saddle brown
  Color.fromHex("#A0522D"), // Sienna
  Color.fromHex("#CD853F"), // Peru
  Color.fromHex("#D2691E"), // Chocolate
  Color.fromHex("#DEB887"), // Burlywood
  Color.fromHex("#F4A460"), // Sandy brown
  Color.fromHex("#FFD700"), // Gold
  Color.fromHex("#FFA500"), // Orange
  Color.fromHex("#FF6347"), // Tomato
  Color.fromHex("#DC143C"), // Crimson
  Color.fromHex("#8B0000"), // Dark red
  Color.fromHex("#654321"), // Dark brown
];

export function createBartenderShipOutOfShapes(): GraphicsGroup {
  const blocks: { rect: Rectangle; offset: Vector }[] = [];
  
  // Generate a random seed for this bartender design
  const seed = Math.random();
  
  // Select random colors from bartender palette
  const primaryColor = BARTENDER_COLORS[Math.floor(Math.random() * BARTENDER_COLORS.length)];
  const secondaryColor = BARTENDER_COLORS[Math.floor(Math.random() * BARTENDER_COLORS.length)];
  const accentColor = BARTENDER_COLORS[Math.floor(Math.random() * BARTENDER_COLORS.length)];
  
  // Bartender design patterns - bar/service themed
  const pattern = Math.floor(seed * 4); // 4 different patterns
  
  switch (pattern) {
    case 0: // Classic bartender - sleek with serving tray
      blocks.push({ rect: new Rectangle({ width: 10, height: 8, color: primaryColor }), offset: new Vector(0, 0) }); // Main body
      blocks.push({ rect: new Rectangle({ width: 8, height: 3, color: accentColor }), offset: new Vector(0, 5) }); // Serving tray
      blocks.push({ rect: new Rectangle({ width: 3, height: 4, color: secondaryColor }), offset: new Vector(-6, -2) }); // Left drink
      blocks.push({ rect: new Rectangle({ width: 3, height: 4, color: secondaryColor }), offset: new Vector(6, -2) }); // Right drink
      blocks.push({ rect: new Rectangle({ width: 4, height: 2, color: accentColor }), offset: new Vector(0, -6) }); // Top hat/visor
      break;
      
    case 1: // Mobile bar cart - wide with multiple bottles
      blocks.push({ rect: new Rectangle({ width: 14, height: 6, color: primaryColor }), offset: new Vector(0, 0) }); // Main body
      blocks.push({ rect: new Rectangle({ width: 2, height: 5, color: accentColor }), offset: new Vector(-8, 1) }); // Left bottle
      blocks.push({ rect: new Rectangle({ width: 2, height: 5, color: accentColor }), offset: new Vector(-4, 1) }); // Left-center bottle
      blocks.push({ rect: new Rectangle({ width: 2, height: 5, color: accentColor }), offset: new Vector(4, 1) }); // Right-center bottle
      blocks.push({ rect: new Rectangle({ width: 2, height: 5, color: accentColor }), offset: new Vector(8, 1) }); // Right bottle
      blocks.push({ rect: new Rectangle({ width: 6, height: 2, color: secondaryColor }), offset: new Vector(0, -5) }); // Top counter
      break;
      
    case 2: // Compact service bot - vertical with shaker
      blocks.push({ rect: new Rectangle({ width: 8, height: 10, color: primaryColor }), offset: new Vector(0, -1) }); // Main body
      blocks.push({ rect: new Rectangle({ width: 3, height: 4, color: accentColor }), offset: new Vector(0, -7) }); // Shaker top
      blocks.push({ rect: new Rectangle({ width: 4, height: 5, color: secondaryColor }), offset: new Vector(-5, 1) }); // Left glass
      blocks.push({ rect: new Rectangle({ width: 4, height: 5, color: secondaryColor }), offset: new Vector(5, 1) }); // Right glass
      blocks.push({ rect: new Rectangle({ width: 6, height: 2, color: accentColor }), offset: new Vector(0, 6) }); // Base
      break;
      
    case 3: // Elegant mixologist - ornate design with side garnishes
      blocks.push({ rect: new Rectangle({ width: 10, height: 8, color: primaryColor }), offset: new Vector(0, -1) }); // Body
      blocks.push({ rect: new Rectangle({ width: 3, height: 4, color: accentColor }), offset: new Vector(-6, 0) }); // Left garnish
      blocks.push({ rect: new Rectangle({ width: 3, height: 4, color: accentColor }), offset: new Vector(6, 0) }); // Right garnish
      blocks.push({ rect: new Rectangle({ width: 4, height: 3, color: secondaryColor }), offset: new Vector(0, -6) }); // Top decoration
      blocks.push({ rect: new Rectangle({ width: 6, height: 2, color: accentColor }), offset: new Vector(0, 5) }); // Serving platform
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

// Space Station color palette
const STATION_COLORS = [
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

export function createSpaceStationGraphic(): GraphicsGroup {
  const modules: { rect: Rectangle; offset: Vector; }[] = [];

  // Generate a random seed for this station design
  const seed = Math.random();

  // Select random colors for this station
  const primaryColor = STATION_COLORS[Math.floor(Math.random() * STATION_COLORS.length)];
  const secondaryColor = STATION_COLORS[Math.floor(Math.random() * STATION_COLORS.length)];
  const accentColor = STATION_COLORS[Math.floor(Math.random() * STATION_COLORS.length)];
  const windowColor = Color.fromHex("#87CEEB"); // Sky blue for windows

  // Station design patterns - each creates a different style
  const pattern = Math.floor(seed * 6); // 6 different patterns

  switch (pattern) {
    case 0: // Central hub with radial modules
      modules.push({ rect: new Rectangle({ width: 24, height: 24, color: primaryColor }), offset: new Vector(0, 0) }); // Central hub
      modules.push({ rect: new Rectangle({ width: 16, height: 8, color: secondaryColor }), offset: new Vector(-20, 0) }); // Left module
      modules.push({ rect: new Rectangle({ width: 16, height: 8, color: secondaryColor }), offset: new Vector(20, 0) }); // Right module
      modules.push({ rect: new Rectangle({ width: 8, height: 16, color: secondaryColor }), offset: new Vector(0, -20) }); // Top module
      modules.push({ rect: new Rectangle({ width: 8, height: 16, color: secondaryColor }), offset: new Vector(0, 20) }); // Bottom module

      // Add windows
      modules.push({ rect: new Rectangle({ width: 3, height: 3, color: windowColor }), offset: new Vector(-8, -8) });
      modules.push({ rect: new Rectangle({ width: 3, height: 3, color: windowColor }), offset: new Vector(8, -8) });
      modules.push({ rect: new Rectangle({ width: 3, height: 3, color: windowColor }), offset: new Vector(-8, 8) });
      modules.push({ rect: new Rectangle({ width: 3, height: 3, color: windowColor }), offset: new Vector(8, 8) });
      break;

    case 1: // Linear modular station
      modules.push({ rect: new Rectangle({ width: 20, height: 12, color: primaryColor }), offset: new Vector(-20, 0) }); // Left module
      modules.push({ rect: new Rectangle({ width: 20, height: 12, color: primaryColor }), offset: new Vector(0, 0) }); // Center module
      modules.push({ rect: new Rectangle({ width: 20, height: 12, color: primaryColor }), offset: new Vector(20, 0) }); // Right module
      modules.push({ rect: new Rectangle({ width: 12, height: 8, color: secondaryColor }), offset: new Vector(-10, -12) }); // Top left
      modules.push({ rect: new Rectangle({ width: 12, height: 8, color: secondaryColor }), offset: new Vector(10, -12) }); // Top right
      modules.push({ rect: new Rectangle({ width: 12, height: 8, color: secondaryColor }), offset: new Vector(-10, 12) }); // Bottom left
      modules.push({ rect: new Rectangle({ width: 12, height: 8, color: secondaryColor }), offset: new Vector(10, 12) }); // Bottom right

      // Add windows along the modules
      for (let i = -2; i <= 2; i++) {
        modules.push({ rect: new Rectangle({ width: 2, height: 2, color: windowColor }), offset: new Vector(i * 20, -6) });
        modules.push({ rect: new Rectangle({ width: 2, height: 2, color: windowColor }), offset: new Vector(i * 20, 6) });
      }
      break;

    case 2: // Hexagonal station
      // Create hexagonal shape using rectangles
      modules.push({ rect: new Rectangle({ width: 28, height: 8, color: primaryColor }), offset: new Vector(0, -16) }); // Top
      modules.push({ rect: new Rectangle({ width: 28, height: 8, color: primaryColor }), offset: new Vector(0, 16) }); // Bottom
      modules.push({ rect: new Rectangle({ width: 8, height: 28, color: primaryColor }), offset: new Vector(-16, 0) }); // Left
      modules.push({ rect: new Rectangle({ width: 8, height: 28, color: primaryColor }), offset: new Vector(16, 0) }); // Right
      modules.push({ rect: new Rectangle({ width: 20, height: 20, color: secondaryColor }), offset: new Vector(0, 0) }); // Center
      modules.push({ rect: new Rectangle({ width: 12, height: 8, color: accentColor }), offset: new Vector(-12, -12) }); // Corner 1
      modules.push({ rect: new Rectangle({ width: 12, height: 8, color: accentColor }), offset: new Vector(12, -12) }); // Corner 2
      modules.push({ rect: new Rectangle({ width: 12, height: 8, color: accentColor }), offset: new Vector(-12, 12) }); // Corner 3
      modules.push({ rect: new Rectangle({ width: 12, height: 8, color: accentColor }), offset: new Vector(12, 12) }); // Corner 4

      // Add windows
      modules.push({ rect: new Rectangle({ width: 4, height: 4, color: windowColor }), offset: new Vector(0, 0) });
      modules.push({ rect: new Rectangle({ width: 3, height: 3, color: windowColor }), offset: new Vector(-8, -8) });
      modules.push({ rect: new Rectangle({ width: 3, height: 3, color: windowColor }), offset: new Vector(8, -8) });
      break;

    case 3: // Orbital ring station
      modules.push({ rect: new Rectangle({ width: 32, height: 8, color: primaryColor }), offset: new Vector(0, -20) }); // Top ring segment
      modules.push({ rect: new Rectangle({ width: 32, height: 8, color: primaryColor }), offset: new Vector(0, 20) }); // Bottom ring segment
      modules.push({ rect: new Rectangle({ width: 8, height: 32, color: primaryColor }), offset: new Vector(-20, 0) }); // Left ring segment
      modules.push({ rect: new Rectangle({ width: 8, height: 32, color: primaryColor }), offset: new Vector(20, 0) }); // Right ring segment
      modules.push({ rect: new Rectangle({ width: 16, height: 16, color: secondaryColor }), offset: new Vector(0, 0) }); // Central core

      // Add connecting modules
      modules.push({ rect: new Rectangle({ width: 6, height: 6, color: accentColor }), offset: new Vector(-14, -14) });
      modules.push({ rect: new Rectangle({ width: 6, height: 6, color: accentColor }), offset: new Vector(14, -14) });
      modules.push({ rect: new Rectangle({ width: 6, height: 6, color: accentColor }), offset: new Vector(-14, 14) });
      modules.push({ rect: new Rectangle({ width: 6, height: 6, color: accentColor }), offset: new Vector(14, 14) });
      // Add windows
      for (let i = -1; i <= 1; i++) {
        modules.push({ rect: new Rectangle({ width: 2, height: 2, color: windowColor }), offset: new Vector(i * 10, -20) });
        modules.push({ rect: new Rectangle({ width: 2, height: 2, color: windowColor }), offset: new Vector(i * 10, 20) });
      }
      break;

    case 4: // Compact research station
      modules.push({ rect: new Rectangle({ width: 18, height: 18, color: primaryColor }), offset: new Vector(0, 0) }); // Main body
      modules.push({ rect: new Rectangle({ width: 10, height: 6, color: secondaryColor }), offset: new Vector(-14, -6) }); // Left lab
      modules.push({ rect: new Rectangle({ width: 10, height: 6, color: secondaryColor }), offset: new Vector(14, -6) }); // Right lab
      modules.push({ rect: new Rectangle({ width: 6, height: 10, color: secondaryColor }), offset: new Vector(-14, 6) }); // Bottom left
      modules.push({ rect: new Rectangle({ width: 6, height: 10, color: secondaryColor }), offset: new Vector(14, 6) }); // Bottom right
      modules.push({ rect: new Rectangle({ width: 8, height: 8, color: accentColor }), offset: new Vector(0, -14) }); // Top observation deck

      // Add windows
      modules.push({ rect: new Rectangle({ width: 4, height: 4, color: windowColor }), offset: new Vector(0, -14) });
      modules.push({ rect: new Rectangle({ width: 2, height: 2, color: windowColor }), offset: new Vector(-6, -6) });
      modules.push({ rect: new Rectangle({ width: 2, height: 2, color: windowColor }), offset: new Vector(6, -6) });
      modules.push({ rect: new Rectangle({ width: 2, height: 2, color: windowColor }), offset: new Vector(-6, 6) });
      modules.push({ rect: new Rectangle({ width: 2, height: 2, color: windowColor }), offset: new Vector(6, 6) });
      break;

    case 5: // Large docking station
      modules.push({ rect: new Rectangle({ width: 40, height: 12, color: primaryColor }), offset: new Vector(0, -10) }); // Top docking bay
      modules.push({ rect: new Rectangle({ width: 40, height: 12, color: primaryColor }), offset: new Vector(0, 10) }); // Bottom docking bay
      modules.push({ rect: new Rectangle({ width: 12, height: 24, color: secondaryColor }), offset: new Vector(-18, 0) }); // Left structure
      modules.push({ rect: new Rectangle({ width: 12, height: 24, color: secondaryColor }), offset: new Vector(18, 0) }); // Right structure
      modules.push({ rect: new Rectangle({ width: 20, height: 8, color: accentColor }), offset: new Vector(0, 0) }); // Central control

      // Add docking ports
      modules.push({ rect: new Rectangle({ width: 6, height: 3, color: Color.DarkGray }), offset: new Vector(-15, -10) });
      modules.push({ rect: new Rectangle({ width: 6, height: 3, color: Color.DarkGray }), offset: new Vector(15, -10) });
      modules.push({ rect: new Rectangle({ width: 6, height: 3, color: Color.DarkGray }), offset: new Vector(-15, 10) });
      modules.push({ rect: new Rectangle({ width: 6, height: 3, color: Color.DarkGray }), offset: new Vector(15, 10) });
      // Add windows
      modules.push({ rect: new Rectangle({ width: 3, height: 3, color: windowColor }), offset: new Vector(0, 0) });
      modules.push({ rect: new Rectangle({ width: 2, height: 2, color: windowColor }), offset: new Vector(-18, -8) });
      modules.push({ rect: new Rectangle({ width: 2, height: 2, color: windowColor }), offset: new Vector(18, -8) });
      modules.push({ rect: new Rectangle({ width: 2, height: 2, color: windowColor }), offset: new Vector(-18, 8) });
      modules.push({ rect: new Rectangle({ width: 2, height: 2, color: windowColor }), offset: new Vector(18, 8) });
      break;
  }

  // Create graphics group with all modules
  return new GraphicsGroup({
    members: modules.map(module => ({
      graphic: module.rect,
      offset: module.offset,
    })),
  });
}

export function createSpaceBarGraphic(): GraphicsGroup {
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

export function createSpaceApartmentsGraphic(): GraphicsGroup {
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

// Pirate-specific color palette - dark and menacing
const PIRATE_COLORS = [
  Color.fromHex("#8B0000"), // Dark red
  Color.fromHex("#654321"), // Dark brown
  Color.fromHex("#2F4F4F"), // Dark slate gray
  Color.fromHex("#000000"), // Black
  Color.fromHex("#4B0082"), // Indigo
  Color.fromHex("#800080"), // Purple
  Color.fromHex("#A0522D"), // Sienna
  Color.fromHex("#556B2F"), // Dark olive green
  Color.fromHex("#8B4513"), // Saddle brown
  Color.fromHex("#2C2C2C"), // Very dark gray
];

export function createPirateShipOutOfShapes(): GraphicsGroup {
  const blocks: { rect: Rectangle; offset: Vector }[] = [];
  
  const seed = Math.random();
  const primaryColor = PIRATE_COLORS[Math.floor(Math.random() * PIRATE_COLORS.length)];
  const secondaryColor = PIRATE_COLORS[Math.floor(Math.random() * PIRATE_COLORS.length)];
  const accentColor = PIRATE_COLORS[Math.floor(Math.random() * PIRATE_COLORS.length)];
  
  const pattern = Math.floor(seed * 4);
  
  switch (pattern) {
    case 0: // Classic pirate ship - skull and crossbones style
      blocks.push({ rect: new Rectangle({ width: 14, height: 8, color: primaryColor }), offset: new Vector(0, 0) }); // Main hull
      blocks.push({ rect: new Rectangle({ width: 4, height: 4, color: accentColor }), offset: new Vector(0, -6) }); // Skull symbol
      blocks.push({ rect: new Rectangle({ width: 2, height: 6, color: secondaryColor }), offset: new Vector(-7, -2) }); // Left cannon
      blocks.push({ rect: new Rectangle({ width: 2, height: 6, color: secondaryColor }), offset: new Vector(7, -2) }); // Right cannon
      blocks.push({ rect: new Rectangle({ width: 8, height: 3, color: accentColor }), offset: new Vector(0, 5) }); // Jolly roger flag
      break;
      
    case 1: // Raider - aggressive angular design
      blocks.push({ rect: new Rectangle({ width: 12, height: 6, color: primaryColor }), offset: new Vector(0, 0) }); // Main body
      blocks.push({ rect: new Rectangle({ width: 3, height: 8, color: accentColor }), offset: new Vector(-6, -2) }); // Left spike
      blocks.push({ rect: new Rectangle({ width: 3, height: 8, color: accentColor }), offset: new Vector(6, -2) }); // Right spike
      blocks.push({ rect: new Rectangle({ width: 5, height: 4, color: secondaryColor }), offset: new Vector(0, -5) }); // Bridge
      blocks.push({ rect: new Rectangle({ width: 6, height: 2, color: accentColor }), offset: new Vector(0, 4) }); // Engine
      break;
      
    case 2: // Marauder - wide with multiple weapons
      blocks.push({ rect: new Rectangle({ width: 16, height: 6, color: primaryColor }), offset: new Vector(0, 0) }); // Main body
      blocks.push({ rect: new Rectangle({ width: 2, height: 4, color: accentColor }), offset: new Vector(-8, 1) }); // Left weapon
      blocks.push({ rect: new Rectangle({ width: 2, height: 4, color: accentColor }), offset: new Vector(-4, 1) }); // Left-center weapon
      blocks.push({ rect: new Rectangle({ width: 2, height: 4, color: accentColor }), offset: new Vector(4, 1) }); // Right-center weapon
      blocks.push({ rect: new Rectangle({ width: 2, height: 4, color: accentColor }), offset: new Vector(8, 1) }); // Right weapon
      blocks.push({ rect: new Rectangle({ width: 6, height: 3, color: secondaryColor }), offset: new Vector(0, -5) }); // Command center
      break;
      
    case 3: // Scoundrel - compact but dangerous
      blocks.push({ rect: new Rectangle({ width: 10, height: 8, color: primaryColor }), offset: new Vector(0, -1) }); // Body
      blocks.push({ rect: new Rectangle({ width: 3, height: 3, color: accentColor }), offset: new Vector(0, -7) }); // Top spike
      blocks.push({ rect: new Rectangle({ width: 4, height: 5, color: secondaryColor }), offset: new Vector(-6, 0) }); // Left weapon pod
      blocks.push({ rect: new Rectangle({ width: 4, height: 5, color: secondaryColor }), offset: new Vector(6, 0) }); // Right weapon pod
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

// Police-specific color palette - authoritative and clean
const POLICE_COLORS = [
  Color.fromHex("#0000FF"), // Blue
  Color.fromHex("#4169E1"), // Royal blue
  Color.fromHex("#1E90FF"), // Dodger blue
  Color.fromHex("#000080"), // Navy
  Color.fromHex("#FFFFFF"), // White
  Color.fromHex("#C0C0C0"), // Silver
  Color.fromHex("#708090"), // Slate gray
  Color.fromHex("#4682B4"), // Steel blue
  Color.fromHex("#191970"), // Midnight blue
  Color.fromHex("#00CED1"), // Dark turquoise
];

export function createPoliceShipOutOfShapes(): GraphicsGroup {
  const blocks: { rect: Rectangle; offset: Vector }[] = [];
  
  const seed = Math.random();
  const primaryColor = POLICE_COLORS[Math.floor(Math.random() * POLICE_COLORS.length)];
  const secondaryColor = POLICE_COLORS[Math.floor(Math.random() * POLICE_COLORS.length)];
  const accentColor = Color.White; // Always white for police lights
  
  const pattern = Math.floor(seed * 4);
  
  switch (pattern) {
    case 0: // Patrol cruiser - sleek with lights
      blocks.push({ rect: new Rectangle({ width: 12, height: 8, color: primaryColor }), offset: new Vector(0, 0) }); // Main body
      blocks.push({ rect: new Rectangle({ width: 2, height: 2, color: accentColor }), offset: new Vector(-5, -5) }); // Left light
      blocks.push({ rect: new Rectangle({ width: 2, height: 2, color: accentColor }), offset: new Vector(5, -5) }); // Right light
      blocks.push({ rect: new Rectangle({ width: 4, height: 4, color: secondaryColor }), offset: new Vector(0, -6) }); // Top light bar
      blocks.push({ rect: new Rectangle({ width: 6, height: 3, color: secondaryColor }), offset: new Vector(0, 5) }); // Engine
      break;
      
    case 1: // Interceptor - fast pursuit design
      blocks.push({ rect: new Rectangle({ width: 10, height: 6, color: primaryColor }), offset: new Vector(0, 0) }); // Main body
      blocks.push({ rect: new Rectangle({ width: 3, height: 4, color: secondaryColor }), offset: new Vector(-6, -2) }); // Left wing
      blocks.push({ rect: new Rectangle({ width: 3, height: 4, color: secondaryColor }), offset: new Vector(6, -2) }); // Right wing
      blocks.push({ rect: new Rectangle({ width: 2, height: 2, color: accentColor }), offset: new Vector(0, -5) }); // Top light
      blocks.push({ rect: new Rectangle({ width: 4, height: 2, color: accentColor }), offset: new Vector(0, 4) }); // Rear lights
      break;
      
    case 2: // Enforcer - wide with multiple light bars
      blocks.push({ rect: new Rectangle({ width: 16, height: 6, color: primaryColor }), offset: new Vector(0, 0) }); // Main body
      blocks.push({ rect: new Rectangle({ width: 8, height: 2, color: accentColor }), offset: new Vector(0, -5) }); // Top light bar
      blocks.push({ rect: new Rectangle({ width: 2, height: 2, color: accentColor }), offset: new Vector(-7, 1) }); // Left side light
      blocks.push({ rect: new Rectangle({ width: 2, height: 2, color: accentColor }), offset: new Vector(7, 1) }); // Right side light
      blocks.push({ rect: new Rectangle({ width: 6, height: 2, color: secondaryColor }), offset: new Vector(0, 4) }); // Rear light bar
      break;
      
    case 3: // Compact patrol - efficient design
      blocks.push({ rect: new Rectangle({ width: 8, height: 8, color: primaryColor }), offset: new Vector(0, -1) }); // Body
      blocks.push({ rect: new Rectangle({ width: 4, height: 2, color: accentColor }), offset: new Vector(0, -6) }); // Top light
      blocks.push({ rect: new Rectangle({ width: 3, height: 4, color: secondaryColor }), offset: new Vector(-5, 0) }); // Left pod
      blocks.push({ rect: new Rectangle({ width: 3, height: 4, color: secondaryColor }), offset: new Vector(5, 0) }); // Right pod
      blocks.push({ rect: new Rectangle({ width: 6, height: 2, color: accentColor }), offset: new Vector(0, 5) }); // Bottom lights
      break;
  }
  
  return new GraphicsGroup({
    members: blocks.map(block => ({
      graphic: block.rect,
      offset: block.offset,
    })),
  });
}

// Cruise ship color palette - luxurious and bright
const CRUISE_SHIP_COLORS = [
  Color.fromHex("#FFD700"), // Gold
  Color.fromHex("#FFA500"), // Orange
  Color.fromHex("#FF69B4"), // Hot pink
  Color.fromHex("#00CED1"), // Dark turquoise
  Color.fromHex("#87CEEB"), // Sky blue
  Color.fromHex("#FF1493"), // Deep pink
  Color.fromHex("#FF6347"), // Tomato
  Color.fromHex("#9370DB"), // Medium purple
  Color.fromHex("#20B2AA"), // Light sea green
  Color.fromHex("#FFB6C1"), // Light pink
];

export function createCruiseShipOutOfShapes(): GraphicsGroup {
  const blocks: { rect: Rectangle; offset: Vector }[] = [];
  
  const seed = Math.random();
  const primaryColor = CRUISE_SHIP_COLORS[Math.floor(Math.random() * CRUISE_SHIP_COLORS.length)];
  const secondaryColor = CRUISE_SHIP_COLORS[Math.floor(Math.random() * CRUISE_SHIP_COLORS.length)];
  const accentColor = CRUISE_SHIP_COLORS[Math.floor(Math.random() * CRUISE_SHIP_COLORS.length)];
  const windowColor = Color.fromHex("#FFD700"); // Gold windows
  
  const pattern = Math.floor(seed * 4);
  
  switch (pattern) {
    case 0: // Luxury liner - long with many decks
      blocks.push({ rect: new Rectangle({ width: 20, height: 8, color: primaryColor }), offset: new Vector(0, 0) }); // Main hull
      blocks.push({ rect: new Rectangle({ width: 18, height: 6, color: secondaryColor }), offset: new Vector(0, -7) }); // Upper deck
      blocks.push({ rect: new Rectangle({ width: 16, height: 4, color: accentColor }), offset: new Vector(0, -12) }); // Top deck
      // Windows
      for (let i = -3; i <= 3; i++) {
        blocks.push({ rect: new Rectangle({ width: 2, height: 2, color: windowColor }), offset: new Vector(i * 5, -7) });
        blocks.push({ rect: new Rectangle({ width: 2, height: 2, color: windowColor }), offset: new Vector(i * 5, 0) });
      }
      blocks.push({ rect: new Rectangle({ width: 6, height: 3, color: accentColor }), offset: new Vector(0, 5) }); // Engine
      break;
      
    case 1: // Resort ship - wide with pool deck
      blocks.push({ rect: new Rectangle({ width: 18, height: 10, color: primaryColor }), offset: new Vector(0, -1) }); // Main body
      blocks.push({ rect: new Rectangle({ width: 14, height: 4, color: accentColor }), offset: new Vector(0, -8) }); // Pool deck
      blocks.push({ rect: new Rectangle({ width: 12, height: 6, color: secondaryColor }), offset: new Vector(0, -13) }); // Observation deck
      // Windows
      for (let i = -2; i <= 2; i++) {
        blocks.push({ rect: new Rectangle({ width: 2, height: 2, color: windowColor }), offset: new Vector(i * 6, -5) });
        blocks.push({ rect: new Rectangle({ width: 2, height: 2, color: windowColor }), offset: new Vector(i * 6, 2) });
      }
      break;
      
    case 2: // Mega cruise - massive with multiple sections
      blocks.push({ rect: new Rectangle({ width: 24, height: 8, color: primaryColor }), offset: new Vector(0, 0) }); // Main hull
      blocks.push({ rect: new Rectangle({ width: 20, height: 6, color: secondaryColor }), offset: new Vector(0, -7) }); // Second deck
      blocks.push({ rect: new Rectangle({ width: 16, height: 4, color: accentColor }), offset: new Vector(0, -12) }); // Third deck
      blocks.push({ rect: new Rectangle({ width: 12, height: 3, color: accentColor }), offset: new Vector(0, -15) }); // Top deck
      // Many windows
      for (let i = -4; i <= 4; i++) {
        blocks.push({ rect: new Rectangle({ width: 2, height: 2, color: windowColor }), offset: new Vector(i * 5, -7) });
        blocks.push({ rect: new Rectangle({ width: 2, height: 2, color: windowColor }), offset: new Vector(i * 5, 0) });
      }
      blocks.push({ rect: new Rectangle({ width: 8, height: 3, color: accentColor }), offset: new Vector(0, 5) }); // Engine
      break;
      
    case 3: // Compact luxury - elegant design
      blocks.push({ rect: new Rectangle({ width: 14, height: 8, color: primaryColor }), offset: new Vector(0, -1) }); // Body
      blocks.push({ rect: new Rectangle({ width: 12, height: 5, color: secondaryColor }), offset: new Vector(0, -7) }); // Upper deck
      blocks.push({ rect: new Rectangle({ width: 8, height: 3, color: accentColor }), offset: new Vector(0, -11) }); // Top section
      // Windows
      for (let i = -2; i <= 2; i++) {
        blocks.push({ rect: new Rectangle({ width: 2, height: 2, color: windowColor }), offset: new Vector(i * 5, -7) });
        blocks.push({ rect: new Rectangle({ width: 2, height: 2, color: windowColor }), offset: new Vector(i * 5, 0) });
      }
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

// Galactic Zoo color palette - vibrant and animal-themed
const GALACTIC_ZOO_COLORS = [
  Color.fromHex("#FF1493"), // Deep pink
  Color.fromHex("#00FF00"), // Lime green
  Color.fromHex("#FFD700"), // Gold
  Color.fromHex("#00CED1"), // Dark turquoise
  Color.fromHex("#FF6347"), // Tomato
  Color.fromHex("#9370DB"), // Medium purple
  Color.fromHex("#FF69B4"), // Hot pink
  Color.fromHex("#32CD32"), // Lime green
  Color.fromHex("#FF8C00"), // Dark orange
  Color.fromHex("#1E90FF"), // Dodger blue
];

export function createGalacticZooOutOfShapes(): GraphicsGroup {
  const blocks: { rect: Rectangle; offset: Vector }[] = [];
  
  const seed = Math.random();
  const primaryColor = GALACTIC_ZOO_COLORS[Math.floor(Math.random() * GALACTIC_ZOO_COLORS.length)];
  const secondaryColor = GALACTIC_ZOO_COLORS[Math.floor(Math.random() * GALACTIC_ZOO_COLORS.length)];
  const accentColor = GALACTIC_ZOO_COLORS[Math.floor(Math.random() * GALACTIC_ZOO_COLORS.length)];
  
  const pattern = Math.floor(seed * 4);
  
  switch (pattern) {
    case 0: // Habitat ship - wide with observation areas
      blocks.push({ rect: new Rectangle({ width: 18, height: 10, color: primaryColor }), offset: new Vector(0, -1) }); // Main body
      blocks.push({ rect: new Rectangle({ width: 6, height: 4, color: accentColor }), offset: new Vector(-8, -6) }); // Left habitat
      blocks.push({ rect: new Rectangle({ width: 6, height: 4, color: accentColor }), offset: new Vector(8, -6) }); // Right habitat
      blocks.push({ rect: new Rectangle({ width: 8, height: 3, color: secondaryColor }), offset: new Vector(0, -12) }); // Observation deck
      blocks.push({ rect: new Rectangle({ width: 4, height: 4, color: accentColor }), offset: new Vector(0, 5) }); // Central habitat
      break;
      
    case 1: // Mobile zoo - compact with multiple enclosures
      blocks.push({ rect: new Rectangle({ width: 14, height: 8, color: primaryColor }), offset: new Vector(0, 0) }); // Main body
      blocks.push({ rect: new Rectangle({ width: 4, height: 4, color: accentColor }), offset: new Vector(-6, -4) }); // Top left enclosure
      blocks.push({ rect: new Rectangle({ width: 4, height: 4, color: accentColor }), offset: new Vector(6, -4) }); // Top right enclosure
      blocks.push({ rect: new Rectangle({ width: 4, height: 4, color: secondaryColor }), offset: new Vector(-6, 4) }); // Bottom left enclosure
      blocks.push({ rect: new Rectangle({ width: 4, height: 4, color: secondaryColor }), offset: new Vector(6, 4) }); // Bottom right enclosure
      blocks.push({ rect: new Rectangle({ width: 6, height: 2, color: accentColor }), offset: new Vector(0, -6) }); // Top observation
      break;
      
    case 2: // Large habitat - spacious design
      blocks.push({ rect: new Rectangle({ width: 20, height: 10, color: primaryColor }), offset: new Vector(0, -1) }); // Main body
      blocks.push({ rect: new Rectangle({ width: 8, height: 5, color: accentColor }), offset: new Vector(-8, -5) }); // Left large habitat
      blocks.push({ rect: new Rectangle({ width: 8, height: 5, color: accentColor }), offset: new Vector(8, -5) }); // Right large habitat
      blocks.push({ rect: new Rectangle({ width: 6, height: 4, color: secondaryColor }), offset: new Vector(0, 4) }); // Central habitat
      blocks.push({ rect: new Rectangle({ width: 10, height: 3, color: accentColor }), offset: new Vector(0, -11) }); // Observation platform
      break;
      
    case 3: // Compact zoo - efficient with stacked habitats
      blocks.push({ rect: new Rectangle({ width: 12, height: 12, color: primaryColor }), offset: new Vector(0, -1) }); // Main body
      blocks.push({ rect: new Rectangle({ width: 4, height: 4, color: accentColor }), offset: new Vector(-4, -7) }); // Top left
      blocks.push({ rect: new Rectangle({ width: 4, height: 4, color: accentColor }), offset: new Vector(4, -7) }); // Top right
      blocks.push({ rect: new Rectangle({ width: 4, height: 4, color: secondaryColor }), offset: new Vector(-4, -1) }); // Middle left
      blocks.push({ rect: new Rectangle({ width: 4, height: 4, color: secondaryColor }), offset: new Vector(4, -1) }); // Middle right
      blocks.push({ rect: new Rectangle({ width: 4, height: 4, color: accentColor }), offset: new Vector(-4, 5) }); // Bottom left
      blocks.push({ rect: new Rectangle({ width: 4, height: 4, color: accentColor }), offset: new Vector(4, 5) }); // Bottom right
      break;
  }
  
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

// Bartender variation 2 - different style
export function createBartender2ShipOutOfShapes(): GraphicsGroup {
  const blocks: { rect: Rectangle; offset: Vector }[] = [];
  
  const seed = Math.random();
  // Brighter, more festive colors
  const variationColors = [
    Color.fromHex("#FF1493"), // Deep pink
    Color.fromHex("#FF69B4"), // Hot pink
    Color.fromHex("#FF6347"), // Tomato
    Color.fromHex("#FF4500"), // Orange red
    Color.fromHex("#FFD700"), // Gold
    Color.fromHex("#FFA500"), // Orange
    Color.fromHex("#9370DB"), // Medium purple
    Color.fromHex("#BA55D3"), // Medium orchid
  ];
  
  const primaryColor = variationColors[Math.floor(Math.random() * variationColors.length)];
  const secondaryColor = variationColors[Math.floor(Math.random() * variationColors.length)];
  const accentColor = variationColors[Math.floor(Math.random() * variationColors.length)];
  
  const pattern = Math.floor(seed * 4);
  
  switch (pattern) {
    case 0: // Party bartender - colorful with multiple drinks
      blocks.push({ rect: new Rectangle({ width: 12, height: 8, color: primaryColor }), offset: new Vector(0, 0) }); // Main body
      blocks.push({ rect: new Rectangle({ width: 2, height: 5, color: accentColor }), offset: new Vector(-6, 1) }); // Left drink
      blocks.push({ rect: new Rectangle({ width: 2, height: 5, color: accentColor }), offset: new Vector(-3, 1) }); // Left-center drink
      blocks.push({ rect: new Rectangle({ width: 2, height: 5, color: accentColor }), offset: new Vector(3, 1) }); // Right-center drink
      blocks.push({ rect: new Rectangle({ width: 2, height: 5, color: accentColor }), offset: new Vector(6, 1) }); // Right drink
      blocks.push({ rect: new Rectangle({ width: 8, height: 2, color: secondaryColor }), offset: new Vector(0, -6) }); // Top decoration
      break;
      
    case 1: // Cocktail master - elegant design
      blocks.push({ rect: new Rectangle({ width: 10, height: 10, color: primaryColor }), offset: new Vector(0, -1) }); // Main body
      blocks.push({ rect: new Rectangle({ width: 4, height: 4, color: accentColor }), offset: new Vector(0, -8) }); // Shaker top
      blocks.push({ rect: new Rectangle({ width: 3, height: 5, color: secondaryColor }), offset: new Vector(-5, 1) }); // Left glass
      blocks.push({ rect: new Rectangle({ width: 3, height: 5, color: secondaryColor }), offset: new Vector(5, 1) }); // Right glass
      blocks.push({ rect: new Rectangle({ width: 6, height: 2, color: accentColor }), offset: new Vector(0, 6) }); // Base
      break;
      
    case 2: // Mobile bar - wide serving station
      blocks.push({ rect: new Rectangle({ width: 16, height: 6, color: primaryColor }), offset: new Vector(0, 0) }); // Main body
      blocks.push({ rect: new Rectangle({ width: 3, height: 4, color: accentColor }), offset: new Vector(-8, 1) }); // Left bottle
      blocks.push({ rect: new Rectangle({ width: 3, height: 4, color: accentColor }), offset: new Vector(-4, 1) }); // Left-center bottle
      blocks.push({ rect: new Rectangle({ width: 3, height: 4, color: accentColor }), offset: new Vector(4, 1) }); // Right-center bottle
      blocks.push({ rect: new Rectangle({ width: 3, height: 4, color: accentColor }), offset: new Vector(8, 1) }); // Right bottle
      blocks.push({ rect: new Rectangle({ width: 12, height: 2, color: secondaryColor }), offset: new Vector(0, -5) }); // Top counter
      break;
      
    case 3: // Festive server - compact with decorations
      blocks.push({ rect: new Rectangle({ width: 8, height: 8, color: primaryColor }), offset: new Vector(0, -1) }); // Body
      blocks.push({ rect: new Rectangle({ width: 3, height: 3, color: accentColor }), offset: new Vector(-5, -6) }); // Left decoration
      blocks.push({ rect: new Rectangle({ width: 3, height: 3, color: accentColor }), offset: new Vector(5, -6) }); // Right decoration
      blocks.push({ rect: new Rectangle({ width: 4, height: 5, color: secondaryColor }), offset: new Vector(-4, 1) }); // Left drink
      blocks.push({ rect: new Rectangle({ width: 4, height: 5, color: secondaryColor }), offset: new Vector(4, 1) }); // Right drink
      blocks.push({ rect: new Rectangle({ width: 6, height: 2, color: accentColor }), offset: new Vector(0, 5) }); // Serving tray
      break;
  }
  
  return new GraphicsGroup({
    members: blocks.map(block => ({
      graphic: block.rect,
      offset: block.offset,
    })),
  });
}

/**
 * Unified function to create entity graphics based on graphic style name.
 * Returns the appropriate graphic style for the given style name.
 * 
 * @param style - The EntityGraphicStyle to create graphics for
 * @returns A GraphicsGroup with the appropriate entity design
 */
export function createEntityGraphic(style: EntityGraphicStyle): GraphicsGroup {
  switch (style) {
    case EntityGraphicStyle.Miner:
      return createMinerShipOutOfShapes();
    case EntityGraphicStyle.Trader:
      return createTraderShipOutOfShapes();
    case EntityGraphicStyle.Bartender:
      return createBartenderShipOutOfShapes();
    case EntityGraphicStyle.SpaceStation:
      return createSpaceStationGraphic();
    case EntityGraphicStyle.SpaceBar:
      return createSpaceBarGraphic();
    case EntityGraphicStyle.SpaceApartments:
      return createSpaceApartmentsGraphic();
    case EntityGraphicStyle.Pirate:
      return createPirateShipOutOfShapes();
    case EntityGraphicStyle.Police:
      return createPoliceShipOutOfShapes();
    case EntityGraphicStyle.CruiseShip:
      return createCruiseShipOutOfShapes();
    case EntityGraphicStyle.GalacticZoo:
      return createGalacticZooOutOfShapes();
    case EntityGraphicStyle.Miner2:
      return createMiner2ShipOutOfShapes();
    case EntityGraphicStyle.Trader2:
      return createTrader2ShipOutOfShapes();
    case EntityGraphicStyle.Bartender2:
      return createBartender2ShipOutOfShapes();
    case EntityGraphicStyle.Default:
    default:
      return createSpaceShipOutOfShapes();
  }
}