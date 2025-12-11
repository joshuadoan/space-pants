import { Actor, Scene, Vector, Rectangle } from "excalibur";
import { createSpaceShipOutOfShapes } from "./utils/createSpaceShipOutOfShapes";
import { Resources, type Goods } from "../types";
import type { GoodType } from "../types";
import type { Game } from "./Game";
import {
  LogicRuleActionType,
  MeepleStateType,
  MeepleType,
  type LogicRule,
  type MeepleState,
} from "./types";
import { getGoodColor, getGoodWithMostAmount } from "../utils/goodsUtils";
import { evaluateRule } from "../utils/ruleUtils";

const MAX_ACIONS_BEFORE_GOING_HOME = 10;

export class Meeple extends Actor {
  speed: number;
  name: string;
  goods: Partial<Goods>;
  rules: LogicRule[];
  state: MeepleState;
  type: MeepleType;
  visitors: Set<Meeple>;
  private followers: Map<GoodType, Actor> = new Map();

  private lastUpdateTime: number = 0;
  private homePosition: Vector;
  private actionCount: number = 0;

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
      [Resources.Treasure]: 0,
    };
    this.rules = [];
    const meepleDesign = createSpaceShipOutOfShapes();
    this.graphics.add(meepleDesign);
    this.state = {
      type: MeepleStateType.Idle,
    };
    this.type = this.constructor.name as MeepleType;
    this.visitors = new Set();
    this.homePosition = position.clone();
    this.actionCount = 0;
  }
  onInitialize(_engine: Game): void {
    // if (this.state.type !== MeepleStateType.Idle) return;
    
    // Only create followers for miner and trader type meeples
    // Followers will be created dynamically in onPreUpdate based on goods
    if (this.type !== MeepleType.Miner && this.type !== MeepleType.Trader) return;
  }

  onPreKill(_scene: Scene): void {
    // Clean up all followers when the meeple is removed
    for (const follower of this.followers.values()) {
      follower.kill();
    }
    this.followers.clear();
  }

  private updateFollowers(): void {
    // Get all goods except Money
    const goodsWithFollowers = Object.keys(this.goods).filter(
      (good): good is GoodType => good !== Resources.Money
    );

    // Remove followers for goods that are now 0 or don't exist
    for (const [good, follower] of this.followers.entries()) {
      const quantity = this.goods[good] ?? 0;
      if (quantity <= 0) {
        follower.kill();
        this.followers.delete(good);
      }
    }

    // Create followers for goods > 0 that don't have followers yet
    for (const good of goodsWithFollowers) {
      const quantity = this.goods[good] ?? 0;
      if (quantity > 0 && !this.followers.has(good)) {
        this.createFollower(good);
      }
    }
  }

  private createFollower(good: GoodType): void {
    // Calculate distance based on good type to spread followers around
    const goodTypes = Object.keys(this.goods).filter(
      (g): g is GoodType => g !== Resources.Money
    );
    const goodIndex = goodTypes.indexOf(good);
    const baseDistance = 30;
    const distance = baseDistance + (goodIndex * 5); // Slightly different distances

    // Create a tiny square follower
    const follower = new Actor({
      pos: this.pos.clone(),
      width: 4,
      height: 4,
    });

    // Create a small square graphic with color based on good type
    const square = new Rectangle({
      width: 4,
      height: 4,
      color: getGoodColor(good),
    });
    follower.graphics.add(square);

    // Add follower to the scene
    this.scene?.add(follower);

    // Make the follower follow this meeple at a distance
    follower.actions.follow(this, distance);
    
    this.followers.set(good, follower);
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

    // Manage followers based on goods (excluding money)
    if (this.type === MeepleType.Miner || this.type === MeepleType.Trader) {
      this.updateFollowers();
    }

    if (!this.actions.getQueue().isComplete()) return;

    const currentTime = Date.now();
    if (currentTime - this.lastUpdateTime < 1000) return;
    this.lastUpdateTime = currentTime;

    // Check if meeple needs to go home
    if (this.actionCount >= MAX_ACIONS_BEFORE_GOING_HOME) {
      this.goHome();
      return;
    }

    for (const rule of this.rules) {
      if (evaluateRule(rule, this.goods[rule.good] ?? 0)) {
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
      case LogicRuleActionType.SellTreasure:
        this.executeSellTreasure();
        break;
    }
  }

  private executeMineOre(): void {
    const asteroid = this.getRandomAsteroid();
    if (!asteroid) return;

    this.actionCount++;
    this.visitTarget(asteroid, MeepleStateType.Mining, () => {
      this.transact("add", Resources.Ore, 10);
      asteroid.transact("remove", Resources.Ore, 10);
    }, 3000);
  }

  private executeTradeOreForMoney(): void {
    const station = this.getRandomStation();
    if (!station) return;

    this.actionCount++;
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

    this.actionCount++;
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

    this.actionCount++;
    this.visitTarget(station, MeepleStateType.Trading, () => {
      const good = getGoodWithMostAmount(station.goods);
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

    this.actionCount++;
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

  private executeSellTreasure(): void {
    const treasureCollector = this.getRandomTreasureCollector();
    if (!treasureCollector) return;

    const treasureAmount = this.goods[Resources.Treasure] ?? 0;
    if (treasureAmount <= 0) return;

    this.actionCount++;
    this.visitTarget(treasureCollector, MeepleStateType.Trading, () => {
      this.transact("remove", Resources.Treasure, 1);
      this.transact("add", Resources.Money, 100);
      treasureCollector.transact("add", Resources.Treasure, 1);
      treasureCollector.transact("remove", Resources.Money, 100);
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

  private goHome(): void {
    this.actions
      .callMethod(() => {
        // Use 'this' as target for state type compatibility (not actually used)
        this.state = {
          type: MeepleStateType.Traveling,
          target: this,
        };
      })
      .moveTo(this.homePosition, this.speed)
      .delay(10000) // Wait 10 seconds at home
      .callMethod(() => {
        this.actionCount = 0; // Reset action counter
        this.state = {
          type: MeepleStateType.Idle,
        };
      });
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

  getRandomTreasureCollector(): Meeple | undefined {
    const meeples = this.scene?.actors.filter(
      (a: Actor) => a instanceof Meeple
    );
    const treasureCollectors = meeples?.filter(
      (meeple: Meeple) => meeple.type === MeepleType.TreasureCollector
    );
    return (
      treasureCollectors?.[Math.floor(Math.random() * treasureCollectors.length)] ?? undefined
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

}
