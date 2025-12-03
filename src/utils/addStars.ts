import { Vector, Color } from "excalibur";
import type { Game } from "../entities/Game";
import { StarEntity } from "../entities/Star";

export function addStars(game: Game) {
  // Create a grid of solid white stars
  // Increased spacing from 50 to 80 to reduce star count (~60% reduction)
  const starSpacing = 80; // Increased from 50 to reduce GPU load

  const stars: StarEntity[] = [];

  for (let x = 0; x < game.worldWidth; x += starSpacing) {
    for (let y = 0; y < game.worldHeight; y += starSpacing) {
      // Random size variation
      const size = 2 + Math.random() * 3; // Stars between 2-5 pixels

      const star = new StarEntity(new Vector(x, y), Color.White, size);
      stars.push(star);
      game.currentScene.add(star);
    }
  }

  // Set up viewport culling - only render stars visible in camera
  const camera = game.currentScene.camera;
  const padding = 100; // Extra padding to prevent pop-in at edges

  game.currentScene.on('preupdate', () => {
    // Calculate viewport bounds from camera position, zoom, and screen dimensions
    const cameraPos = camera.pos;
    const zoom = camera.zoom;
    const screenWidth = game.drawWidth;
    const screenHeight = game.drawHeight;
    
    // Calculate world-space viewport dimensions (accounting for zoom)
    const viewportWidth = screenWidth / zoom;
    const viewportHeight = screenHeight / zoom;
    
    // Calculate camera bounds with padding
    const left = cameraPos.x - viewportWidth / 2 - padding;
    const right = cameraPos.x + viewportWidth / 2 + padding;
    const top = cameraPos.y - viewportHeight / 2 - padding;
    const bottom = cameraPos.y + viewportHeight / 2 + padding;

    // Update visibility for each star based on camera bounds
    for (const star of stars) {
      const starX = star.pos.x;
      const starY = star.pos.y;
      const starSize = star.width / 2; // Half width for bounds check

      // Check if star is within camera viewport (with padding)
      const isVisible = (
        starX + starSize >= left &&
        starX - starSize <= right &&
        starY + starSize >= top &&
        starY - starSize <= bottom
      );
      // Use graphics.visible as a workaround for TypeScript type issue
      if (star.graphics) {
        star.graphics.visible = isVisible;
      }
    }
  });
}
