import { Actor, Color, Rectangle, Vector } from "excalibur";

import { MeepleStats, MeepleType } from "../types";
import { Meeple } from "./Meeple";

/**
 * Laser projectile fired by pirates during chase.
 * A tiny orange square that travels in a straight line and disappears after 2 seconds.
 * Damages ships (Traders, Miners, and Players) on impact, reducing health by 10.
 */
export class Laser extends Actor {
  private spawnTime: number;
  private readonly lifetime: number = 2000; // 2 seconds in milliseconds (travels twice as far)
  private hasHitTarget: boolean = false; // Track if laser has already hit something

  constructor(
    position: Vector,
    direction: Vector,
    speed: number = 200
  ) {
    const laserSize = 4; // Tiny square
    
    super({
      pos: position.clone(),
      width: laserSize,
      height: laserSize,
    });

    this.spawnTime = Date.now();
    
    // Normalize direction and set velocity
    const normalized = direction.normalize();
    this.vel.x = normalized.x * speed;
    this.vel.y = normalized.y * speed;

    // Create orange square graphic
    const square = new Rectangle({
      width: laserSize,
      height: laserSize,
      color: Color.fromHex("#FF8C00"), // Orange color
    });
    this.graphics.add(square);
  }

  onInitialize(): void {
    // Set up collision detection for ships
    this.on("collisionstart", (evt) => {
      if (this.hasHitTarget) return; // Don't process multiple hits
      
      const other = evt.other;
      // Check if the other actor is a Meeple (ship)
      if (other instanceof Meeple) {
        // Only damage ships: Traders, Miners, and Players
        if (
          other.type === MeepleType.Trader ||
          other.type === MeepleType.Miner ||
          other.type === MeepleType.Player
        ) {
          // Reduce health by 10
          other.dispatch({
            type: "remove-good",
            payload: { good: MeepleStats.Health, quantity: 10 },
          });
          
          // Mark as hit and destroy the laser
          this.hasHitTarget = true;
          this.kill();
        }
      }
    });
  }

  onPreUpdate(): void {
    // Check if laser should be destroyed (after 2 seconds)
    const elapsed = Date.now() - this.spawnTime;
    if (elapsed >= this.lifetime) {
      this.kill();
    }
  }
}

