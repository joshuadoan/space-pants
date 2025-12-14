import { Actor, Rectangle, Vector, Color } from "excalibur";

/**
 * Laser projectile fired by pirates during chase.
 * A tiny orange square that travels in a straight line and disappears after 2 seconds.
 */
export class Laser extends Actor {
  private spawnTime: number;
  private readonly lifetime: number = 2000; // 2 seconds in milliseconds (travels twice as far)

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

  onPreUpdate(): void {
    // Check if laser should be destroyed (after 2 seconds)
    const elapsed = Date.now() - this.spawnTime;
    if (elapsed >= this.lifetime) {
      this.kill();
    }
  }
}

