import { Color, Rectangle, Vector, GraphicsGroup } from "excalibur";

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

export function createBankGraphic(): GraphicsGroup {
  const buildingColor = Color.fromHex("#2C3E50"); // Dark blue-gray
  const accentColor = Color.fromHex("#F39C12"); // Gold/orange for bank theme
  const windowColor = Color.fromHex("#F1C40F"); // Bright yellow for lit windows
  const windowDarkColor = Color.fromHex("#34495E"); // Dark for unlit windows
  const doorColor = Color.fromHex("#1A252F"); // Very dark for door
  const vaultColor = Color.fromHex("#7F8C8D"); // Gray for vault

  const blocks: { rect: Rectangle; offset: Vector }[] = [];
  
  // Main building body (rectangular, solid)
  blocks.push({ 
    rect: new Rectangle({ width: 32, height: 24, color: buildingColor }), 
    offset: new Vector(0, 0) 
  });
  
  // Top decorative cornice
  blocks.push({ 
    rect: new Rectangle({ width: 36, height: 4, color: accentColor }), 
    offset: new Vector(0, -14) 
  });
  
  // Vault door (circular, represented as square)
  blocks.push({ 
    rect: new Rectangle({ width: 12, height: 12, color: vaultColor }), 
    offset: new Vector(-8, 4) 
  });
  blocks.push({ 
    rect: new Rectangle({ width: 8, height: 8, color: doorColor }), 
    offset: new Vector(-8, 4) 
  });
  
  // Main entrance door
  blocks.push({ 
    rect: new Rectangle({ width: 8, height: 12, color: doorColor }), 
    offset: new Vector(8, 6) 
  });
  
  // Windows - create a grid pattern
  const windowSize = 4;
  const windowSpacing = 8;
  const startX = -6;
  const startY = -6;
  
  // First floor windows (2 windows)
  for (let i = 0; i < 2; i++) {
    const isLit = Math.random() > 0.4; // 60% chance of being lit
    blocks.push({ 
      rect: new Rectangle({ 
        width: windowSize, 
        height: windowSize, 
        color: isLit ? windowColor : windowDarkColor 
      }), 
      offset: new Vector(startX + i * windowSpacing, startY + 8) 
    });
  }
  
  // Second floor windows (2 windows)
  for (let i = 0; i < 2; i++) {
    const isLit = Math.random() > 0.4; // 60% chance of being lit
    blocks.push({ 
      rect: new Rectangle({ 
        width: windowSize, 
        height: windowSize, 
        color: isLit ? windowColor : windowDarkColor 
      }), 
      offset: new Vector(startX + i * windowSpacing, startY - 4) 
    });
  }
  
  // Gold accent bars (security bars)
  blocks.push({ 
    rect: new Rectangle({ width: 30, height: 2, color: accentColor }), 
    offset: new Vector(0, 10) 
  });
  blocks.push({ 
    rect: new Rectangle({ width: 30, height: 2, color: accentColor }), 
    offset: new Vector(0, -10) 
  });

  return new GraphicsGroup({
    members: blocks.map(block => ({
      graphic: block.rect,
      offset: block.offset,
    })),
  });
}

