import { Actor, Scene, Vector, Rectangle, Color } from "excalibur";
import { createSpaceShipOutOfShapes } from "./utils/createSpaceShipOutOfShapes";
import { Resources, type Goods } from "../types";
import type { GoodType } from "../types";
import type { Game } from "./Game";
import {
  ComparisonOperator,
  LogicRuleActionType,
  MeepleStateType,
  MeepleType,
  type LogicRule,
  type MeepleState,
} from "./types";

export class Meeple extends Actor {
  speed: number;
  name: string;
  goods: Partial<Goods>;
  rules: LogicRule[];
  state: MeepleState;
  type: MeepleType;
  visitors: Set<Meeple>;
  private follower: Actor | null = null;

  private lastUpdateTime: number = 0;

  constructor(
    position: Vector,
    speed: number,
    name: string,
    width: number = 20,
    height: number = 20
  ) {
    super({
      pos: position,
      width,
      height,
    });

    this.speed = speed;
    this.name = name;
    this.goods = {
      [Resources.Ore]: 0,
      [Resources.Money]: 0,
    };
    this.rules = [];
    const meepleDesign = createSpaceShipOutOfShapes();
    this.graphics.add(meepleDesign);
    this.state = {
      type: MeepleStateType.Idle,
    };
    this.type = this.constructor.name as MeepleType;
    this.visitors = new Set();
  }
  onInitialize(_engine: Game): void {
    // if (this.state.type !== MeepleStateType.Idle) return;
    
    // Create a tiny square follower
    this.follower = new Actor({
      pos: this.pos.clone(),
      width: 4,
      height: 4,
    });
    
    // Create a small square graphic
    const square = new Rectangle({
      width: 4,
      height: 4,
      color: Color.White,
    });
    this.follower.graphics.add(square);
    
    // Initially hide the follower (will be shown when meeple has ore)
    this.follower.graphics.visible = false;
    
    // Add follower to the scene
    this.scene?.add(this.follower);
    
    // Make the follower follow this meeple at a distance of 30 pixels
    this.follower.actions.follow(this, 30);
  }

  onPreKill(_scene: Scene): void {
    // Clean up the follower when the meeple is removed
    if (this.follower) {
      this.follower.kill();
      this.follower = null;
    }
  }

  onPreUpdate(_engine: Game): void {
    // Handle boundary checking for velocity-based movement
    const scene = this.scene as Scene;
    if (scene && scene.engine) {
      const game = scene.engine as Game;
      
      // Clamp position to world bounds and stop velocity at boundaries
      if (this.pos.x < 0) {
        this.pos.x = 0;
        if (this.vel.x < 0) this.vel.x = 0;
      }
      if (this.pos.x > game.worldWidth - this.width) {
        this.pos.x = game.worldWidth - this.width;
        if (this.vel.x > 0) this.vel.x = 0;
      }
      if (this.pos.y < 0) {
        this.pos.y = 0;
        if (this.vel.y < 0) this.vel.y = 0;
      }
      if (this.pos.y > game.worldHeight - this.height) {
        this.pos.y = game.worldHeight - this.height;
        if (this.vel.y > 0) this.vel.y = 0;
      }
    }

    // Show/hide follower based on whether meeple has ore
    if (this.follower) {
      const hasOre = (this.goods[Resources.Ore] ?? 0) > 0;
      this.follower.graphics.visible = hasOre;
    }

    if (!this.actions.getQueue().isComplete()) return;

    const currentTime = Date.now();
    if (currentTime - this.lastUpdateTime < 1000) return;
    this.lastUpdateTime = currentTime;

    for (const rule of this.rules) {
      if (this.evaluateRule(rule, this.goods[rule.good] ?? 0)) {
        this.executeRuleAction(rule.action);
        break; // Only execute one rule per update cycle
      }
    }
  }

  private executeRuleAction(action: LogicRuleActionType): void {
    switch (action) {
      case LogicRuleActionType.MineOre:
        this.executeMineOre();
        break;
      case LogicRuleActionType.TradeOreForMoney:
        this.executeTradeOreForMoney();
        break;
      case LogicRuleActionType.Socialize:
        this.executeSocialize();
        break;
      case LogicRuleActionType.GoShopping:
        this.executeGoShopping();
        break;
      case LogicRuleActionType.GoSelling:
        this.executeGoSelling();
        break;
    }
  }

  private executeMineOre(): void {
    const asteroid = this.getRandomAsteroid();
    if (!asteroid) return;

    this.visitTarget(asteroid, MeepleStateType.Mining, () => {
      this.transact("add", Resources.Ore, 10);
      asteroid.transact("remove", Resources.Ore, 10);
    }, 3000);
  }

  private executeTradeOreForMoney(): void {
    const station = this.getRandomStation();
    if (!station) return;

    this.visitTarget(station, MeepleStateType.Trading, () => {
      this.transact("remove", Resources.Ore, 10);
      this.transact("add", Resources.Money, 10);
      station.transact("add", Resources.Ore, 10);
      station.transact("remove", Resources.Money, 10);
    }, 5000);
  }

  private executeSocialize(): void {
    const spaceBar = this.getRandomSpaceBar();
    if (!spaceBar) return;

    const moneyAmount = this.goods[Resources.Money] ?? 0;
    this.visitTarget(spaceBar, MeepleStateType.Socializing, () => {
      this.transact("remove", Resources.Money, moneyAmount);
      spaceBar.transact("add", Resources.Money, moneyAmount);
    }, 3000);
  }

