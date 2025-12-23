import { Color, Rectangle, Vector, GraphicsGroup } from "excalibur";

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

