import { GraphicsGroup, Rectangle, Vector, Color } from "excalibur";
import { STATION_COLORS } from "./SpaceStation";

export function createRandomSpaceStation(): GraphicsGroup {
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
