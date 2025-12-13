import { Actor, Scene, Vector, Rectangle } from "excalibur";
import { createSpaceShipOutOfShapes } from "./utils/createSpaceShipOutOfShapes";
import { MeepleStats, Resources, Products, type Goods, type GoodType } from "./types";
import type { Game } from "./Game";
import {
  LogicRuleActionType,
  MeepleStateType,
  MeepleType,
  type LogicRule,
  type MeepleState,
} from "./types";
import { getGoodColor } from "../utils/goodsUtils";
import { evaluateRule } from "../utils/ruleUtils";
import {
  DEFAULT_HEALTH,
  DEFAULT_ENERGY,
  MEEPLE_SIZE,
  MINING_ORE_AMOUNT,
  MINING_TREASURE_CHANCE,
  TRADE_ORE_AMOUNT,
  TRADE_MONEY_AMOUNT,
  WORK_EARNINGS,
  TREASURE_SELL_PRICE,
  MINING_DELAY_MS,
  TRADING_DELAY_MS,
  SOCIALIZING_DELAY_MS,
  WORKING_DELAY_MS,
  CHILLING_DELAY_MS,
  SHOPPING_DELAY_MS,
  SELLING_DELAY_MS,
  SELL_TREASURE_DELAY_MS,
  DEFAULT_TRANSACTION_TIME_MS,
  MEEPLE_UPDATE_INTERVAL_MS,
  FOLLOWER_BASE_DISTANCE,
  FOLLOWER_DISTANCE_INCREMENT,
  FOLLOWER_SIZE,
  PRODUCT_SELL_PRICE,
} from "./game-config";

export class Meeple extends Actor {
  speed: number;
  name: string;
  goods: Partial<Goods>;
  rules: LogicRule[];
  state: MeepleState;
  type: MeepleType;
  visitors: Set<Meeple>;
  activeRuleId: string | null = null;
  private followers: Map<GoodType, Actor> = new Map();

  private lastUpdateTime: number = 0;

  constructor(
    position: Vector,
    speed: number,
    name: string,
    width: number = MEEPLE_SIZE.WIDTH,
    height: number = MEEPLE_SIZE.HEIGHT
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
      [MeepleStats.Health]: DEFAULT_HEALTH,
      [MeepleStats.Energy]: DEFAULT_ENERGY,
    };
    // Initialize all products to 0
    Object.values(Products).forEach((product) => {
      this.goods[product] = 0;
    });
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
    // Get all goods except Money and Stats (Health, Energy)
    const goodsWithFollowers = Object.keys(this.goods).filter(
      (good): good is GoodType => 
        good !== Resources.Money && 
        !Object.values(MeepleStats).includes(good as MeepleStats)
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
      (g): g is GoodType => 
        g !== Resources.Money && 
        !Object.values(MeepleStats).includes(g as MeepleStats)
    );
    const goodIndex = goodTypes.indexOf(good);
    const distance = FOLLOWER_BASE_DISTANCE + (goodIndex * FOLLOWER_DISTANCE_INCREMENT);

    // Create a tiny square follower
    const follower = new Actor({
      pos: this.pos.clone(),
      width: FOLLOWER_SIZE,
      height: FOLLOWER_SIZE,
    });

