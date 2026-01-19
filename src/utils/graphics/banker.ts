import { Color, Rectangle, Vector, GraphicsGroup } from "excalibur";

// Banker-specific color palette - professional/financial themed
const BANKER_COLORS = [
  Color.fromHex("#2C3E50"), // Dark blue-gray
  Color.fromHex("#34495E"), // Wet asphalt
  Color.fromHex("#5D6D7E"), // Blue-gray
  Color.fromHex("#7F8C8D"), // Gray
  Color.fromHex("#95A5A6"), // Light gray
  Color.fromHex("#F39C12"), // Orange
  Color.fromHex("#F1C40F"), // Yellow
  Color.fromHex("#E67E22"), // Carrot
  Color.fromHex("#D35400"), // Pumpkin
  Color.fromHex("#C0392B"), // Dark red
  Color.fromHex("#1A252F"), // Very dark blue
  Color.fromHex("#ECF0F1"), // Light silver
];

export function createBankerShipOutOfShapes(): GraphicsGroup {
  const blocks: { rect: Rectangle; offset: Vector }[] = [];
  
  // Generate a random seed for this banker design
  const seed = Math.random();
  
  // Select random colors from banker palette
  const primaryColor = BANKER_COLORS[Math.floor(Math.random() * BANKER_COLORS.length)];
  const secondaryColor = BANKER_COLORS[Math.floor(Math.random() * BANKER_COLORS.length)];
  const accentColor = BANKER_COLORS[Math.floor(Math.random() * BANKER_COLORS.length)];
  
  // Banker design patterns - professional/financial themed
  const pattern = Math.floor(seed * 4); // 4 different patterns
  
  switch (pattern) {
    case 0: // Classic banker - sleek with briefcase
      blocks.push({ rect: new Rectangle({ width: 10, height: 8, color: primaryColor }), offset: new Vector(0, 0) }); // Main body
      blocks.push({ rect: new Rectangle({ width: 8, height: 4, color: accentColor }), offset: new Vector(0, 6) }); // Briefcase
      blocks.push({ rect: new Rectangle({ width: 3, height: 2, color: secondaryColor }), offset: new Vector(-6, -4) }); // Left document
      blocks.push({ rect: new Rectangle({ width: 3, height: 2, color: secondaryColor }), offset: new Vector(6, -4) }); // Right document
      blocks.push({ rect: new Rectangle({ width: 4, height: 2, color: accentColor }), offset: new Vector(0, -6) }); // Top hat/visor
      break;
      
    case 1: // Mobile teller - wide with calculator/register
      blocks.push({ rect: new Rectangle({ width: 14, height: 6, color: primaryColor }), offset: new Vector(0, 0) }); // Main body
      blocks.push({ rect: new Rectangle({ width: 6, height: 4, color: accentColor }), offset: new Vector(-6, 1) }); // Calculator/register
      blocks.push({ rect: new Rectangle({ width: 2, height: 2, color: secondaryColor }), offset: new Vector(-4, 0) }); // Button 1
      blocks.push({ rect: new Rectangle({ width: 2, height: 2, color: secondaryColor }), offset: new Vector(-2, 0) }); // Button 2
      blocks.push({ rect: new Rectangle({ width: 2, height: 2, color: secondaryColor }), offset: new Vector(0, 0) }); // Button 3
      blocks.push({ rect: new Rectangle({ width: 2, height: 2, color: secondaryColor }), offset: new Vector(2, 0) }); // Button 4
      blocks.push({ rect: new Rectangle({ width: 6, height: 2, color: accentColor }), offset: new Vector(0, -5) }); // Top display
      break;
      
    case 2: // Compact financial advisor - vertical with portfolio
      blocks.push({ rect: new Rectangle({ width: 8, height: 10, color: primaryColor }), offset: new Vector(0, -1) }); // Main body
      blocks.push({ rect: new Rectangle({ width: 4, height: 3, color: accentColor }), offset: new Vector(0, -7) }); // Portfolio top
      blocks.push({ rect: new Rectangle({ width: 3, height: 2, color: secondaryColor }), offset: new Vector(-5, 1) }); // Left chart
      blocks.push({ rect: new Rectangle({ width: 3, height: 2, color: secondaryColor }), offset: new Vector(5, 1) }); // Right chart
      blocks.push({ rect: new Rectangle({ width: 6, height: 2, color: accentColor }), offset: new Vector(0, 6) }); // Base
      break;
      
    case 3: // Professional banker - ornate design with coins/money
      blocks.push({ rect: new Rectangle({ width: 10, height: 8, color: primaryColor }), offset: new Vector(0, -1) }); // Body
      blocks.push({ rect: new Rectangle({ width: 3, height: 3, color: accentColor }), offset: new Vector(-6, 0) }); // Left coin stack
      blocks.push({ rect: new Rectangle({ width: 3, height: 3, color: accentColor }), offset: new Vector(6, 0) }); // Right coin stack
      blocks.push({ rect: new Rectangle({ width: 4, height: 3, color: secondaryColor }), offset: new Vector(0, -6) }); // Top decoration
      blocks.push({ rect: new Rectangle({ width: 6, height: 2, color: accentColor }), offset: new Vector(0, 5) }); // Briefcase platform
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
