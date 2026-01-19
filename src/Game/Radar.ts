import { Actor, Circle, Color, CollisionType } from "excalibur";
import { Meeple } from "./Meeple";

/**
 * Radar visualization that displays a circle around a meeple.
 * The radar is hidden by default and can be shown when useRadar is called.
 */
export class Radar extends Actor {
  private meeple: Meeple;

  constructor(meeple: Meeple) {
    // Use the meeple's radar radius for both detection and visualization
    const radius = meeple.radarRadius;
    
    // Actor size should be diameter (2 * radius) to properly contain the circle
    super({
      width: radius * 2,
      height: radius * 2,
      collisionType: CollisionType.PreventCollision,
    });

    this.meeple = meeple;

    // Create a circle graphic for the radar (soft purple with high transparency)
    // Radius should match the detection radius in world coordinates (not multiplied by zoom)
    const circle = new Circle({
      radius: radius,
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