    // Create a small square graphic with color based on good type
    const square = new Rectangle({
      width: FOLLOWER_SIZE,
      height: FOLLOWER_SIZE,
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
    if (currentTime - this.lastUpdateTime < MEEPLE_UPDATE_INTERVAL_MS) return;
    this.lastUpdateTime = currentTime;

    let ruleMatched = false;
    for (const rule of this.rules) {
      if (evaluateRule(rule, this.goods[rule.good] ?? 0)) {
        this.activeRuleId = rule.id;
        this.executeRuleAction(rule.action);
        ruleMatched = true;
        break; // Only execute one rule per update cycle
      }
    }
    // Clear active rule if no rule matched and meeple is idle
    if (!ruleMatched && this.state.type === MeepleStateType.Idle) {
      this.activeRuleId = null;
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
      case LogicRuleActionType.Work:
        this.executeWork();
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
      case LogicRuleActionType.ChillAtHome:
        this.executeChillingAtHome();
        break;
    }
  }

  private executeMineOre(): void {
    const asteroid = this.getRandomAsteroid();
    if (!asteroid) return;

    // Double-check that the asteroid has ore before attempting to mine
    const asteroidOre = asteroid.goods[Resources.Ore] ?? 0;
    if (asteroidOre <= 0) return;

    this.visitTarget(asteroid, MeepleStateType.Mining, () => {
      // Check again at mining time to ensure asteroid still has ore
      const currentAsteroidOre = asteroid.goods[Resources.Ore] ?? 0;
      if (currentAsteroidOre > 0) {
        const actualMiningAmount = Math.min(MINING_ORE_AMOUNT, currentAsteroidOre);
        this.transact("add", Resources.Ore, actualMiningAmount);
        asteroid.transact("remove", Resources.Ore, actualMiningAmount);
        
        // Rare chance to find treasure while mining
        if (Math.random() < MINING_TREASURE_CHANCE) {
          this.transact("add", Resources.Treasure, 1);
        }
      }
    }, MINING_DELAY_MS);
  }

  private executeTradeOreForMoney(): void {
    const station = this.getRandomStation();
    if (!station) return;

    this.visitTarget(station, MeepleStateType.Trading, () => {
      this.transact("remove", Resources.Ore, TRADE_ORE_AMOUNT);
      this.transact("add", Resources.Money, TRADE_MONEY_AMOUNT);
      station.transact("add", Resources.Ore, TRADE_ORE_AMOUNT);
      station.transact("remove", Resources.Money, TRADE_MONEY_AMOUNT);
    }, TRADING_DELAY_MS);
  }

  private executeSocialize(): void {
    const spaceBar = this.getRandomSpaceBar();
    if (!spaceBar) return;

    const moneyAmount = this.goods[Resources.Money] ?? 0;
    this.visitTarget(spaceBar, MeepleStateType.Socializing, () => {
      this.transact("remove", Resources.Money, moneyAmount);
      spaceBar.transact("add", Resources.Money, moneyAmount);
      this.goods[MeepleStats.Energy] = DEFAULT_ENERGY; // Restore energy instead of setting to 0
    }, SOCIALIZING_DELAY_MS);
  }

  private executeWork(): void {
    const spaceBar = this.getRandomSpaceBar();
    if (!spaceBar) return;

    // Bartenders earn money from the space bar and lose energy from working
    this.visitTarget(spaceBar, MeepleStateType.Working, () => {
      this.transact("add", Resources.Money, WORK_EARNINGS);
      spaceBar.transact("remove", Resources.Money, WORK_EARNINGS);
      this.goods[MeepleStats.Energy] = 0; // Working exhausts them
    }, WORKING_DELAY_MS);
  }

  private executeChillingAtHome(): void {
    const spaceApartments = this.getRandomSpaceApartments();
    if (!spaceApartments) return;

    this.visitTarget(spaceApartments, MeepleStateType.Chilling, () => {
      this.goods[MeepleStats.Energy] = DEFAULT_ENERGY;
    }, CHILLING_DELAY_MS);
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
    // Find a random product type to buy
    const productTypes = Object.values(Products);
    const randomProductType = productTypes[Math.floor(Math.random() * productTypes.length)];
    
    // Find a station that produces this product
    const station = this.getRandomStationThatProduces(randomProductType);
    if (!station) return;

    this.visitTarget(station, MeepleStateType.Trading, () => {
      // Buy the product that this station produces
      const productType = "productType" in station ? (station as any).productType as Products : undefined;
      if (productType && station.goods[productType] && station.goods[productType] >= 1) {
        this.transact("add", productType, 1);
        station.transact("remove", productType, 1);
        this.transact("remove", Resources.Money, PRODUCT_SELL_PRICE);
        station.transact("add", Resources.Money, PRODUCT_SELL_PRICE);
      }
    }, SHOPPING_DELAY_MS);
  }

  private executeGoSelling(): void {
    // Find products the trader has
    const products = Object.keys(this.goods).filter(
      (good): good is Products =>
        Object.values(Products).includes(good as Products) &&
        (this.goods as Record<string, number>)[good] > 0
    );

    if (products.length === 0) return;

    // Pick a random product to sell
    const productToSell = products[Math.floor(Math.random() * products.length)];
    
    // Find a station that does NOT produce this product (so they want to buy it)
    const station = this.getRandomStationThatDoesNotProduce(productToSell);
    if (!station) return;

    this.visitTarget(station, MeepleStateType.Trading, () => {
      const quantity = this.goods[productToSell] ?? 0;
      if (quantity > 0) {
        this.transact("remove", productToSell, quantity);
        station.transact("add", productToSell, quantity);
        this.transact("add", Resources.Money, quantity * PRODUCT_SELL_PRICE);
        station.transact("remove", Resources.Money, quantity * PRODUCT_SELL_PRICE);
      }
    }, SELLING_DELAY_MS);
  }

  private executeSellTreasure(): void {
    const treasureCollector = this.getRandomTreasureCollector();
    if (!treasureCollector) return;

    const treasureAmount = this.goods[Resources.Treasure] ?? 0;
    if (treasureAmount <= 0) return;

    this.visitTarget(treasureCollector, MeepleStateType.Trading, () => {
      this.transact("remove", Resources.Treasure, 1);
      this.transact("add", Resources.Money, TREASURE_SELL_PRICE);
      treasureCollector.transact("add", Resources.Treasure, 1);
      treasureCollector.transact("remove", Resources.Money, TREASURE_SELL_PRICE);
    }, SELL_TREASURE_DELAY_MS);
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
        // Type assertion is safe because visitTarget is only called with state types that require a target
        this.state = {
          type: activeStateType,
          target,
        } as MeepleState;
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

  getRandomVisitor(): Meeple | undefined {
    const visitors = Array.from(this.visitors);
    return visitors[Math.floor(Math.random() * visitors.length)] ?? undefined;
  }

  getRandomAsteroid(): Meeple | undefined {
    const meeples = this.scene?.actors.filter(
      (a: Actor) => a instanceof Meeple
    );
    const asteroids = meeples?.filter(
      (meeple: Meeple) => 
        meeple.type === MeepleType.Asteroid && 
        meeple !== this &&
        (meeple.goods[Resources.Ore] ?? 0) > 0 // Only return asteroids with ore
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
      (meeple: Meeple) => meeple.type === MeepleType.SpaceStation && meeple !== this
    );
    return stations?.[Math.floor(Math.random() * stations.length)] ?? undefined;
  }

  /**
   * Gets a random station that produces the specified product type.
   * Used by traders to find stations to buy products from.
   */
  getRandomStationThatProduces(productType: Products): Meeple | undefined {
    const meeples = this.scene?.actors.filter(
      (a: Actor) => a instanceof Meeple
    );
    const stations = meeples?.filter(
      (meeple: Meeple) =>
        meeple.type === MeepleType.SpaceStation &&
        meeple !== this &&
        // Check if meeple has productType property (SpaceStation has this)
        "productType" in meeple &&
        (meeple as any).productType === productType
    );
    return stations?.[Math.floor(Math.random() * stations.length)] ?? undefined;
  }

  /**
   * Gets a random station that does NOT produce the specified product type.
   * Used by traders to find stations to sell products to.
   */
  getRandomStationThatDoesNotProduce(productType: Products): Meeple | undefined {
    const meeples = this.scene?.actors.filter(
      (a: Actor) => a instanceof Meeple
    );
    const stations = meeples?.filter(
      (meeple: Meeple) =>
        meeple.type === MeepleType.SpaceStation &&
        meeple !== this &&
        // Check if meeple has productType property (SpaceStation has this)
        "productType" in meeple &&
        (meeple as any).productType !== productType
    );
    return stations?.[Math.floor(Math.random() * stations.length)] ?? undefined;
  }

  getRandomSpaceBar(): Meeple | undefined {
    const meeples = this.scene?.actors.filter(
      (a: Actor) => a instanceof Meeple
    );
    const spaceBars = meeples?.filter(
      (meeple: Meeple) => meeple.type === MeepleType.SpaceBar && meeple !== this
    );
    return (
      spaceBars?.[Math.floor(Math.random() * spaceBars.length)] ?? undefined
    );
  }

  getRandomSpaceApartments(): Meeple | undefined {
    const meeples = this.scene?.actors.filter(
      (a: Actor) => a instanceof Meeple
    );
    const spaceApartments = meeples?.filter(
      (meeple: Meeple) => meeple.type === MeepleType.SpaceApartments && meeple !== this
    );
    return (
      spaceApartments?.[Math.floor(Math.random() * spaceApartments.length)] ?? undefined
    );
  }

  getRandomTreasureCollector(): Meeple | undefined {
    const meeples = this.scene?.actors.filter(
      (a: Actor) => a instanceof Meeple
    );
    const treasureCollectors = meeples?.filter(
      (meeple: Meeple) => meeple.type === MeepleType.TreasureCollector && meeple !== this
    );
    return (
      treasureCollectors?.[Math.floor(Math.random() * treasureCollectors.length)] ?? undefined
    );
  }

  transact(
    type: "add" | "remove",
    good: GoodType,
    quantity: number,
    transactionTime: number = DEFAULT_TRANSACTION_TIME_MS
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
