import { Circle, Color, TileMap, Vector } from "excalibur";

import type { Game } from "../entities/Game";

/**
 * Creates a tilemap-based starfield background for the game.
 * Uses Excalibur's TileMap for better performance than individual star entities.
 * 
 * @param game - The game instance to add the star tilemap to
 */
export function createStarTilemap(game: Game): TileMap {
  // Tile size - larger tiles mean fewer tiles to manage
  const TILE_SIZE = 32;
  
  // Calculate number of tiles needed to cover the world
  const rows = Math.ceil(game.worldHeight / TILE_SIZE);
  const columns = Math.ceil(game.worldWidth / TILE_SIZE);
  
  // Create the tilemap
  const tilemap = new TileMap({
    rows,
    columns,
    tileWidth: TILE_SIZE,
    tileHeight: TILE_SIZE,
    pos: new Vector(0, 0), // Start at origin
  });
  
  // Star density - probability that a tile will have a star (0.0 to 1.0)
  const STAR_DENSITY = 0.15; // 15% of tiles will have stars
  
  // Create star graphics of different sizes and colors
  const starSizes = [1, 1.5, 2, 2.5, 3];
  const starColors = [
    Color.White,
    Color.fromHex("#E8E8E8"), // Slightly dimmed
    Color.fromHex("#D0D0D0"), // More dimmed
    Color.fromHex("#B8B8B8"), // Even more dimmed
  ];
  
  // Loop through all tiles and randomly add stars
  for (const tile of tilemap.tiles) {
    // Random chance to add a star to this tile
    if (Math.random() < STAR_DENSITY) {
      // Pick random size and color
      const size = starSizes[Math.floor(Math.random() * starSizes.length)];
      const color = starColors[Math.floor(Math.random() * starColors.length)];
      
      // Create a star graphic (simple circle)
      const starGraphic = new Circle({
        radius: size,
        color: color,
      });
      
      // Add the star graphic to the tile
      // The graphic will be centered in the tile by default
      tile.addGraphic(starGraphic);
    }
  }
  
  // Add the tilemap to the scene
  // Set z-index to be behind everything else
  tilemap.z = -1000;
  return tilemap;
}

