import { Actor, Color, Polygon, Vector } from "excalibur";

export const createStarPoints = (
    outerRadius: number,
    innerRadius: number,
    points: number = 5
  ): Vector[] => {
    const starPoints: Vector[] = [];
    const angleStep = (Math.PI * 2) / (points * 2);
  
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = i * angleStep - Math.PI / 2; // Start from top
      starPoints.push(
        new Vector(Math.cos(angle) * radius, Math.sin(angle) * radius)
      );
    }
    return starPoints;
  };

  
export class StarEntity extends Actor {
    private starGraphic: Polygon;
  
    constructor(
      position: Vector,
      color: Color,
      size: number
    ) {
      const outerRadius = size;
      const innerRadius = size * 0.4;
  
      super({
        pos: position,
        width: size * 2,
        height: size * 2,
      });
  
      const starPoints = createStarPoints(outerRadius, innerRadius);
      this.starGraphic = new Polygon({
        points: starPoints,
        color: color,
      });
  
      this.graphics.add(this.starGraphic);
    }
  }