  moveDIrection(direction: "left" | "right" | "up" | "down"): void {
    // Use velocity for smooth, frame-rate independent movement
    // Boundary checking is handled in onPreUpdate
    switch (direction) {
      case "left":
        this.vel.x = -this.speed;
        break;
      case "right":
        this.vel.x = this.speed;
        break;
      case "up":
        this.vel.y = -this.speed;
        break;
      case "down":
        this.vel.y = this.speed;
        break;
    }
  }

  stopMovement(): void {
    this.vel.x = 0;
    this.vel.y = 0;
  }

  private executeGoShopping(): void {
    const station = this.getRandomStation();
    if (!station) return;

    this.visitTarget(station, MeepleStateType.Trading, () => {
      const good = this.getGoodWithMostAmmount(station);
      if (good && station.goods[good] && station.goods[good] >= 1) {
        this.transact("add", good, 1);
        station.transact("remove", good, 1);
        this.transact("remove", Resources.Money, 1);
        station.transact("add", Resources.Money, 1);
      }
    }, 3000);
  }

  private executeGoSelling(): void {
    const station = this.getRandomStation();
    if (!station) return;

    this.visitTarget(station, MeepleStateType.Trading, () => {
      const goods = Object.keys(this.goods).filter(
        (good): good is GoodType =>
          good !== Resources.Ore && good !== Resources.Money
      );
      for (const good of goods) {
        const quantity = this.goods[good] ?? 0;
        if (quantity > 0) {
          this.transact("remove", good, quantity);
          station.transact("add", good, quantity);
          this.transact("add", Resources.Money, quantity);
          station.transact("remove", Resources.Money, quantity);
        }
      }
    }, 3000);
  }

  private visitTarget(
    target: Meeple,
    activeStateType: MeepleStateType,
    actionCallback: () => void,
    delayMs: number
  ): void {
    this.actions
      .callMethod(() => {
        this.state = {
          type: MeepleStateType.Traveling,
          target,
        };
      })
      .meet(target, this.speed)
      .callMethod(() => target.visitors.add(this))
      .callMethod(() => {
        this.state = {
          type: activeStateType,
          target,
        };
      })
      .callMethod(actionCallback)
      .delay(delayMs)
      .callMethod(() => target.visitors.delete(this))
      .callMethod(() => {
        this.state = {
          type: MeepleStateType.Idle,
        };
      });
  }

  /// get good with most ammount that is not money or ore
  getGoodWithMostAmmount(station: Meeple): GoodType | undefined {
    const goods = Object.keys(station.goods).filter(
      (good): good is GoodType =>
        good !== Resources.Ore && good !== Resources.Money
    );
    if (!goods.length) {
      return undefined;
    }
    return goods.reduce(
      (max, good) =>
        (station.goods[good] ?? 0) > (station.goods[max] ?? 0) ? good : max,
      goods[0]
    );
  }

  getRandomVisitor(): Meeple | undefined {
    const visitors = Array.from(this.visitors);
    return visitors[Math.floor(Math.random() * visitors.length)] ?? undefined;
  }

  getRandomAsteroid(): Meeple | undefined {
    const meeples = this.scene?.actors.filter(
      (a: Actor) => a instanceof Meeple
    );
    const asteroids = meeples?.filter(
      (meeple: Meeple) => meeple.type === MeepleType.Asteroid
    );
    return (
      asteroids?.[Math.floor(Math.random() * asteroids.length)] ?? undefined
    );
  }

  getRandomStation(): Meeple | undefined {
    const meeples = this.scene?.actors.filter(
      (a: Actor) => a instanceof Meeple
    );
    const stations = meeples?.filter(
      (meeple: Meeple) => meeple.type === MeepleType.SpaceStation
    );
    return stations?.[Math.floor(Math.random() * stations.length)] ?? undefined;
  }

  getRandomSpaceBar(): Meeple | undefined {
    const meeples = this.scene?.actors.filter(
      (a: Actor) => a instanceof Meeple
    );
    const spaceBars = meeples?.filter(
      (meeple: Meeple) => meeple.type === MeepleType.SpaceBar
    );
    return (
      spaceBars?.[Math.floor(Math.random() * spaceBars.length)] ?? undefined
    );
  }

  transact(
    type: "add" | "remove",
    good: GoodType,
    quantity: number,
    transactionTime: number = 1000
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        switch (type) {
          case "add":
            this.goods[good] = (this.goods[good] || 0) + quantity;
            resolve();
            break;
          case "remove":
            this.goods[good] = (this.goods[good] || 0) - quantity;
            resolve();
            break;
          default:
            reject(new Error("Invalid transaction type"));
        }
      }, transactionTime);
    });
  }

  evaluateRule(rule: LogicRule, value: number): boolean {
    switch (rule.operator) {
      case ComparisonOperator.Equal:
        return value === rule.value;
      case ComparisonOperator.LessThan:
        return value < rule.value;
      case ComparisonOperator.GreaterThan:
        return value > rule.value;
      case ComparisonOperator.LessThanOrEqual:
        return value <= rule.value;
      case ComparisonOperator.GreaterThanOrEqual:
        return value >= rule.value;
      default:
        return false;
    }
  }
}
