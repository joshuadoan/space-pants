import { Actor, Color, CollisionType, Rectangle } from "excalibur";
import { MeepleInventoryItem } from "../types";
import { Meeple } from "./Meeple";

/**
 * Laser projectile that fires from a meeple toward a target.
 * Appears as a small dash/line and destroys itself after a moment or on collision.
 */
export class LaserProjectile extends Actor {
  private target: Meeple;
  private speed: number = 300;
  private lifetime: number = 3000; // milliseconds
  private startTime: number;

  constructor(shooter: Meeple, target: Meeple) {
    super({
      width: 4,
      height: 4,
      collisionType: CollisionType.Passive,
    });

    this.target = target;
    this.startTime = Date.now();

    // Position at the shooter's position
    this.pos = shooter.pos.clone();

    // Calculate direction toward target
    const direction = target.pos.sub(shooter.pos).normalize();
    this.vel = direction.scale(this.speed);

    // Create a small cube graphic (square)
    const cube = new Rectangle({
      width: 4,
      height:4,
      color: Color.fromHex("#FF4444"), // Bright red
    });

    // Rotate the cube to point toward target
    this.rotation = direction.toAngle();

    this.graphics.add(cube);

    // Set up collision detection
    this.on("precollision", (evt) => {
      const otherActor = evt.other.owner;
      if (otherActor instanceof Meeple && otherActor === target) {
        /// distance between laser and target
        const distance = this.pos.distance(target.pos);
        if (distance > 10) {
          return;
        }
        otherActor.dispatch({
          type: "transact",
          transaction: {
            from: otherActor,
            to: shooter,
            property: MeepleInventoryItem.Money,
            quantity: 1,
          },
        })
        this.kill();
      }
    });
  }

  onPreUpdate(_engine: any, _delta: number): void {
    // Destroy after lifetime expires
    if (Date.now() - this.startTime > this.lifetime) {
      this.kill();
      return;
    }

    // If target is dead or removed, destroy projectile
    if (this.target.isKilled()) {
      this.kill();
      return;
    }

    // Check distance to target as a fallback collision detection
    const distanceToTarget = this.pos.distance(this.target.pos);
    if (distanceToTarget < 10) {
      // Close enough to consider it a hit
      this.kill();
      return;
    }

    // Update direction to track moving target
    const direction = this.target.pos.sub(this.pos).normalize();
    this.vel = direction.scale(this.speed);
    this.rotation = direction.toAngle();
  }
}
