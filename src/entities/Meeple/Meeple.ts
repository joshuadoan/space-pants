import { Actor, Scene, Vector } from "excalibur";
import {
  MeepleStats,
  Resources,
  Products,
  type Goods,
  type GoodType,
} from "../types";
import type { Game } from "../Game";
import {
  MeepleStateType,
  MeepleType,
  type LogicRule,
  type MeepleState,
} from "../types";
import { evaluateRule } from "../../utils/ruleUtils";
import {
  DEFAULT_HEALTH,
  DEFAULT_ENERGY,
  MEEPLE_SIZE,
  DEFAULT_TRANSACTION_TIME_MS,
  MEEPLE_UPDATE_INTERVAL_MS,
} from "../game-config";
import { meepleReducer } from "./meepleReducer";
import type { MeepleAction } from "./meepleTypes";
import { updateFollowers } from "./followers";
import { executeRuleAction } from "./executeRuleAction";

export class Meeple extends Actor {
  speed: number;
  name: string;
  goods: Partial<Goods>;
  rules: LogicRule[];
  state: MeepleState;
  type!: MeepleType; // Assigned by subclasses in their constructors
  visitors: Set<Meeple>;
  activeRuleId: string | null = null;
  productType: Products;
  home: Meeple | null = null; // Assigned home destination
  followers: Map<GoodType, Actor> = new Map(); // Made public for utility functions

  private lastUpdateTime: number = 0;

  /**
   * Dispatch an action to update state and goods
   */
  dispatch(action: MeepleAction): void {
    const newState = meepleReducer(
      {
        goods: this.goods,
        state: this.state,
      },
      action
    );
    this.goods = newState.goods;
    this.state = newState.state;
  }

  constructor(
    position: Vector,
    speed: number,
    name: string,
    productType: Products,
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
    this.productType = productType;
    // Initialize goods
    this.goods = {
      [Resources.Ore]: 0,
      [Resources.Money]: 0,
      [MeepleStats.Health]: DEFAULT_HEALTH,
      [MeepleStats.Energy]: DEFAULT_ENERGY,
    };
    // Initialize all products to 0
    Object.values(Products).forEach((product) => {
      this.goods[product] = 0;
    });
    this.rules = [];
    // Initialize state using reducer pattern
    this.state = {
      type: MeepleStateType.Idle,
    };
    // Type should be explicitly set in subclasses - don't rely on constructor.name
    // as it gets minified in production builds
    this.visitors = new Set();
  }

  onInitialize(_engine: Game): void {
    // Initialize lastUpdateTime to current time to ensure first update happens
    // This fixes an issue where meeples don't start moving in production builds
    this.lastUpdateTime = Date.now();

    // Only create followers for miner and trader type meeples
    // Followers will be created dynamically in onPreUpdate based on goods
    if (this.type !== MeepleType.Miner && this.type !== MeepleType.Trader)
      return;
  }

  onPreKill(_scene: Scene): void {
    // Clean up all followers when the meeple is removed
    for (const follower of this.followers.values()) {
      follower.kill();
    }
    this.followers.clear();
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
      updateFollowers(this);
    }

    // Only evaluate rules if action queue is complete (no active movement/actions)
    // This ensures meeples don't start new actions while already performing one
    try {
      if (!this.actions.getQueue().isComplete()) return;
    } catch (error) {
      // If action queue check fails (shouldn't happen, but be defensive in production),
      // log error and continue to allow rule evaluation
      console.warn("Action queue check failed for", this.name, error);
    }

    const currentTime = Date.now();
    // Ensure lastUpdateTime is initialized (defensive check for production builds)
    if (this.lastUpdateTime === 0) {
      this.lastUpdateTime = currentTime;
    }
    if (currentTime - this.lastUpdateTime < MEEPLE_UPDATE_INTERVAL_MS) return;
    this.lastUpdateTime = currentTime;

    let ruleMatched = false;
    for (const rule of this.rules) {
      // For product-type goods, use rule's productType or fall back to meeple's productType
      const isProductGood = Object.values(Products).includes(
        rule.good as Products
      );
      const goodToCheck =
        isProductGood && rule.productType
          ? rule.productType
          : isProductGood && !rule.productType
          ? this.productType
          : rule.good;

      if (evaluateRule(rule, this.goods[goodToCheck] ?? 0)) {
        this.activeRuleId = rule.id;
        executeRuleAction(this, rule);
        ruleMatched = true;
        break; // Only execute one rule per update cycle
      }
    }
    // Clear active rule if no rule matched and meeple is idle
    if (!ruleMatched && this.state.type === MeepleStateType.Idle) {
      this.activeRuleId = null;
    }
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
            this.dispatch({
              type: "add-good",
              payload: { good, quantity },
            });
            resolve();
            break;
          case "remove":
            this.dispatch({
              type: "remove-good",
              payload: { good, quantity },
            });
            resolve();
            break;
          default:
            reject(new Error("Invalid transaction type"));
        }
      }, transactionTime);
    });
  }
}

