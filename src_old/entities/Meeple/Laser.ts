import { Actor, Color, Rectangle, Vector } from "excalibur";

import { Meeple } from "./Meeple";

/**
 * Laser projectile fired by pirates during chase.
 * A tiny orange square that travels in a straight line and disappears after 2 seconds.
 * Damages ships (Traders, Miners, and Players) on impact, reducing health by 10.
 */
export class Laser extends Actor {
  private spawnTime: number;
  private readonly lifetime: number = 2000; // 2 seconds in milliseconds (travels twice as far)
  readonly owner: Meeple; // The meeple that fired this laser

  constructor(
    position: Vector,
    direction: Vector,
    owner: Meeple,
    speed: number = 200
  ) {
    const laserSize = 4; // Tiny square
    
    super({
      pos: position.clone(),
      width: laserSize,
      height: laserSize,
    });

    this.owner = owner;
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
    // Collision handling is done in Meeple.onCollisionStart
  }

  onPreUpdate(): void {
    // Check if laser should be destroyed (after 2 seconds)
    const elapsed = Date.now() - this.spawnTime;
    if (elapsed >= this.lifetime) {
      this.kill();
    }
  }
}

