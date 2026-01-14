import { KeyEvent, Keys, PointerEvent } from "excalibur";

import type { Game } from "../Game/Game";
import { PLAYER_SPEED } from "../consts";

export function keyboardControls(game: Game) {
    const camera = game.currentScene.camera;
    
    game.input.keyboard.on("hold", (evt: KeyEvent) => {
      if (evt.key === Keys.ArrowLeft) {
        const newX = camera.pos.x - PLAYER_SPEED;
        if (newX >= 0) {
          camera.pos.x = newX;
        }
      }
      if (evt.key === Keys.ArrowRight) {
        const newX = camera.pos.x + PLAYER_SPEED;
        if (newX <= game.worldWidth) {
          camera.pos.x = newX;
        }
      }
      if (evt.key === Keys.ArrowUp) {
        const newY = camera.pos.y - PLAYER_SPEED;
        if (newY >= 0) {
          camera.pos.y = newY;
        }
      }
      if (evt.key === Keys.ArrowDown) {
        const newY = camera.pos.y + PLAYER_SPEED;
        if (newY <= game.worldHeight) {
          camera.pos.y = newY;
        }
      }
    });

    // Touch controls for mobile
    let touchStartPos: { x: number; y: number } | null = null;
    let isDragging = false;
    let lastTouchPos: { x: number; y: number } | null = null;
    const SWIPE_THRESHOLD = 30; // Minimum distance for a swipe
    const DRAG_THRESHOLD = 5; // Minimum distance to start dragging

    // Handle pointer down (touch start)
    game.input.pointers.primary.on("down", (evt: PointerEvent) => {
      // Use screen coordinates for more intuitive dragging
      touchStartPos = { x: evt.screenPos.x, y: evt.screenPos.y };
      lastTouchPos = { x: evt.screenPos.x, y: evt.screenPos.y };
      isDragging = false;
    });

    // Handle pointer move (touch move / drag)
    game.input.pointers.primary.on("move", (evt: PointerEvent) => {
      if (!touchStartPos || !lastTouchPos) return;

      const deltaX = evt.screenPos.x - lastTouchPos.x;
      const deltaY = evt.screenPos.y - lastTouchPos.y;
      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

      // Start dragging if moved enough
      if (!isDragging && distance > DRAG_THRESHOLD) {
        isDragging = true;
      }

      // If dragging, pan the camera (move camera opposite to drag direction)
      if (isDragging) {
        const newX = camera.pos.x - deltaX;
        const newY = camera.pos.y - deltaY;
        
        if (newX >= 0 && newX <= game.worldWidth) {
          camera.pos.x = newX;
        }
        if (newY >= 0 && newY <= game.worldHeight) {
          camera.pos.y = newY;
        }
      }

      lastTouchPos = { x: evt.screenPos.x, y: evt.screenPos.y };
    });

    // Handle pointer up (touch end) - detect swipe gestures
    game.input.pointers.primary.on("up", (evt: PointerEvent) => {
      if (!touchStartPos) return;

      const deltaX = evt.screenPos.x - touchStartPos.x;
      const deltaY = evt.screenPos.y - touchStartPos.y;
      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

      // If it was a drag, don't treat it as a swipe
      if (isDragging) {
        touchStartPos = null;
        lastTouchPos = null;
        isDragging = false;
        return;
      }

      // Detect swipe gestures
      if (distance > SWIPE_THRESHOLD) {
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        // Determine primary direction
        if (absDeltaX > absDeltaY) {
          // Horizontal swipe
          if (deltaX < 0) {
            // Swipe left - move camera right
            const newX = camera.pos.x + PLAYER_SPEED * 10;
            if (newX <= game.worldWidth) {
              camera.pos.x = newX;
            }
          } else {
            // Swipe right - move camera left
            const newX = camera.pos.x - PLAYER_SPEED * 10;
            if (newX >= 0) {
              camera.pos.x = newX;
            }
          }
        } else {
          // Vertical swipe
          if (deltaY < 0) {
            // Swipe up - move camera down
            const newY = camera.pos.y + PLAYER_SPEED * 10;
            if (newY <= game.worldHeight) {
              camera.pos.y = newY;
            }
          } else {
            // Swipe down - move camera up
            const newY = camera.pos.y - PLAYER_SPEED * 10;
            if (newY >= 0) {
              camera.pos.y = newY;
            }
          }
        }
      }

      touchStartPos = null;
      lastTouchPos = null;
      isDragging = false;
    });
  }