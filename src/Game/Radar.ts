import { Actor, Circle, Color, CollisionType } from "excalibur";
import { Meeple } from "./Meeple";

/**
 * Radar visualization that displays a circle around a meeple.
 * The radar is hidden by default and can be shown when useRadar is called.
 */
export class Radar extends Actor {
  private meeple: Meeple;

  constructor(meeple: Meeple) {
    // Calculate radius based on meeple's size (using width/2 as radius)
    const radius = meeple.radarRadius;
    
    super({
      width: radius,
      height: radius,
      collisionType: CollisionType.PreventCollision,
    });

    this.meeple = meeple;

    // Create a circle graphic for the radar (soft purple with high transparency)
    const circle = new Circle({
      radius: radius * (meeple.scene?.camera.zoom ?? 1),
      color: Color.fromHex("#9B7ED624"), // Soft purple color with 14% opacity for radar
    });

    this.graphics.add(circle);

    // Hide by default
    this.hide();
  }

  /**
   * Shows the radar visualization
   */
  show(): void {
    this.graphics.isVisible = true;
  }

  /**
   * Hides the radar visualization
   */
  hide(): void {
    this.graphics.isVisible = false;
  }

  /**
   * Updates the radar position to follow the meeple
   */
  onPreUpdate(_engine: any, _delta: number): void {
    // Follow the meeple's position
    this.pos = this.meeple.pos.clone();
  }
}
