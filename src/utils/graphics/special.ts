import { Color, Rectangle, Vector, GraphicsGroup } from "excalibur";

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

